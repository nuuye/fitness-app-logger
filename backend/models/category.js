const mongoose = require("mongoose");
//on ajoute ce plugin pour vérifier l'unicité, car sans il est possible d'avoir des erreurs illisibles
const uniqueValidator = require("mongoose-unique-validator");

const CategorySchema = mongoose.Schema({
    name: { type: String, required: true },
    userId: { type: String, required: true },
    subCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: "SubCategory", required: false }],
});

//we link the plugin to our model
CategorySchema.plugin(uniqueValidator);

module.exports = mongoose.model("Category", CategorySchema);
