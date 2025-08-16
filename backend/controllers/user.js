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
                    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_TOKEN, { expiresIn: "24h" });

                    res.cookie("jwtToken", token, {
                        httpOnly: true,
                        secure: false,
                        sameSite: "Lax",
                        path: "/",
                        maxAge: 24 * 60 * 60 * 1000,
                    });

                    res.status(200).json({
                        userId: user._id,
                        name: user.name,
                        email: user.email,
                        token: token,
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
                        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_TOKEN, {
                            expiresIn: "24h",
                        });

                        res.cookie("jwtToken", token, {
                            httpOnly: true,
                            secure: false,
                            sameSite: "Lax",
                            path: "/",
                            maxAge: 24 * 60 * 60 * 1000,
                        });

                        // Return a success message
                        res.status(200).json({
                            userId: user._id,
                            name: user.name,
                            email: user.email,
                            token: token,
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

exports.googleAuth = (req, res, next) => {
    console.log('backend email: ', req.body.email);

    User.findOne({ email: req.body.email })
        .then((user) => {
            console.log('user value:', user);
            if (user) { // if an email is found with google sso
                const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_TOKEN, {
                    expiresIn: "24h",
                });

                // Return a success message
                res.status(200).json({
                    userId: user._id,
                    name: user.name,
                    email: user.email,
                    token: token,
                });

            } else { //if no email is found with google sso, we create a new account

                const randomPassword = Math.random().toString(36).slice(-8); // mot de passe aléatoire
                bcrypt.hash(randomPassword, 10)
                    .then((hash) => {
                        const newUser = new User({
                            name: req.body.name,
                            email: req.body.email,
                            password: hash,
                        });

                        newUser
                            .save()
                            .then((user) => {
                                const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_TOKEN, { expiresIn: "24h" });

                                res.status(200).json({
                                    userId: user._id,
                                    name: user.name,
                                    email: user.email,
                                    token: token,
                                });
                            })
                            .catch((err) => res.status(400).json({ err }));
                    })
                    .catch((err) => res.status(500).json({ err }));
            }
        })
        .catch((err) => {
            res.status(400).json({ err });
        });
};

exports.logout = (req, res, next) => {
    res.clearCookie("jwtToken", {
        secure: true, // Match login settings
        sameSite: "Lax", // Match login settings
        path: "/", // Ensure it clears the correct cookie
    });
    res.status(200).json({ message: "Logged out successfully" });
};

exports.getUser = (req, res, next) => {
    User.findOne({ _id: req.params.id })
        .then((user) => {
            if (user && user._id == req.auth.userId) {
                res.status(200).json({ userId: user._id, name: user.name, email: user.email });
            } else {
                res.status(401).json({ message: "Not authorized" });
            }
        })
        .catch(() => res.status(400).json({ message: "error finding user" }));
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

exports.editUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || user._id.toString() !== req.auth.userId) {
            return res.status(403).json({ message: "Not authorized" });
        }

        const { name, email } = req.body;
        const updatedUser = await User.findByIdAndUpdate(req.params.id, { name, email }, { new: true });

        res.status(200).json({ message: "User modified!", user: updatedUser });
    } catch (error) {
        res.status(400).json({ error });
    }
};

exports.changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.params.id);
        if (!user || user._id.toString() !== req.auth.userId) {
            return res.status(403).json({ message: "Not authorized" });
        }
        const samePassword = await bcrypt.compare(currentPassword, user.password);
        if (samePassword) {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            await user.save();
            return res.status(200).json({ message: "Password modified!" });
        } else {
            return res.status(401).json({ message: "Wrong password" });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.emailCheck = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (user) {
                res.status(200).json({ message: "user not found" });
            } else {
                res.status(204).json({ message: "user not found" });
            }
        })
        .catch((error) => res.status(500).json({ error }));
};

// Server-side token verification endpoint
exports.verifyToken = (req, res) => {
    const token = req.cookies.jwtToken;
    if (!token) {
        return res.status(401).json({ login: false, message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
        return res.status(200).json({ login: true, user: decoded });
    } catch (error) {
        console.error("Token verification error:", error);
        return res.status(401).json({ login: false, message: "Invalid token" });
    }
};
