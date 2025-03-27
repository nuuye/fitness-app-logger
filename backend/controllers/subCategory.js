const SubCategory = require("../models/subCategory");
const Exercice = require("../models/exercice");
const Category = require("../models/category");

// Creates a subCategory and links it to its category
exports.createSubCategory = async (req, res, next) => {
    try {
        console.log("req body SUBCAT: ", req.body);
        delete req.body._id;

        // Create the new subcategory
        const newSubCategory = new SubCategory({ ...req.body });
        await newSubCategory.save();

        // Find the corresponding category
        const category = await Category.findById(req.body.category);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        // Add the new subcategory ID to the subCategories array
        category.subCategories = [...category.subCategories, newSubCategory._id];

        // Save the updated category
        await category.save();

        res.status(201).json(newSubCategory);
    } catch (error) {
        console.error("Error saving subCategory:", error);
        res.status(400).json({ error });
    }
};

//res.status(201).json(newSubCategory)
exports.getSubCategory = (req, res, next) => {
    SubCategory.findOne({ _id: req.params.subCategoryId })
        .then((subCategory) => {
            if (!subCategory || subCategory.userId !== req.auth.userId) {
                return res.status(403).json({ message: "subCategory not found" });
            }

            return res.status(200).json(subCategory);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        });
};

//deletes a subCategory based on its Id
exports.deleteSubCategory = (req, res, next) => {
    SubCategory.findOne({ _id: req.params.id })
        .then((subCategory) => {
            if (!subCategory) {
                return res.status(404).json({ message: "subCategory not found" });
            }
            if (subCategory.userId !== req.auth.userId) {
                return res.status(403).json({ message: "Not authorized" });
            }

            // delete subCategory
            SubCategory.deleteOne({ _id: req.params.id })
                .then(() => {
                    // delete exercices related to the subCategory
                    Exercice.deleteMany({ subCategory: req.params.id })
                        .then(() => {
                            res.status(200).json({ message: "subCategory and related exercises deleted!" });
                        })
                        .catch((error) => {
                            res.status(500).json({
                                message: "subCategory deleted, but failed to delete exercises",
                                error,
                            });
                        });
                })
                .catch((error) => res.status(400).json({ error }));
        })
        .catch((error) => res.status(500).json({ error }));
};

//edits a subCategory based on its Id
exports.editSubCategory = (req, res, next) => {
    SubCategory.findOne({ _id: req.params.id })
        .then((subCategory) => {
            if (!subCategory) {
                return res.status(404).json({ message: "subCategory not found" });
            }
            if (subCategory.userId !== req.auth.userId) {
                return res.status(403).json({ message: "Not authorized" });
            }

            SubCategory
                .updateOne({ _id: req.params.id }, { ...req.body, userId: req.auth.userId })
                .then(() => res.status(200).json({ message: "subCategory modified!" }))
                .catch((error) => res.status(400).json({ error }));
        })
        .catch((error) => res.status(500).json({ error }));
};

//retrieve all categories from a user by using its Id
exports.getAllSubCategories = (req, res, next) => {
    SubCategory.find({ category: req.params.categoryId })
        .then((subCategoryList) => {
            // Check if at least one subCategory does not match the authenticated user
            if (subCategoryList.some((subCategory) => subCategory.userId !== req.auth.userId)) {
                return res.status(403).json({ message: "Not authorized" });
            }

            res.status(200).json(subCategoryList);
        })
        .catch((error) => res.status(400).json({ error }));
};
