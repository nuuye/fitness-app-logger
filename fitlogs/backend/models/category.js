const mongoose = require("mongoose");
//on ajoute ce plugin pour vérifier l'unicité, car sans il est possible d'avoir des erreurs illisibles
const uniqueValidator = require("mongoose-unique-validator");

const categorySchema = mongoose.Schema({
    name: { type: String, required: true },
});

//we link the plugin to our model
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Category", categorySchema);
