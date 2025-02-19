const express = require("express");
const router = express.Router();

const exerciceCtrl = require("../controllers/category");
const auth = require("../middlewares/auth");

router.post("/create", exerciceCtrl.createExercice);
router.delete("/delete/:id", exerciceCtrl.deleteExercice);
router.put("/edit/:id", exerciceCtrl.editExercice);
router.get("/getAll/:userId", exerciceCtrl.getAllExercice);




module.exports = router;
