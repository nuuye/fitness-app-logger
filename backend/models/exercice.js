const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const exerciceSchema = mongoose.Schema({
    name: { type: String, required: true },
    sets: [
        {
            kg: { type: Number, required: false },
            reps: { type: Number, required: true },
        },
    ],
    note: { type: String, required: false },
    subCategory: { type: mongoose.Schema.Types.ObjectId, ref: "subCategory", required: true },
    userId: { type: String, required: true },
});

// Link the uniqueValidator plugin to exerciceSchema
exerciceSchema.plugin(uniqueValidator);

// Export the Exercice model
module.exports = mongoose.model("Exercice", exerciceSchema);
