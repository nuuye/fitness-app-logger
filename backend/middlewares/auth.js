require("dotenv").config();
const jwt = require("jsonwebtoken");

//middleware to verify JWT token validity
module.exports = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization; //retrieving authorization header
        if (!authHeader) {
            throw new Error("Authorization header missing");
        }

        const token = authHeader.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
        const userId = decodedToken.userId;
        req.auth = { userId: userId };
        next();
    } catch (error) {
        console.error("Authentication error:", error.message);
        res.status(401).json({ error: error.message });
    }
};
