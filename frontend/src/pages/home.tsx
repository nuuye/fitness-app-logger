import styles from "./home.module.scss";
import SideBar, { SideBarRef } from "../components/sideBar/sideBar";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import AuthWrapper from "../components/authWrapper/authWrapper";
import DeleteCategoryWindow from "../components/deleteCategoryWindow/deleteCategoryWindow";
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import { categoryType, ExerciceType, subCategoryType } from "../types";
import { useUser } from "../context/userContext";
import { FormControl, InputLabel, ListSubheader, MenuItem, Select } from "@mui/material";
import { retrieveCategoriesRequest } from "../services/category";
import { retrieveUserSubCategoriesRequest } from "../services/subCategory";
import React from "react";
import { getAllUserExerciceRequest } from "../services/exercice";

const chartData = [
    {
        name: "2025-07-02",
        chest: 4000,
        shoulder: 2400,
    },
    {
        name: "2025-07-04",
        chest: 3000,
        shoulder: 1398,
    },
    {
        name: "2025-07-12",
        chest: 2000,
        shoulder: 9800,
    },
    {
        name: "2025-07-17",
        chest: 2780,
        shoulder: 3908,
    },
    {
        name: "2025-07-22",
        chest: 1890,
        shoulder: 4800,
    },
    {
        name: "2025-07-29",
        chest: 2390,
        shoulder: 3800,
    },
    {
        name: "2025-08-04",
        chest: 3490,
        shoulder: 4300,
    },
];

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
    const [selectedExercices, setSelectedExercices] = useState<ExerciceType[]>();

    useEffect(() => {
        setSideBarOpen(localStorage.getItem("sideBarOpen") === "true");
        if (user) {
            retrieveData();
            retrieveExercices();
        }
    }, [user]);

    useEffect(() => {
        console.log("exs: ", selectedExercices);
    }, [data, selected, selectedExercices]);

    const retrieveExercices = async () => {
        const exs = await getAllUserExerciceRequest(user.userId);
        if (exs) {
            setSelectedExercices(exs.filter((ex) => ex.subCategory == selected));
        }
    };

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

    //handles the display of sub categories on dashboard whenever click
    const handleSubCategory = async (categoryId: string) => {
        localStorage.setItem("subCategoryId", categoryId);
        router.push("/dashboard");
    };

    const triggerDeleteCategory = (id: string) => {
        sideBarRef.current?.handleCategoryDelete(id);
    };

    const handleChange = (event) => {
        console.log("onChange triggered with value:", event.target.value);
        setSelected(event.target.value);
    };

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

                    {/* Insert lines chart here */}
                </div>
            </div>
        </AuthWrapper>
    );
}
