import { useEffect, useState } from "react";
import styles from "./exerciceTable.module.scss";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Button, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import {
    createExerciceRequest,
    getAllExerciceRequest,
    deleteExerciceRequest,
    editExerciceRequest,
} from "../../services/exercice";
import Input from "@mui/material/Input";

interface SetType {
    reps: number;
    kg: number;
}

interface ExerciceType {
    _id: string;
    name: string;
    sets: SetType[];
    categoryId: string;
    userId: string;
    isEditing?: boolean;
}

interface ExerciceTableProps {
    categoryId: string;
}

export default function ExerciceTable({ categoryId }: ExerciceTableProps) {
    const [exercices, setExercices] = useState<ExerciceType[]>([]);

    useEffect(() => {
        console.log(categoryId);
        const storageUserId = localStorage.getItem("userId");
        if (storageUserId && categoryId) {
            retrieveExercices(storageUserId, categoryId);
        }
    }, [categoryId]);

    const retrieveExercices = async (userId: string, subCategoryId: string): Promise<void> => {
        const data = await getAllExerciceRequest(userId, subCategoryId);
        if (data) {
            console.log("data: ", data);
            const updated = data.map((ex) => ({ ...ex, isEditing: false }));
            setExercices(updated);
        }
    };

    const handleCreateExercice = async (): Promise<void> => {
        const newExercice = await createExerciceRequest(
            "new exercice",
            [
                { kg: 0, reps: 0 },
                { kg: 0, reps: 0 },
                { kg: 0, reps: 0 },
            ],
            localStorage.getItem("userId"),
            categoryId
        );
        if (newExercice) {
            const updatedExercice = { ...newExercice, isEditing: false };
            setExercices((prev) => [...prev, updatedExercice]);
        }
    };

    const handleDeleteExercice = async (exerciceId: string): Promise<void> => {
        const success = await deleteExerciceRequest(exerciceId);
        if (success) {
            setExercices((prevRows) => prevRows.filter((row) => row._id !== exerciceId));
        }
    };

    const handleEditExercice = (exercice: ExerciceType): void => {
        setExercices((prevExercices) =>
            prevExercices.map((ex) => (ex._id === exercice._id ? { ...ex, isEditing: !ex.isEditing } : ex))
        );
    };

    const handleChangeSetKg = (exerciceId: string, setIndex: number, value: number) => {
        setExercices((prev) =>
            prev.map((row) => {
                if (row._id === exerciceId) {
                    const updatedSets = [...row.sets];
                    updatedSets[setIndex] = { ...updatedSets[setIndex], kg: value };
                    editExerciceRequest(exerciceId, undefined, updatedSets);
                    return { ...row, sets: updatedSets };
                }
                return row;
            })
        );
    };

    const handleChangeSetReps = (exerciceId: string, setIndex: number, value: number) => {
        setExercices((prev) =>
            prev.map((row) => {
                if (row._id === exerciceId) {
                    const updatedSets = [...row.sets];
                    updatedSets[setIndex] = { ...updatedSets[setIndex], reps: value };
                    editExerciceRequest(exerciceId, undefined, updatedSets);
                    return { ...row, sets: updatedSets };
                }
                return row;
            })
        );
    };

    const handleChangeExerciceName = async (exerciceId: string, newName: string) => {
        const success = await editExerciceRequest(exerciceId, newName);
        if (success) {
            setExercices((prev) => prev.map((row) => (row._id === exerciceId ? { ...row, name: newName } : row)));
        }
    };

    return (
        <div className={styles.root}>
            <table>
                <thead>
                    <tr>
                        <th scope="col">Exercice name</th>
                        <th scope="col">Weight / Rep</th>
                        <th scope="col">Weight / Rep</th>
                        <th scope="col">Weight / Rep</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    {exercices &&
                        exercices.map((row, rowIndex) => (
                            <tr key={rowIndex} className={rowIndex % 2 === 0 ? styles.zebraRow : undefined}>
                                {row.isEditing ? (
                                    <th scope="row" style={{ paddingLeft: "5px" }}>
                                        <label className={styles.exerciceNameContainer}>
                                            <Checkbox className={styles.editCheckBox} />
                                            <Input
                                                className={styles.editInput}
                                                autoFocus
                                                value={row.name}
                                                onChange={(e) => handleChangeExerciceName(row._id, e.target.value)}
                                            />
                                        </label>
                                    </th>
                                ) : (
                                    <th scope="row">
                                        <FormControlLabel
                                            control={<Checkbox className={styles.checkBox} />}
                                            label={row.name}
                                        />
                                    </th>
                                )}
                                {row &&
                                    row.sets?.map((set, index) => (
                                        <td key={index}>
                                            {row.isEditing ? (
                                                <label className={styles.exerciceWeightContainer}>
                                                    <Input
                                                        className={styles.editWeightInput}
                                                        value={set.kg}
                                                        type="number"
                                                        inputProps={{
                                                            min: 0,
                                                            style: { width: `${String(set.kg).length + 2}ch` },
                                                        }}
                                                        onChange={(e) =>
                                                            handleChangeSetKg(row._id, index, Number(e.target.value))
                                                        }
                                                    />
                                                    /
                                                    <Input
                                                        className={styles.editWeightInput}
                                                        value={set.reps}
                                                        type="number"
                                                        inputProps={{
                                                            min: 0,
                                                            style: { width: `${String(set.reps).length + 2}ch` },
                                                        }}
                                                        onChange={(e) =>
                                                            handleChangeSetReps(row._id, index, Number(e.target.value))
                                                        }
                                                    />
                                                </label>
                                            ) : (
                                                `${set.kg} / ${set.reps}`
                                            )}
                                        </td>
                                    ))}
                                <td className={styles.iconColumn}>
                                    <IconButton color="info" onClick={() => handleEditExercice(row)}>
                                        <BorderColorIcon className={styles.editIcon} />
                                    </IconButton>
                                    <IconButton onClick={() => handleDeleteExercice(row._id)} color="error">
                                        <DeleteIcon className={styles.deleteIcon} />
                                    </IconButton>
                                </td>
                            </tr>
                        ))}
                </tbody>
                <tfoot></tfoot>
            </table>
            <Button className={styles.addButton} variant="contained" onClick={() => handleCreateExercice()}>
                Add new exercice
            </Button>
        </div>
    );
}
