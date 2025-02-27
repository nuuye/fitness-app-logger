const Category = require("../models/category");

//creates a category
exports.createCategory = (req, res, next) => {
    delete req.body._id;
    console.log("Received body:", req.body);
    const newCategory = new Category({ name: req.body.name });
    console.log("new Cat : ", newCategory);
    newCategory
        .save()
        .then(() => res.status(201).json(newCategory))
        .catch((error) => {
            console.error("Error saving category:", error);
            res.status(400).json({ error });
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

            Category.deleteOne({ _id: req.params.id })
                .then(() => res.status(200).json({ message: "Category deleted!" }))
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
    Category.find({ userId: req.params.id })
        .then((categoryList) => {
            // Check if at least one category does not match the authenticated user
            if (categoryList.some((category) => category.userId !== req.auth.userId)) {
                return res.status(403).json({ message: "Not authorized" });
            }

            res.status(200).json(categoryList);
        })
        .catch((error) => res.status(400).json({ error }));
};
