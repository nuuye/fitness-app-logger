const Category = require("../models/category");
const Exercice = require("../models/exercice");
const subCategory = require("../models/subCategory");

//creates a subCategory
exports.createCategory = (req, res, next) => {
    delete req.body._id;
    const newCategory = new Category({ ...req.body });
    newCategory
        .save()
        .then(() => res.status(201).json(newCategory))
        .catch((error) => {
            console.error("Error saving Category:", error);
            res.status(400).json({ error });
        });
};

exports.getCategory = (req, res, next) => {
    Category.findOne({ _id: req.params.categoryId })
        .then((Category) => {
            if (!Category || Category.userId !== req.auth.userId) {
                return res.status(403).json({ message: "subCategory not found" });
            }

            return res.status(200).json(Category);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        });
};

//deletes a Category based on its Id
exports.deleteCategory = (req, res, next) => {
    Category.findOne({ _id: req.params.id })
        .then((Category) => {
            if (!Category) {
                return res.status(404).json({ message: "subCategory not found" });
            }
            if (Category.userId !== req.auth.userId) {
                return res.status(403).json({ message: "Not authorized" });
            }

            // delete subCategory
            Category.deleteOne({ _id: req.params.id })
                .then(() => {
                    // delete exercices related to the subCategory
                    subCategory
                        .deleteMany({ Category: req.params.id })
                        .then(() => {
                            res.status(200).json({ message: "Category and related sub categories deleted!" });
                        })
                        .catch((error) => {
                            res.status(500).json({
                                message: "Category deleted, but failed to delete sub categories",
                                error,
                            });
                        });
                })
                .catch((error) => res.status(400).json({ error }));
        })
        .catch((error) => res.status(500).json({ error }));
};

//edits a category based on its Id
exports.editCategory = (req, res, next) => {
    Category.findOne({ _id: req.params.id })
        .then((Category) => {
            if (!Category) {
                return res.status(404).json({ message: "Category not found" });
            }
            if (Category.userId !== req.auth.userId) {
                return res.status(403).json({ message: "Not authorized" });
            }

            Category.updateOne({ _id: req.params.id }, { ...req.body, userId: req.auth.userId })
                .then(() => res.status(200).json({ message: "Category modified!" }))
                .catch((error) => res.status(400).json({ error }));
        })
        .catch((error) => res.status(500).json({ error }));
};

//retrieve all categories from a user by using its Id
exports.getAllCategories = (req, res, next) => {
    Category.find({ userId: req.params.userId })
        .then((CategoryList) => {
            // Check if at least one subCategory does not match the authenticated user
            if (CategoryList.some((subCategory) => subCategory.userId !== req.auth.userId)) {
                return res.status(403).json({ message: "Not authorized" });
            }

            res.status(200).json(CategoryList);
        })
        .catch((error) => res.status(400).json({ error }));
};
