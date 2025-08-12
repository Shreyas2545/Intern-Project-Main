import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

// 🚨 Configure dotenv at the VERY TOP to ensure all environment variables are loaded before any other code runs.
dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    // Start listening for requests after the database is connected
    const port = process.env.PORT || 8000;
    app.listen(port, () => {
      console.log(`✅ Server is running on port: ${port}`);
    });

    // Optional: Handle app-level errors
    app.on("error", (error) => {
      console.error("APP ERROR: ", error);
      throw error;
    });
  })
  .catch((err) => {
    console.error("MONGO DB connection failed !!! ", err);
  });
