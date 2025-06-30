import styles from "./home.module.scss";
import SideBar, { SideBarRef } from "../components/sideBar/sideBar";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import AuthWrapper from "../components/authWrapper/authWrapper";
import DeleteCategoryWindow from "../components/deleteCategoryWindow/deleteCategoryWindow";
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import { categoryType, subCategoryType } from "../types";
import { useUser } from "../context/userContext";
import { FormControl, InputLabel, ListSubheader, MenuItem, Select } from "@mui/material";
import { retrieveCategoriesRequest } from "../services/category";
import { retrieveUserSubCategoriesRequest } from "../services/subCategory";
import React from "react";

const chartData = [
    {
        name: "Page A",
        uv: 4000,
        pv: 2400,
    },
    {
        name: "Page B",
        uv: 3000,
        pv: 1398,
    },
    {
        name: "Page C",
        uv: 2000,
        pv: 9800,
    },
    {
        name: "Page D",
        uv: 2780,
        pv: 3908,
    },
    {
        name: "Page E",
        uv: 1890,
        pv: 4800,
    },
    {
        name: "Page F",
        uv: 2390,
        pv: 3800,
    },
    {
        name: "Page G",
        uv: 3490,
        pv: 4300,
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

    useEffect(() => {
        setSideBarOpen(localStorage.getItem("sideBarOpen") === "true");
        if (user) {
            retrieveData();
        }
    }, [user]);

    useEffect(() => {
        console.log("data updated:", data);
    }, [data]);

    const retrieveData = async () => {
        const categories = await retrieveCategoriesRequest(user.userId);
        const subCategories = await retrieveUserSubCategoriesRequest(user.userId);
        console.log("categories: ", categories);
        console.log("subCategories: ", subCategories);
        if (categories) {
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
                    <FormControl sx={{ m: 3, minWidth: 120 }}>
                        <InputLabel htmlFor="grouped-select" sx={{ color: "grey.700" }}>
                            Select an exercice to analyze
                        </InputLabel>
                        <Select
                            defaultValue=""
                            id="grouped-select"
                            label="Select an exercice to analyze"
                            sx={{
                                color: "grey.800", // texte sélectionné
                                ".MuiOutlinedInput-notchedOutline": {
                                    borderColor: "grey.500",
                                },
                                "&:hover .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "grey.700",
                                },
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "grey.800",
                                },
                                ".MuiSvgIcon-root": {
                                    color: "grey.700",
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
                            {Array.from(data.entries()).map(([category, subCategories]) => (
                                <React.Fragment key={category._id}>
                                    <ListSubheader sx={{ bgcolor: "hsl(210, 56%, 20%)", color: "hsl(220, 20%, 65%)" }}>
                                        {category.name.toLocaleUpperCase()}
                                    </ListSubheader>
                                    {subCategories.map((subCategory) => (
                                        <MenuItem key={subCategory._id} value={subCategory._id}>
                                            {subCategory.name}
                                        </MenuItem>
                                    ))}
                                </React.Fragment>
                            ))}
                        </Select>
                    </FormControl>

                    <LineChart
                        width={730}
                        height={250}
                        data={chartData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="pv" stroke="#8884d8" />
                        <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                    </LineChart>
                </div>
            </div>
        </AuthWrapper>
    );
}
