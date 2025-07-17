import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import userRoute from './route/userRoutes.js';
import profileRoute from './route/profileRoute.js';
import cors from 'cors';
import cookieParser from "cookie-parser";
dotenv.config();

// Initialize app
const app = express();
const PORT = process.env.PORT || 4000;

// Connect to database
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));

app.use("/api/v1/users", userRoute);
app.use("/api/v1/profile", profileRoute);

app.get('/', ( req, res) => {
    res.send("Welcome to the API");
});

// Start server
app.listen(PORT, () => {
    console.log(` Server is running on http://localhost:${PORT}`);
});
