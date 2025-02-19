const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/user");
const auth = require("../middlewares/auth");

router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);
router.get("/getUser/:id", userCtrl.getUser);
router.delete("/deleteUser/:id", auth, userCtrl.deleteUser);
router.put("/editUser/:id", auth, userCtrl.editUser);

module.exports = router;
