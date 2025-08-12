import mongoose from "mongoose";

/**
 * Establishes a connection to the MongoDB database.
 * It reads the connection string from the environment variables.
 * In case of a connection error, it logs the error and exits the process.
 */
const connectDB = async () => {
  try {
    // Check if the MongoDB URI is provided in the environment variables
    if (!process.env.MONGODB_URI) {
      throw new Error(
        "MONGODB_URI is not defined in the environment variables.",
      );
    }

    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
    console.log(
      `\n✅ MongoDB Connected !! DB Host: ${connectionInstance.connection.host}`,
    );
  } catch (error) {
    console.error("❌ MONGODB Connection FAILED:", error);
    process.exit(1); // Exit the Node.js process with a failure code
  }
};

export default connectDB;
