import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema({
  title: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  rating: { type: Number, required: true },
  tags: [{ type: String }], 
  price: { type: Number, required: true },
  currentTravelers: { type: Number, required: true },
  maxTravelers: { type: Number, required: true },
  imageUrl: { type: String }, 
}, { timestamps: true });

const Trip = mongoose.model('Trip', tripSchema);
export default Trip;
