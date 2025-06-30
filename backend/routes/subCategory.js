const express = require("express");
const router = express.Router();

const subCategoryCtrl = require("../controllers/subCategory");
const auth = require("../middlewares/auth");

router.post("/create", subCategoryCtrl.createSubCategory);
router.delete("/delete/:id", auth, subCategoryCtrl.deleteSubCategory);
router.put("/edit/:id", auth, subCategoryCtrl.editSubCategory);
router.get("/retrieveAll/:categoryId", auth, subCategoryCtrl.getAllSubCategories);
router.get("/getAll/:userId", auth, subCategoryCtrl.getAllUserSubCategories);
router.get("/get/:subCategoryId", auth, subCategoryCtrl.getSubCategory);

module.exports = router;
