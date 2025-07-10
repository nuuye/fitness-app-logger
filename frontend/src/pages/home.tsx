import styles from "./home.module.scss";
import SideBar, { SideBarRef } from "../components/sideBar/sideBar";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import AuthWrapper from "../components/authWrapper/authWrapper";
import DeleteCategoryWindow from "../components/deleteCategoryWindow/deleteCategoryWindow";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { categoryType, ExerciceType, subCategoryType } from "../types";
import { useUser } from "../context/userContext";
import { FormControl, InputLabel, ListSubheader, MenuItem, Select } from "@mui/material";
import { retrieveCategoriesRequest } from "../services/category";
import { retrieveUserSubCategoriesRequest } from "../services/subCategory";
import React from "react";
import { getAllUserExerciceRequest } from "../services/exercice";
import dayjs from "dayjs";

export default function Home() {
    const router = useRouter();
    const sideBarRef = useRef<SideBarRef>(null);

    const [sideBarOpen, setSideBarOpen] = useState<boolean | null>(null);
    const { user } = useUser();
    const [showDeleteCategoryWindow, setShowDeleteCategoryWindow] = useState<boolean>(false);
    const [tempCategory, setTempCategory] = useState<{ id: string; label: string }>(null);
    const [hideMenu, setHideMenu] = useState<boolean>(true);
    const [data, setData] = useState<Map<categoryType, subCategoryType[]>>(new Map());
    const [selected, setSelected] = useState<string>("");
    const [selectedExercices, setSelectedExercices] = useState<ExerciceType[]>([]);
    const [chartData, setChartData] = useState([{}]);

    useEffect(() => {
        setSideBarOpen(localStorage.getItem("sideBarOpen") === "true");
        if (user) {
            retrieveData();
        }
    }, [user]);

    useEffect(() => {
        console.log("selected exs: ", selectedExercices);
        if (!selectedExercices || selectedExercices.length === 0) {
            setChartData([]);
            return;
        }

        // Map intermédiaire pour regrouper les volumes par date
        const tempData: Record<string, any> = {}; // { "2025-07-01": { date: ..., "exercice1": ..., "exercice2": ... } }

        for (const ex of selectedExercices) {
            const exerciseName = ex.name; // Utiliser le nom de l'exercice comme clé

            for (const performance of ex.performances) {
                const { date, sets } = performance;

                const total = sets.reduce(
                    (acc, curr) => {
                        const kg = Number(curr.kg);
                        const reps = Number(curr.reps);
                        acc.totalKg += kg;
                        acc.totalReps += reps;
                        // Si le poids est 0, le volume = nombre de reps (exercices au poids du corps)
                        // Sinon, volume = reps * kg (exercices avec poids)
                        acc.volume += kg === 0 ? reps : reps * kg;
                        return acc;
                    },
                    { totalKg: 0, totalReps: 0, volume: 0 }
                );

                if (ex.performances.length > 1 && total.volume > 0) {
                    // Initialiser la date si elle n'existe pas
                    if (!tempData[date]) {
                        tempData[date] = { date };
                    }

                    // Ajouter les données de cet exercice pour cette date
                    tempData[date][exerciseName] = {
                        kg: total.totalKg,
                        reps: total.totalReps,
                        volume: total.volume,
                        sets: sets.map((set) => ({
                            kg: Number(set.kg),
                            reps: Number(set.reps),
                        })),
                    };
                }
            }
        }

        // Transformer le map en tableau et trier par date
        const result = Object.values(tempData).sort((a, b) => (dayjs(a.date).isBefore(dayjs(b.date)) ? -1 : 1));

        setChartData(result);
        console.log("chartdata: ", chartData);
    }, [selectedExercices]);

    const retrieveExercices = async (subCategoryId: string) => {
        const exs = await getAllUserExerciceRequest(user.userId);
        if (exs) {
            setSelectedExercices(exs.filter((ex) => ex.subCategory === subCategoryId));
        }
    };

    // Retrieves the categories and subCategories of logged user
    const retrieveData = async () => {
        const categories = await retrieveCategoriesRequest(user.userId);
        const subCategories = await retrieveUserSubCategoriesRequest(user.userId);
        if (categories && subCategories) {
            const newMap = new Map<categoryType, subCategoryType[]>();
            for (const category of categories) {
                const filteredSubs = subCategories.filter((subCategory) => subCategory.category === category._id);
                newMap.set(category, filteredSubs);
            }
            setData(newMap);
        }
    };

    const handleCancelWindow = () => {
        setShowDeleteCategoryWindow(!showDeleteCategoryWindow);
    };

    const handleSubCategory = async (categoryId: string) => {
        localStorage.setItem("subCategoryId", categoryId);
        router.push("/dashboard");
    };

    const triggerDeleteCategory = (id: string) => {
        sideBarRef.current?.handleCategoryDelete(id);
    };

    const handleChange = (event) => {
        const subCategoryId = event.target.value;
        console.log("onChange triggered with value:", event.target.value);
        if (subCategoryId) {
            setSelected(subCategoryId);
            retrieveExercices(subCategoryId);
        } else {
            setSelectedExercices([]);
        }
    };

    const colors = ["#8884d8", "#82ca9d", "#ff7300", "#00c49f", "#ff6384", "#a28dd0", "#8dd1e1", "#d084d0"];

    // Extraire les noms des exercices sélectionnés
    const rawExerciseNames = chartData.map((data) => [...Object.keys(data)][1]);
    const exerciseNames = new Set(rawExerciseNames);
    
    if (sideBarOpen === null) return null;

    return (
        <AuthWrapper>
            <div className={styles.root}>
                {showDeleteCategoryWindow && (
                    <DeleteCategoryWindow
                        isCategory
                        label={tempCategory.label}
                        onCancel={handleCancelWindow}
                        onConfirm={() => {
                            triggerDeleteCategory(tempCategory.id);
                            handleCancelWindow();
                        }}
                    />
                )}
                <SideBar
                    retrieveSubCategory={handleSubCategory}
                    retrieveSideBarStatus={setSideBarOpen}
                    onClickDelete={(categoryId, label) => {
                        handleCancelWindow();
                        setTempCategory({ id: categoryId, label: label });
                    }}
                    ref={sideBarRef}
                    retrieveShowMenuStatus={setHideMenu}
                />
                <div
                    className={`${styles.mainContainer} ${!sideBarOpen && styles.extendedMainContainer} ${
                        !hideMenu && styles.isMenuOpen
                    }`}
                >
                    <div className={`${styles.titleContainer} ${sideBarOpen && styles.titleContainerResponsive}`}>
                        <span className={styles.title}>Welcome back</span>
                    </div>
                    <FormControl sx={{ m: 3, minWidth: 300 }}>
                        <InputLabel id="multiple-grouped-select-label" sx={{ color: "grey.500" }}>
                            Select exercises to analyze
                        </InputLabel>
                        <Select
                            value={selected}
                            onChange={handleChange}
                            id="grouped-select"
                            label="Select an exercice to analyze"
                            sx={{
                                color: "grey.800",
                                ".MuiOutlinedInput-input": {
                                    color: "grey.400",
                                },
                                ".MuiOutlinedInput-notchedOutline": {
                                    borderColor: "grey.600",
                                },
                                "&:hover .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "grey.700",
                                },
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "grey.800",
                                },
                                ".MuiSvgIcon-root": {
                                    color: "grey.500",
                                },
                            }}
                            MenuProps={{
                                PaperProps: {
                                    sx: {
                                        bgcolor: "rgba(51, 51, 52, 0.92)",
                                        color: "hsl(219, 19.00%, 76.30%)",
                                    },
                                },
                            }}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {[...data.entries()]
                                .map(([category, subCategories]) => [
                                    <ListSubheader
                                        key={`header-${category._id}`}
                                        sx={{ bgcolor: "hsla(210, 88.90%, 17.60%, 0.50)", color: "hsl(220, 20%, 65%)" }}
                                    >
                                        {category.name.toUpperCase()}
                                    </ListSubheader>,
                                    ...subCategories.map((subCategory) => (
                                        <MenuItem
                                            key={subCategory._id}
                                            value={subCategory._id}
                                            sx={{
                                                "&.Mui-selected": {
                                                    bgcolor: "rgba(51, 51, 52, 0.92)",
                                                    "&:hover": {
                                                        bgcolor: "rgba(51, 51, 52, 0.92)",
                                                    },
                                                },
                                            }}
                                        >
                                            {subCategory.name}
                                        </MenuItem>
                                    )),
                                ])
                                .flat()}
                        </Select>
                    </FormControl>

                    {/* Graphique avec une ligne par exercice */}
                    {chartData.length > 0 && (
                        <ResponsiveContainer width="100%" height={400}>
                            <LineChart data={chartData} margin={{ top: 20, right: 40, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={(dateStr: string) => dayjs(dateStr).format("DD/MM/YY")}
                                />
                                <YAxis />
                                <Tooltip
                                    formatter={(value: any, name: string, props: any) => {
                                        const exoData = props.payload[name];
                                        if (!exoData || !exoData.sets) return [value, name];

                                        // Formater chaque série avec des retours à la ligne
                                        const setsDisplay = exoData.sets
                                            .map((set) => `${set.kg}kg x ${set.reps}`)
                                            .join("\n");

                                        const volumeDisplay = exoData.sets.some((set) => set.kg === 0)
                                            ? `${exoData.volume} reps`
                                            : `${exoData.volume}kg`;

                                        return [`\n${setsDisplay}\n= ${volumeDisplay}`, name];
                                    }}
                                    labelFormatter={(dateStr: string) => dayjs(dateStr).format("DD/MM/YY")}
                                    contentStyle={{
                                        backgroundColor: "rgba(51, 51, 52, 0.95)",
                                        border: "1px solid #666",
                                        borderRadius: "8px",
                                        color: "#fff",
                                        whiteSpace: "pre-line",
                                    }}
                                />
                                <Legend />

                                {/* Créer une ligne pour chaque exercice */}
                                {Array.from(exerciseNames).map((exerciseName, idx) => (
                                    <Line
                                        key={exerciseName}
                                        type="monotone"
                                        dataKey={(d: any) => d[exerciseName]?.volume ?? null}
                                        name={exerciseName}
                                        stroke={colors[idx % colors.length]}
                                        strokeWidth={3}
                                        dot={{ r: 4 }}
                                        activeDot={{ r: 6 }}
                                        connectNulls={false}
                                    />
                                ))}
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>
        </AuthWrapper>
    );
}
