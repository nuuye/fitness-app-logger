const express = require("express");
const router = express.Router();

const categoryCtrl = require("../controllers/category");
const auth = require("../middlewares/auth");

router.post("/create", categoryCtrl.createCategory);
router.delete("/delete/:id", auth, categoryCtrl.deleteCategory);
router.put("/edit/:id", auth, categoryCtrl.editCategory);
router.get("/getAll/:userId", auth, categoryCtrl.getAllCategories);
router.get("/get/:categoryId", auth, categoryCtrl.getCategory);

module.exports = router;
