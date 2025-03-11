import { useState } from "react";
import styles from "./exerciceTable.module.scss";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

export default function ExerciceTable() {
    const [checkedRows, setCheckedRows] = useState<number[]>([]);

    const handleCheckboxChange = (index: number) => {
        setCheckedRows((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]));
    };

    const rows = [
        { name: "Push ups", sets: ["0 / 20", "0 / 20", "0 / 20"] },
        { name: "Bench press", sets: ["60 / 12", "60 / 12", "60 / 12"] },
        { name: "Squats", sets: ["80 / 15", "85 / 12", "90 / 10"] },
    ];

    return (
        <div className={styles.root}>
            <table>
                <thead>
                    <tr>
                        <th scope="col">Exercice name</th>
                        <th scope="col">Weight / Rep</th>
                        <th scope="col">Weight / Rep</th>
                        <th scope="col">Weight / Rep</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, index) => (
                        <tr key={index} className={index % 2 === 0 && styles.zebraRow}>
                            <th scope="row">
                                <FormControlLabel control={<Checkbox className={styles.checkBox} />} label={row.name} />
                            </th>
                            {row.sets.map((set, index) => (
                                <td key={index}>{set}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
                <tfoot></tfoot>
            </table>
        </div>
    );
}
