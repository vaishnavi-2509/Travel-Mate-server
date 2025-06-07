import express from 'express';
import { createTrip, getAllTrips, getTripById, updateTrip, deleteTrip } from '../handlers/tripHandler.js';
import { verifyToken, verifyAdmin } from '../middleware/verifyAuth.js';

const tripRouter = express.Router();

// Create a new trip
tripRouter.post('/', verifyToken, verifyAdmin, createTrip);

// Get all trips
tripRouter.get('/', getAllTrips);

// Get a trip by ID 
tripRouter.get('/:id', getTripById);

// Update a trip
tripRouter.put('/:id', verifyToken, verifyAdmin, updateTrip);

// Delete a trip
tripRouter.delete('/:id', verifyToken, verifyAdmin, deleteTrip);

export default tripRouter;
