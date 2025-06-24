import styles from "./dashboard.module.scss";
import SideBar, { SideBarRef } from "../components/sideBar/sideBar";
import { useEffect, useRef, useState } from "react";
import ExerciceTable, { ExerciceTableRef } from "../components/exerciceTable/exerciceTable";
import { getSubCategoryRequest } from "../services/subCategory";
import { Button, TextField } from "@mui/material";
import AuthWrapper from "../components/authWrapper/authWrapper";
import DeleteCategoryWindow from "../components/deleteCategoryWindow/deleteCategoryWindow";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";

export default function Dashboard() {
    const tableRef = useRef<ExerciceTableRef>(null);
    const sideBarRef = useRef<SideBarRef>(null);

    const [sideBarOpen, setSideBarOpen] = useState<boolean | null>(null);
    const [hideMenu, setHideMenu] = useState<boolean>(true);

    const [selectedSubCategoryLabel, setSelectedSubCategoryLabel] = useState<string>();
    const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<string>();
    const [showDeleteCategoryWindow, setShowDeleteCategoryWindow] = useState<boolean>(false);
    const [tempCategory, setTempCategory] = useState<{ id: string; label: string }>(null);

    const [value, setValue] = useState<Dayjs | null>(dayjs());
    const [selectedDateISO, setSelectedDateISO] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (value) {
            // Convertir la date Dayjs en chaîne ISO pour la passer au composant ExerciceTable
            setSelectedDateISO(value.format("YYYY-MM-DD") + "T00:00:00.000Z");
        } else {
            setSelectedDateISO(undefined);
        }
    }, [value]);

    useEffect(() => {
        setSideBarOpen(localStorage.getItem("sideBarOpen") === "true");

        const subCategoryId = localStorage.getItem("subCategoryId");
        if (!subCategoryId) return;

        getSubCategoryRequest(subCategoryId).then((subCategory) => {
            if (!subCategory) return;
            setSelectedSubCategoryId(subCategoryId);
            setSelectedSubCategoryLabel(subCategory.name);
        });
    }, []);

    const triggerCreateExercice = () => {
        tableRef.current?.handleCreateExercice();
    };

    const triggerDeleteCategory = (id: string) => {
        console.log("triggered");
        sideBarRef.current?.handleCategoryDelete(id);
    };

    //handles the display of sub categories on dashboard whenever click
    const handleSubCategory = async (categoryId: string) => {
        localStorage.setItem("subCategoryId", categoryId);
        const retrieveSubCategory = await getSubCategoryRequest(categoryId);
        if (retrieveSubCategory) {
            setSelectedSubCategoryId(categoryId);
            setSelectedSubCategoryLabel(retrieveSubCategory.name);
            localStorage.setItem("subCategory", retrieveSubCategory.name);
        }
    };

    const handleCancelWindow = () => {
        setShowDeleteCategoryWindow(!showDeleteCategoryWindow);
    };

    // Formater la date pour l'affichage
    const getFormattedDisplayDate = () => {
        if (!value) return "Today";

        const today = dayjs();
        const selected = value;

        if (selected.format("YYYY-MM-DD") === today.format("YYYY-MM-DD")) {
            return "Today";
        }

        return selected.format("DD/MM/YYYY");
    };

    if(sideBarOpen === null) return null;

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
                    onChangeSubCategoryLabel={setSelectedSubCategoryLabel}
                    retrieveShowMenuStatus={setHideMenu}
                />
                <div
                    className={`${styles.mainContainer} ${!sideBarOpen && styles.extendedMainContainer} ${
                        !hideMenu && styles.isMenuOpen
                    }`}
                >
                    <div className={`${styles.titleContainer} ${sideBarOpen && styles.titleContainerResponsive}`}>
                        <span className={styles.title}>
                            {selectedSubCategoryLabel ? selectedSubCategoryLabel : "Select/Create a sub-cat"}
                        </span>
                        <Button className={styles.addButton} variant="contained" onClick={triggerCreateExercice}>
                            Add new exercice
                        </Button>
                    </div>
                    <div className={styles.dateSection}>
                        <span className={styles.date}>{getFormattedDisplayDate()}</span>
                        <LocalizationProvider dateAdapter={AdapterDayjs} className={styles.datePicker}>
                            <DatePicker
                                label="Date"
                                value={value}
                                onChange={(newValue) => setValue(newValue)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        sx={{
                                            input: { color: "rgb(187, 186, 185)" },
                                            label: { color: "rgb(187, 186, 185)" },
                                            ".MuiOutlinedInput-root": {
                                                "& fieldset": {
                                                    borderColor: "rgb(187, 186, 185)",
                                                },
                                                "&:hover fieldset": {
                                                    borderColor: "gray",
                                                },
                                                "&.Mui-focused fieldset": {
                                                    borderColor: "rgba(255, 255, 255, 0.7)",
                                                },
                                            },
                                            ".MuiSvgIcon-root": {
                                                color: "rgb(187, 186, 185)",
                                            },
                                        }}
                                    />
                                )}
                            />
                        </LocalizationProvider>
                    </div>
                    <ExerciceTable
                        subCategoryId={selectedSubCategoryId}
                        selectedDate={selectedDateISO}
                        ref={tableRef}
                    />
                </div>
            </div>
        </AuthWrapper>
    );
}
