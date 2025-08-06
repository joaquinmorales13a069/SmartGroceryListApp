import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./middleware/connectDB.js";
import mainRoutes from "./routes/routes.js";

const app = express();

// Load environment variables from .env file
dotenv.config();

// Middleware for CORS
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],

    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Connect to MongoDB
connectDB();

// Middleware and routes
app.use(express.json()); // Parse JSON bodies

// Routes
app.use("/api", mainRoutes);

// Launch the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
