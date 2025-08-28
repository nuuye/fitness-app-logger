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
import { ExerciceType, PerformanceType } from "../../types/exercice";

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

    //retrieves the performance closest to the selected date
    const getClosestPerformance = (performances: PerformanceType[], targetDate?: string): PerformanceType => {
        if (!performances || performances.length === 0) {
            return {
                date: new Date().toISOString(),
                sets: [],
                note: "",
            };
        }

        // Si aucune date cible n'est fournie, retourner la performance la plus récente
        if (!targetDate) {
            return performances.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
        }

        const target = new Date(targetDate).getTime();

        // Trouver la performance avec la date la plus proche
        let closestPerformance = performances[0];
        let smallestDifference = Math.abs(new Date(performances[0].date).getTime() - target);

        for (let i = 1; i < performances.length; i++) {
            const currentDifference = Math.abs(new Date(performances[i].date).getTime() - target);
            if (currentDifference < smallestDifference) {
                smallestDifference = currentDifference;
                closestPerformance = performances[i];
            }
        }

        return closestPerformance;
    };

    // Fonction pour comparer deux performances
    const arePerformancesEqual = (perf1: PerformanceType, perf2: PerformanceType): boolean => {
        // Comparer les sets
        if (perf1.sets.length !== perf2.sets.length) return false;

        for (let i = 0; i < perf1.sets.length; i++) {
            // Convertir en nombres pour la comparaison
            const kg1 = Number(perf1.sets[i].kg);
            const kg2 = Number(perf2.sets[i].kg);
            const reps1 = Number(perf1.sets[i].reps);
            const reps2 = Number(perf2.sets[i].reps);

            if (kg1 !== kg2 || reps1 !== reps2) {
                return false;
            }
        }

        // Comparer les notes (en ignorant les différences entre undefined, null et "")
        const note1 = perf1.note || "";
        const note2 = perf2.note || "";
        return note1 === note2;
    };

    // Fonction pour vérifier si une performance est vide (tous les sets à 0)
    const isPerformanceEmpty = (performance: PerformanceType): boolean => {
        return performance.sets.every((set) => {
            const kg = Number(set.kg);
            const reps = Number(set.reps);
            return kg === 0 && reps === 0;
        });
    };

    const addPerformance = async (exerciceId: string) => {
        if (newPerformance) {
            // Créer une nouvelle performance sans l'_id (pour éviter les conflits)
            const updatedPerformance = {
                date: selectedDate,
                sets: newPerformance.sets,
                note: newPerformance.note || "",
            };

            let updatedPerformances: PerformanceType[] = [];

            console.log("Nouvelle performance:", updatedPerformance);
            console.log("Performances précédentes:", previousPerformances);

            // Vérifier si la performance est vide
            if (isPerformanceEmpty(updatedPerformance)) {
                console.log("Performance vide, pas d'ajout");
                // Réinitialiser les états sans sauvegarder
                setPreviousPerformances(undefined);
                setNewPerformance(undefined);
                return;
            }

            // Vérifier si la performance est identique à la performance originale (avant modification)
            if (previousPerformances && previousPerformances.length > 0) {
                const originalPerformance = getClosestPerformance(previousPerformances, selectedDate);
                console.log("Performance originale:", originalPerformance);

                if (arePerformancesEqual(updatedPerformance, originalPerformance)) {
                    console.log("Performance identique à l'originale, pas d'ajout");
                    // Réinitialiser les états sans sauvegarder
                    setPreviousPerformances(undefined);
                    setNewPerformance(undefined);
                    return;
                }
            }

            if (
                previousPerformances &&
                previousPerformances.length === 1 &&
                isPerformanceEmpty(previousPerformances[0])
            ) {
                updatedPerformances = [updatedPerformance];
            } else {
                updatedPerformances = [updatedPerformance, ...previousPerformances];
            }
            const success = await editExerciceRequest(exerciceId, undefined, updatedPerformances);
            if (success) {
                setExercices((exercice) =>
                    exercice.map((row) =>
                        row._id === exerciceId ? { ...row, performances: updatedPerformances } : row
                    )
                );
                setPreviousPerformances(undefined);
                setNewPerformance(undefined);
            }
        }
    };
    //handler trigered while changing kg
    const handleChangeSetKg = (exerciceId: string, setIndex: number, value: number | string) => {
        setExercices((exercice) =>
            exercice.map((row) => {
                if (row._id === exerciceId) {
                    console.log("exercice list: ", exercice);
                    //fetching the exercice being edited
                    //copying last performance
                    const latestPerformance = getClosestPerformance(row.performances, selectedDate);
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
                    console.log("exercice list: ", exercice);
                    //fetching the exercice being edited
                    //copying last performance
                    const latestPerformance = getClosestPerformance(row.performances, selectedDate);

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
                                const latestPerformance = getClosestPerformance(row.performances, selectedDate);
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
                                                        onKeyDown={(e) => {
                                                            if (e.key === "Enter") {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                handleEditExercice(row);
                                                                addPerformance(row._id);
                                                                (document.activeElement as HTMLElement)?.blur();
                                                            }
                                                        }}
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
                                                                onKeyDown={(e) => {
                                                                    if (e.key === "Enter") {
                                                                        e.preventDefault();
                                                                        e.stopPropagation();
                                                                        handleEditExercice(row);
                                                                        addPerformance(row._id);
                                                                        (document.activeElement as HTMLElement)?.blur();
                                                                    }
                                                                }}
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
                                                                onKeyDown={(e) => {
                                                                    if (e.key === "Enter") {
                                                                        e.preventDefault();
                                                                        e.stopPropagation();
                                                                        handleEditExercice(row);
                                                                        addPerformance(row._id);
                                                                        (document.activeElement as HTMLElement)?.blur();
                                                                    }
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
                        const latestPerformance = getClosestPerformance(row.performances, selectedDate);
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
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        handleEditExercice(row);
                                                        addPerformance(row._id);
                                                        (document.activeElement as HTMLElement)?.blur();
                                                    }
                                                }}
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
                                                            onKeyDown={(e) => {
                                                                if (e.key === "Enter") {
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                    handleEditExercice(row);
                                                                    addPerformance(row._id);
                                                                    (document.activeElement as HTMLElement)?.blur();
                                                                }
                                                            }}
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
                                                            onKeyDown={(e) => {
                                                                if (e.key === "Enter") {
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                    handleEditExercice(row);
                                                                    addPerformance(row._id);
                                                                    (document.activeElement as HTMLElement)?.blur();
                                                                }
                                                            }}
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
