const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/user");
const auth = require("../middlewares/auth");

router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);
router.get("/getUser/:id", auth, userCtrl.getUser);
router.delete("/deleteUser/:id", auth, userCtrl.deleteUser);
router.put("/editUser/:id", auth, userCtrl.editUser);
router.post("/checkUser", userCtrl.emailCheck);
router.get("/verifyToken", userCtrl.verifyToken);
router.post("/logout", userCtrl.logout);
router.put("/changePassword/:id", auth, userCtrl.changePassword);
router.post("/google-auth", userCtrl.googleAuth);

module.exports = router;
