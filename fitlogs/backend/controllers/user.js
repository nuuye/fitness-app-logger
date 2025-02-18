const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.signup = (req, res, next) => {
    //hashing the password
    bcrypt
        .hash(req.body.password, 10)
        .then((hash) => {
            //create a new user
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: hash,
            });
            //save the new user
            newUser
                .save()
                .then((user) => {
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id }, //on inclut l'user ID dans le payload
                            process.env.JWT_SECRET_TOKEN, //string secrète pour déchiffrer le jwt
                            { expiresIn: "24h" } //expiration date du token
                        ),
                    });
                })
                .catch((err) => res.status(400).json({ err }));
        })
        .catch((err) => res.status(500).json({ err }));
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (user) {
                bcrypt.compare(req.body.password, user.password).then((result) => {
                    if (result) {
                        res.status(200).json({
                            userId: user._id,
                            token: jwt.sign({ userId: user._id }, process.env.JWT_SECRET_TOKEN, { expiresIn: "24h" }),
                        });
                    } else {
                        res.status(403).json({ message: "Incorrect credentials" });
                    }
                });
            } else {
                //if user is null/undefined
                res.status(404).json({ message: "Incorrect credentials" });
            }
        })
        .catch((err) => {
            res.status(400).json({ err });
        });
};

exports.getUser = (req, res, next) => {
    User.findOne({ _id: req.params.id })
        .then((user) => {
            if (user) {
                res.status(200).json({ user });
            } else {
                res.status(400).json({ message: "user not found" });
            }
        })
        .catch(() => res.status(400).json({ message: "user not found" }));
};

exports.deleteUser = (req, res, next) => {
    User.findOne({ _id: req.params.id })
        .then((user) => {
            if (user._id != req.auth.userId) {
                res.status(401).json({ message: "Not authorized" });
            } else {
                User.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: "User deleted!" }))
                    .catch((error) => res.status(401).json({ error }));
            }
        })
        .catch((error) => res.status(500).json({ error }));
};

exports.modifyUser = (req, res, next) => {
    User.findOne({ _id: req.params.id })
        .then((user) => {
            if (user && user._id === req.auth.userId) {
                user.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
                    .then(() => res.status(200).json({ message: "User modified!" }))
                    .catch((error) => res.status(401).json({ error }));
            } else {
                res.status(401).json({ message: "Not authorized" });
            }
        })
        .catch((error) => res.status(400).json({ error }));
};
