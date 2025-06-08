// import {v2 as cloudinary} from 'cloudinary';
// import multer from 'multer';
// import path from 'path';

// // Configure multer for file upload
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/') // Make sure this directory exists
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + path.extname(file.originalname))
//     }
// });

// const upload = multer({ 
//     storage: storage,
//     limits: {
//         fileSize: 5 * 1024 * 1024 // 5MB limit
//     },
//     fileFilter: function (req, file, cb) {
//         const filetypes = /jpeg|jpg|png|gif/;
//         const mimetype = filetypes.test(file.mimetype);
//         const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

//         if (mimetype && extname) {
//             return cb(null, true);
//         }
//         cb(new Error('Only image files are allowed!'));
//     }
// }).single('file');

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
//     secure: true
// });

// const uploadImage = async (req, res) => {
//     // First handle the file upload with multer
//     console.log('api called');
//     upload(req, res, async function(err) {
//         if (err) {
//             return res.status(400).json({ success: false, error: err.message });
//         }

//         console.log('req.file',req.file);

//         try {
//             if (!req.file) {
//                 return res.status(400).json({ success: false, error: 'No file uploaded' });
//             }

//             // Upload the file to Cloudinary
//             const results = await cloudinary.uploader.upload(req.file.path, {
//                 transformation: [{
//                     width: 1200,
//                     height: 1200,
//                     crop: 'fill',
//                     gravity: 'auto'
//                 },
//                 {
//                     quality: 'auto',
//                     fetch_format: 'auto'
//                 }]
//             });

//             // Get the transformed URL
//             const url = cloudinary.url(results.public_id, {
//                 transformation: [{
//                     width: 1200,
//                     height: 1200,
//                     crop: 'fill',
//                     gravity: 'auto'
//                 },
//                 {
//                     quality: 'auto',
//                     fetch_format: 'auto'
//                 }]
//             });
//             console.log(url);
//             res.status(200).json({ success: true, url: url });
//         } catch (error) {
//             console.error('Cloudinary upload error:', error);
//             res.status(500).json({ success: false, error: error.message });
//         }
//     });
// };

// // Export the endpoint handler
// export default uploadImage








import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { v2 as cloudinary } from 'cloudinary';

const router = express.Router();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Ensure this folder exists or create dynamically
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  },
}).single('file'); // Field name should be 'file'

// Upload handler
router.post('/cloudinary', async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      return res.status(400).json({ success: false, error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    try {
      const filePath = req.file.path;

      const result = await cloudinary.uploader.upload(filePath, {
        transformation: [
          { width: 1200, height: 1200, crop: 'fill', gravity: 'auto' },
          { quality: 'auto', fetch_format: 'auto' },
        ],
      });

      // Optional: remove local file after upload
      await fs.unlink(filePath);

      res.status(200).json({ success: true, url: result.secure_url });
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });
});

export default router;

