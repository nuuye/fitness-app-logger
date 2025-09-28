require("dotenv").config();
const express = require("express");
const app = express();
const rateLimit = require("express-rate-limit");
//import mongoDB
const mongoose = require("mongoose");

const categoryRoutes = require("./routes/category");
const subCategoryRoutes = require("./routes/subCategory");
const exerciceRoutes = require("./routes/exercice");
const userRoutes = require("./routes/user");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// Configuration CORS centralisée
const corsOptions = {
    origin: process.env.CORS_IP, // frontend link
    credentials: true, // Allow cookies and authorization headers
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
    exposedHeaders: ['set-cookie'],
    optionsSuccessStatus: 204
};

// Apply CORS with same config
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

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
    windowMs: 25 * 60 * 1000, // 15 minutes
    max: 310, // Limit each IP to 100 requests per `window`
    message: "Too many requests from this IP, please try again later",
});

// Apply the rate limiter to all requests
app.use(limiter);

app.get("/", (req, res) => {
    res.send("API is running!");
});

//we give the initial routes to route files
app.use("/api/auth", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/subCategory", subCategoryRoutes);
app.use("/api/exercice", exerciceRoutes);

module.exports = app;