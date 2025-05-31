import dotenv from "dotenv"
import mongoose from "mongoose"

dotenv.config()

const URI = process.env.MONGODB_URI

async function connectToDatabase() {
  try {
    const connectionInstance = await mongoose.connect(`${URI}`);
    console.log("Connected to MongoDB with " + connectionInstance.connection.name)
  } catch (error) {
    console.error("Error connecting to MongoDB:", error)
    process.exit(1)
  }
}

export default connectToDatabase