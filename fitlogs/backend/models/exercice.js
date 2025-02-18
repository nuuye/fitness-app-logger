const mongoose = require("mongoose");
//on ajoute ce plugin pour vérifier l'unicité, car sans il est possible d'avoir des erreurs illisibles
const uniqueValidator = require("mongoose-unique-validator");

const exerciceSchema = mongoose.Schema({
    name: { type: String, required: true },
    repNumber: { type: [Number], required: false },
    kgPerRep: { type: [Number], required: false },
    note: { type: String, required: false },
});

//we link the plugin to our model
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Exercice", exerciceSchema);
