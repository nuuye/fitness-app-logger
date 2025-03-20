require("dotenv").config();
const express = require("express");
const app = express();
const rateLimit = require("express-rate-limit");
//import mongoDB
const mongoose = require("mongoose");

const categoryRoutes = require("./routes/category");
const exerciceRoutes = require("./routes/exercice");
const userRoutes = require("./routes/user");
const cookieParser = require("cookie-parser");
const cors = require("cors");

//Allow requests between different server, disabling CORS
app.use(
    cors({
        origin: ["http://localhost:3000", "https://fitlogs.vercel.app"], // frontend link
        credentials: true, // Allow cookies and authorization headers
        methods: "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        allowedHeaders: "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization",
    })
);

//link mongo to our app
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Connexion à MongoDB réussie !"))
    .catch((err) => console.error("Connexion à MongoDB échouée !", err));

app.use(express.json()); //retrieve requests bodies

app.use(cookieParser());

app.set("trust proxy", 1);

// Set up rate limiter: maximum of 100 requests per 15 minutes per IP
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window`
    message: "Too many requests from this IP, please try again later",
});

// Apply the rate limiter to all requests
app.use(limiter);

//initial route to prevent vercel showing 404
app.get("/", (req, res) => {
    res.send("FitLogs API is running!");
});

app.get("/favicon.ico", (req, res) => res.status(204).end());

//we give the initial routes to route files
app.use("/api/auth", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/exercice", exerciceRoutes);

module.exports = app;
