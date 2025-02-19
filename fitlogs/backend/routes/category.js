const express = require("express");
const router = express.Router();

const categoryCtrl = require("../controllers/category");
const auth = require("../middlewares/auth");

router.post("/create", categoryCtrl.createCategory);
router.delete("/delete/:id", categoryCtrl.deleteCategory);
router.put("/edit/:id", categoryCtrl.editCategory);
router.get("/getAll/:userId", auth, categoryCtrl.getAllCategories);

module.exports = router;
