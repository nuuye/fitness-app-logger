const express = require("express");
const router = express.Router();

const exerciceCtrl = require("../controllers/category");
const auth = require("../middlewares/auth");

router.post("/create", exerciceCtrl.createExercice);
router.delete("/delete/:id", auth, exerciceCtrl.deleteExercice);
router.put("/edit/:id", auth, exerciceCtrl.editExercice);
router.get("/getAll/:userId", auth, exerciceCtrl.getAllExercice);

module.exports = router;
