const Exercice = require("../models/exercice");

//creates an exercice
exports.createExercice = (req, res, next) => {
    const newExercice = new Exercice({ ...req.body });
    newExercice
        .save()
        .then(() => res.status(200).json(newExercice))
        .catch((error) => res.status(400).json({ error }));
};

//deletes an exercice based on its Id
exports.deleteExericce = (req, res, next) => {
    Exercice.findOne({ _id: req.params.id })
        .then((exercice) => {
            if (!exercice) {
                return res.status(404).json({ message: "Exercice not found" });
            }
            if (exercice.userId !== req.auth.userId) {
                return res.status(403).json({ message: "Not authorized" });
            }

            Exercice.deleteOne({ _id: req.params.id })
                .then(() => res.status(200).json({ message: "Exercice deleted!" }))
                .catch((error) => res.status(400).json({ error }));
        })
        .catch((error) => res.status(500).json({ error }));
};

//edits an exercice based on its Id
exports.editExercice = (req, res, next) => {
    Exercice.findOne({ _id: req.params.id })
        .then((exercice) => {
            if (!exercice) {
                return res.status(404).json({ message: "Exercice not found" });
            }
            if (exercice.userId !== req.auth.userId) {
                return res.status(403).json({ message: "Not authorized" });
            }

            Exercice.updateOne({ _id: req.params.id }, { ...req.body, userId: req.auth.userId })
                .then(() => res.status(200).json({ message: "Exercice modified!" }))
                .catch((error) => res.status(400).json({ error }));
        })
        .catch((error) => res.status(500).json({ error }));
};

//retrieve all exercices from a user by using its Id
exports.getAllExercices = (req, res, next) => {
    Exercice.find({ userId: req.params.id })
        .then((exerciceList) => {
            // Check if at least one category does not match the authenticated user
            if (exerciceList.some((exercice) => exercice.userId !== req.auth.userId)) {
                return res.status(403).json({ message: "Not authorized" });
            }

            res.status(200).json(exerciceList);
        })
        .catch((error) => res.status(400).json({ error }));
};
