require("dotenv").config();
const express = require("express");
const app = express();
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// === Import routes ===
const categoryRoutes = require("./routes/category");
const subCategoryRoutes = require("./routes/subCategory");
const exerciceRoutes = require("./routes/exercice");
const userRoutes = require("./routes/user");

// === CORS configuration ===
const allowedOrigins = process.env.CORS_IP.split(",");

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.warn(`❌ Origin not allowed by CORS: ${origin}`);
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
    exposedHeaders: ["set-cookie"],
    optionsSuccessStatus: 204,
};

// === Middlewares globaux ===
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.set("trust proxy", 1);
app.use(express.json());
app.use(cookieParser());

// === Rate limiter  ===
const limiter = rateLimit({
    windowMs: 25 * 60 * 1000, // 25 minutes
    max: 310,
    message: "Too many requests from this IP, please try again later",
});
app.use(limiter);

// === Connexion MongoDB ===
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("✅ Connexion à MongoDB réussie !"))
    .catch((err) => console.error("❌ Connexion à MongoDB échouée :", err));

// === Routes ===
app.get("/", (req, res) => {
    res.send("API is running!");
});

app.use("/server/auth", userRoutes);
app.use("/server/category", categoryRoutes);
app.use("/server/subCategory", subCategoryRoutes);
app.use("/server/exercice", exerciceRoutes);

// === Catch-all 404 ===
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

module.exports = app;
