import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import styles from "./exerciceTable.module.scss";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import FileDownloadDoneIcon from "@mui/icons-material/FileDownloadDone";
import { format } from "date-fns";
import {
    createExerciceRequest,
    getAllExerciceRequest,
    deleteExerciceRequest,
    editExerciceRequest,
} from "../../services/exercice";
import Input from "@mui/material/Input";

export interface SetType {
    reps: number | string;
    kg: number | string;
}

export interface PerformanceType {
    date: string; //Format ISO
    sets: SetType[];
    note?: string;
}

export interface ExerciceType {
    _id: string;
    name: string;
    performances: PerformanceType[];
    subCategoryId: string;
    userId: string;
    isEditing?: boolean;
}

interface ExerciceTableProps {
    subCategoryId: string;
    selectedDate?: string;
}
// Define what the parent will be able to call via the ref
export interface ExerciceTableRef {
    handleCreateExercice: () => void;
}

export interface SetType {
    reps: number | string;
    kg: number | string;
}

export interface PerformanceType {
    date: string; //Format ISO
    sets: SetType[];
    note?: string;
}

export interface ExerciceType {
    _id: string;
    name: string;
    performances: PerformanceType[];
    subCategoryId: string;
    userId: string;
    isEditing?: boolean;
}

interface ExerciceTableProps {
    subCategoryId: string;
    selectedDate?: string;
}
// Define what the parent will be able to call via the ref
export interface ExerciceTableRef {
    handleCreateExercice: () => void;
}

