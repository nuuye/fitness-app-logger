const mongoose = require("mongoose");
//on ajoute ce plugin pour vérifier l'unicité, car sans il est possible d'avoir des erreurs illisibles
const uniqueValidator = require("mongoose-unique-validator");

const subCategorySchema = mongoose.Schema({
    name: { type: String, required: true},
    userId: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
});

//we link the plugin to our model
subCategorySchema.plugin(uniqueValidator);

module.exports = mongoose.model("subCategory", subCategorySchema);
