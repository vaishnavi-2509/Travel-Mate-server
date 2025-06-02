import users from '../models/UserSchema.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const createUser = async (req, res) => {
    try {
        var salt = await bcrypt.genSalt(10);
        var password = await bcrypt.hash(req.body.password, salt);
        const data = req.body;
        const updatedData = {
            ...data,
            password: password
        }
        const user = await users.create(updatedData);
        res.status(201).json(user);
    } catch (error) {
        if(error.code === 11000) {
            if(error.message.includes("phone")) {
                res.status(400).json({error: "phone number already exists " + error.code});
            } else if(error.message.includes("email")) {
                res.status(400).json({error: "email address already exists " + error.message});
            }
        } else {
            res.status(400).json({error: error});
        }
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email, password);

        // 1. Find user by email
        const user = await users.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        // 2. Compare provided password with hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        // 3. Create JWT payload
        const payload = {
            id: user._id,
            email: user.email,
            name: user.name
        };

        // 4. Sign the token
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN // e.g., "1d"
        });

        // 5. Send token back
        res.status(200).json({
            message: "Login successful",
            token,
            user: payload
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};


export const getAllUsers = async (req, res) => {
    try {
        const allUsers = await users.find();
        res.status(200).json(allUsers);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Failed to fetch users" });
    }
}; 