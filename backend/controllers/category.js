const Category = require("../models/category");
const Exercice = require("../models/exercice");

//creates a category
exports.createCategory = (req, res, next) => {
    delete req.body._id;
    const newCategory = new Category({ ...req.body });
    newCategory
        .save()
        .then(() => res.status(201).json(newCategory))
        .catch((error) => {
            console.error("Error saving category:", error);
            res.status(400).json({ error });
        });
};

exports.getCategory = (req, res, next) => {
    Category.findOne({ _id: req.params.categoryId })
        .then((category) => {
            if (!category || category.userId !== req.auth.userId) {
                return res.status(403).json({ message: "Category not found" });
            }

            return res.status(200).json(category);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        });
};

//deletes a category based on its Id
exports.deleteCategory = (req, res, next) => {
    Category.findOne({ _id: req.params.id })
        .then((category) => {
            if (!category) {
                return res.status(404).json({ message: "Category not found" });
            }
            if (category.userId !== req.auth.userId) {
                return res.status(403).json({ message: "Not authorized" });
            }

            // delete category
            Category.deleteOne({ _id: req.params.id })
                .then(() => {
                    // delete exercices related to the category
                    Exercice.deleteMany({ category: req.params.id })
                        .then(() => {
                            res.status(200).json({ message: "Category and related exercises deleted!" });
                        })
                        .catch((error) => {
                            res.status(500).json({
                                message: "Category deleted, but failed to delete exercises",
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
        .then((category) => {
            if (!category) {
                return res.status(404).json({ message: "Category not found" });
            }
            if (category.userId !== req.auth.userId) {
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
        .then((categoryList) => {
            // Check if at least one category does not match the authenticated user
            if (categoryList.some((category) => category.userId !== req.auth.userId)) {
                return res.status(403).json({ message: "Not authorized" });
            }

            res.status(200).json(categoryList);
        })
        .catch((error) => res.status(400).json({ error }));
};
