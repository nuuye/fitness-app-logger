require("dotenv").config();
const express = require("express");
const app = express();
//import mongoDB
const mongoose = require("mongoose");

const categoryRoutes = require("./routes/category");
const exerciceRoutes = require("./routes/exercice");
const userRoutes = require("./routes/user");
const cookieParser = require("cookie-parser");
const cors = require("cors");

//link mongo to our app
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Connexion à MongoDB réussie !"))
    .catch((err) => console.error("Connexion à MongoDB échouée !", err));

app.use(express.json()); //retrieve requests bodies

app.use(cookieParser());



//Allow requests between different server, disabling CORS
app.use(
    cors({
        origin: "http://localhost:3000", // frontend link
        credentials: true, // Allow cookies and authorization headers
        methods: "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        allowedHeaders: "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization",
    })
);

//we give the initial routes to route files
app.use("/api/auth", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/exercice", exerciceRoutes);

module.exports = app;
