const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");


const exerciceSchema = mongoose.Schema({
    name: { type: String, required: true },
    repNumber: { type: [Number], required: false },
    kgPerRep: { type: [Number], required: false },
    note: { type: String, required: false },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    userId: { type: String, required: true },
});

// Link the uniqueValidator plugin to exerciceSchema
exerciceSchema.plugin(uniqueValidator);

// Export the Exercice model
module.exports = mongoose.model("Exercice", exerciceSchema);