const ExerciceTable = forwardRef<ExerciceTableRef, ExerciceTableProps>(({ subCategoryId, selectedDate }, ref) => {
    const [exercices, setExercices] = useState<ExerciceType[]>([]);
    const [previousPerformances, setPreviousPerformances] = useState<PerformanceType[]>();
    const [newPerformance, setNewPerformance] = useState<PerformanceType>();

    // Expose methods to parent via useImperativeHandle
    useImperativeHandle(ref, () => ({
        handleCreateExercice,
    }));

    useEffect(() => {
        console.log(selectedDate);
        console.log(exercices);
    }, [exercices, selectedDate]);

    useEffect(() => {
        const storageUserId = localStorage.getItem("userId");
        if (storageUserId && subCategoryId) {
            retrieveExercices(storageUserId, subCategoryId);
        }
    }, [subCategoryId]);

    const retrieveExercices = async (userId: string, subCategoryId: string): Promise<void> => {
        const data = await getAllExerciceRequest(userId, subCategoryId);
        console.log("data: ", data);
        if (data) {
            const updated = data.map((ex) => ({ ...ex, isEditing: false }));
            setExercices(updated);
        }
    };

    const handleCreateExercice = async (): Promise<void> => {
        // Créer un nouvel exercice avec une performance initiale
        const initialSets = [
            { kg: 0, reps: 0 },
            { kg: 0, reps: 0 },
            { kg: 0, reps: 0 },
        ];

        const initialPerformance = {
            date: selectedDate,
            sets: initialSets,
            note: "",
        };

        const newExercice = await createExerciceRequest(
            "new exercice",
            initialPerformance,
            localStorage.getItem("userId"),
            subCategoryId
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

    //handler used to display editing interface
    const handleEditExercice = (exercice: ExerciceType): void => {
        setExercices((prevExercices) =>
            prevExercices.map((ex) => (ex._id === exercice._id ? { ...ex, isEditing: !ex.isEditing } : ex))
        );
    };

    //retrieves last performance for a given list of performances
    const getLatestPerformance = (performances: PerformanceType[]): PerformanceType => {
        if (!performances || performances.length === 0) {
            return {
                date: new Date().toISOString(),
                sets: [],
                note: "",
            };
        }

        //sorting by date to retrieve last performance
        return performances.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    };

    //handler trigered while changing kg
    const handleChangeSetKg = (exerciceId: string, setIndex: number, value: number | string) => {
        setExercices((exercice) =>
            exercice.map((row) => {
                if (row._id === exerciceId) {
                    console.log('exercice list: ', exercice)
                    //fetching the exercice being edited
                    //copying last performance
                    const latestPerformance = getLatestPerformance(row.performances);
                    const updatedSets = [...latestPerformance.sets];
                    updatedSets[setIndex] = { ...updatedSets[setIndex], kg: value }; //updating value

                    //formating
                    const updatedPerformance = {
                        ...latestPerformance,
                        sets: updatedSets,
                    };

                    setNewPerformance(updatedPerformance);

                    const updatedPerformances = row.performances.map((perf) =>
                        perf.date === latestPerformance.date ? updatedPerformance : perf
                    );

                    return { ...row, performances: updatedPerformances };
                }
                return row;
            })
        );
    };

    const handleChangeSetReps = (exerciceId: string, setIndex: number, value: number | string) => {
        setExercices((exercice) =>
            exercice.map((row) => {
                if (row._id === exerciceId) {
                    console.log('exercice list: ', exercice)
                    //fetching the exercice being edited
                    //copying last performance
                    const latestPerformance = getLatestPerformance(row.performances);
                    const updatedSets = [...latestPerformance.sets];
                    updatedSets[setIndex] = { ...updatedSets[setIndex], reps: value };

                    //formating
                    const updatedPerformance = {
                        ...latestPerformance,
                        sets: updatedSets,
                    };

                    setNewPerformance(updatedPerformance);

                    const updatedPerformances = row.performances.map((perf) =>
                        perf.date === latestPerformance.date ? updatedPerformance : perf
                    );

                    return { ...row, performances: updatedPerformances };
                }
                return row;
            })
        );
    };

    // Triggered when user confirm changes
    const addPerformance = async (exerciceId: string) => {
        if (newPerformance) {
            const updatedPerformance = { ...newPerformance, date: selectedDate };
            const updatedPerformances = [updatedPerformance, ...previousPerformances];
            const success = await editExerciceRequest(exerciceId, undefined, updatedPerformances);
            if (success) {
                console.log('success exercice is being updated');
                console.log('perf list: ', updatedPerformances)
                setExercices((exercice) =>
                    exercice.map((row) =>
                        row._id === exerciceId
                            ? { ...row, performances: updatedPerformances }
                            : row
                    )
                );
                setPreviousPerformances(undefined);
                setNewPerformance(undefined);
            }
        }
    };

    const savePreviousPerformance = (exerciceId: string) => {
        setPreviousPerformances(exercices.find((exercice) => exercice._id === exerciceId).performances);
    };

    const handleChangeExerciceName = async (exerciceId: string, newName: string) => {
        const success = await editExerciceRequest(exerciceId, newName);
        if (success) {
            setExercices((prev) => prev.map((row) => (row._id === exerciceId ? { ...row, name: newName } : row)));
        }
    };

    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), "dd/MM/yyyy");
        } catch (error) {
            return "Date invalide";
        }
    };

    return (
        <div className={styles.root}>
            <div className={styles.desktopView}>
                <table>
                    <thead>
                        <tr>
                            <th scope="col">Exercice name</th>
                            <th scope="col">Last update</th>
                            <th scope="col">Set 1</th>
                            <th scope="col">Set 2</th>
                            <th scope="col">Set 3</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {exercices &&
                            exercices.map((row, rowIndex) => {
                                const latestPerformance = getLatestPerformance(row.performances);
                                return (
                                    <tr key={rowIndex} className={rowIndex % 2 === 0 ? styles.zebraRow : undefined}>
                                        {row.isEditing ? (
                                            <th scope="row" style={{ paddingLeft: "5px" }}>
                                                <label className={styles.exerciceNameContainer}>
                                                    <Checkbox className={styles.editCheckBox} />
                                                    <Input
                                                        className={styles.editInput}
                                                        autoFocus
                                                        value={row.name}
                                                        onChange={(e) =>
                                                            handleChangeExerciceName(row._id, e.target.value)
                                                        }
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
                                        <td>{formatDate(latestPerformance.date)}</td>
                                        {latestPerformance &&
                                            latestPerformance.sets?.map((set, index) => (
                                                <td key={index}>
                                                    {row.isEditing ? (
                                                        <label className={styles.exerciceWeightContainer}>
                                                            <Input
                                                                className={styles.editWeightInput}
                                                                value={set.kg}
                                                                type="number"
                                                                inputProps={{
                                                                    min: -10,
                                                                    style: { width: `${String(set.kg).length + 2}ch` },
                                                                }}
                                                                onChange={(e) =>
                                                                    handleChangeSetKg(row._id, index, e.target.value)
                                                                }
                                                            />
                                                            kg /
                                                            <Input
                                                                className={styles.editWeightInput}
                                                                value={set.reps}
                                                                type="number"
                                                                inputProps={{
                                                                    min: -10,
                                                                    style: {
                                                                        width: `${String(set.reps).length + 2}ch`,
                                                                    },
                                                                }}
                                                                onChange={(e) => {
                                                                    handleChangeSetReps(row._id, index, e.target.value);
                                                                }}
                                                            />
                                                            reps
                                                        </label>
                                                    ) : (
                                                        `${set.kg} kg | ${set.reps} reps`
                                                    )}
                                                </td>
                                            ))}
                                        <td className={styles.iconColumn}>
                                            {row.isEditing ? (
                                                <IconButton
                                                    color="success"
                                                    onClick={() => {
                                                        handleEditExercice(row);
                                                        addPerformance(row._id);
                                                    }}
                                                >
                                                    <FileDownloadDoneIcon className={styles.validIcon} />
                                                </IconButton>
                                            ) : (
                                                <IconButton
                                                    color="info"
                                                    onClick={() => {
                                                        handleEditExercice(row);
                                                        savePreviousPerformance(row._id);
                                                    }}
                                                >
                                                    <BorderColorIcon className={styles.editIcon} />
                                                </IconButton>
                                            )}
                                            <IconButton onClick={() => handleDeleteExercice(row._id)} color="error">
                                                <DeleteIcon className={styles.deleteIcon} />
                                            </IconButton>
                                        </td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
            </div>

            <div className={styles.mobileView}>
                {exercices &&
                    exercices.map((row, rowIndex) => {
                        const latestPerformance = getLatestPerformance(row.performances);
                        return (
                            <div
                                key={rowIndex}
                                className={`${styles.exerciseCard} ${rowIndex % 2 === 0 ? styles.zebraCard : ""}`}
                            >
                                <div className={styles.cardHeader}>
                                    {row.isEditing ? (
                                        <div className={styles.exerciceNameContainer}>
                                            <Checkbox className={styles.editCheckBox} />
                                            <Input
                                                className={styles.editInput}
                                                autoFocus
                                                value={row.name}
                                                onChange={(e) => handleChangeExerciceName(row._id, e.target.value)}
                                            />
                                        </div>
                                    ) : (
                                        <div className={styles.exerciseName}>
                                            <FormControlLabel
                                                control={<Checkbox className={styles.checkBox} />}
                                                label={row.name}
                                            />
                                        </div>
                                    )}
                                    <div className={styles.cardActions}>
                                        {row.isEditing ? (
                                            <IconButton
                                                color="success"
                                                onClick={() => {
                                                    handleEditExercice(row);
                                                    addPerformance(row._id);
                                                }}
                                            >
                                                <FileDownloadDoneIcon className={styles.validIcon} />
                                            </IconButton>
                                        ) : (
                                            <IconButton
                                                color="info"
                                                onClick={() => {
                                                    handleEditExercice(row);
                                                    savePreviousPerformance(row._id);
                                                }}
                                            >
                                                <BorderColorIcon className={styles.editIcon} />
                                            </IconButton>
                                        )}
                                        <IconButton onClick={() => handleDeleteExercice(row._id)} color="error">
                                            <DeleteIcon className={styles.deleteIcon} />
                                        </IconButton>
                                    </div>
                                </div>

                                <div className={styles.setsList}>
                                    {latestPerformance &&
                                        latestPerformance.sets?.map((set, index) => (
                                            <div key={index} className={styles.setItem}>
                                                <span className={styles.setLabel}>Set {index + 1}:</span>
                                                {row.isEditing ? (
                                                    <div className={styles.exerciceWeightContainer}>
                                                        <Input
                                                            className={styles.editWeightInput}
                                                            value={set.kg}
                                                            type="number"
                                                            inputProps={{
                                                                min: 0,
                                                                style: { width: `${String(set.kg).length + 2}ch` },
                                                            }}
                                                            onChange={(e) =>
                                                                handleChangeSetKg(row._id, index, e.target.value)
                                                            }
                                                        />
                                                        kg |
                                                        <Input
                                                            className={styles.editWeightInput}
                                                            value={set.reps}
                                                            type="number"
                                                            inputProps={{
                                                                min: 0,
                                                                style: { width: `${String(set.reps).length + 2}ch` },
                                                            }}
                                                            onChange={(e) =>
                                                                handleChangeSetReps(row._id, index, e.target.value)
                                                            }
                                                        />
                                                        reps
                                                    </div>
                                                ) : (
                                                    <span className={styles.setValue}>
                                                        {set.kg} kg | {set.reps} reps
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                </div>
                                {latestPerformance.note && (
                                    <div className={styles.note}>
                                        <span className={styles.noteLabel}>Note:</span>
                                        <span className={styles.noteContent}>{latestPerformance.note}</span>
                                    </div>
                                )}

                                <div className={styles.performanceDate}>
                                    <span>Last modified date: {formatDate(latestPerformance.date)}</span>
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
});

export default ExerciceTable;
