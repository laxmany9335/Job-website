const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Database connection
connectDB();

// Middlewares
app.use(express.json());

// Routes
app.get('/api/v1', (req, res) => {
    res.status(200).json({
        success: true,
        message: "API v1 is live 🚀",
    });
});

app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is running",
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
