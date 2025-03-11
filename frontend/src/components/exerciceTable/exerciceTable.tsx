import { useEffect, useState } from "react";
import styles from "./exerciceTable.module.scss";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Button, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { createExerciceRequest, getAllExerciceRequest } from "../../services/exercice";

interface SetType {
    reps: number;
    kg: number;
}

interface ExerciceType {
    name: string;
    sets: SetType[];
    categoryId: string;
    userId: string;
}

interface ExerciceTableProps {
    categoryId: string;
}

export default function ExerciceTable({ categoryId }: ExerciceTableProps) {
    const [rows, setRows] = useState<ExerciceType[]>([]);

    useEffect(() => {
        const storageUserId = localStorage.getItem("userId");
        if (storageUserId && categoryId) {
            retrieveExercices(storageUserId, categoryId);
        }
    }, [categoryId]);

    const retrieveExercices = async (userId: string, subCategoryId: string) => {
        const data = await getAllExerciceRequest(userId, subCategoryId);
        if (data) {
            console.log("data: ", data);
            setRows(data);
        }
    };

    const handleCreateExercice = async () => {
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
            setRows((prev) => [...prev, newExercice]);
        }
    };

    const handleDeleteExercice = (rowIndex: number) => {};

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
                    {rows &&
                        rows.map((row, rowIndex) => (
                            <tr key={rowIndex} className={rowIndex % 2 === 0 ? styles.zebraRow : undefined}>
                                <th scope="row">
                                    <FormControlLabel
                                        control={<Checkbox className={styles.checkBox} />}
                                        label={row.name}
                                    />
                                </th>
                                {row &&
                                    row.sets?.map((set, index) => (
                                        <td key={index}>
                                            {set.kg} / {set.reps}
                                        </td>
                                    ))}
                                <td className={styles.iconColumn}>
                                    <IconButton onClick={() => handleDeleteExercice(rowIndex)} color="error">
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
