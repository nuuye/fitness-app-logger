require("dotenv").config();
const express = require("express");
const app = express();
//import mongoDB
const mongoose = require("mongoose");

const categoryRoutes = require("./routes/category");
const exerciceRoutes = require("./routes/exercice");
const userRoutes = require("./routes/user");


//link mongo to our app
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Connexion à MongoDB réussie !"))
    .catch((err) => console.error("Connexion à MongoDB échouée !", err));

app.use(express.json()); //retrieve requests bodies

//Allow requests between different server, disabling CORS
app.use((req, res, next) => {
    //allow access to our API from anywhere
    res.setHeader("Access-Control-Allow-Origin", "*");
    //add specified headers to each request sent to our API
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    //allow requests with specified methods
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    next();
});

//we give the initial routes to route files
app.use("/api/auth", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/exercice", exerciceRoutes);


module.exports = app;
