import styles from "./dashboard.module.scss";
import SideBar, { SideBarRef } from "../components/sideBar/sideBar";
import { useEffect, useRef, useState } from "react";
import ExerciceTable, { ExerciceTableRef } from "../components/exerciceTable/exerciceTable";
import { getSubCategoryRequest } from "../services/subCategory";
import { Button } from "@mui/material";
import AuthWrapper from "../components/authWrapper/authWrapper";
import ConfirmWindow from "../components/confirmationWindow/confirmWindow";

export default function Dashboard() {
    const tableRef = useRef<ExerciceTableRef>(null);
    const sideBarRef = useRef<SideBarRef>(null);
    const [sideBarOpen, setSideBarOpen] = useState<boolean>(true);
    const [selectedSubCategory, setSelectedSubCategory] = useState<string>();
    const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<string>();
    const [showConfirmationWindow, setShowConfirmationWindow] = useState<boolean>(false);
    const [tempCategory, setTempCategory] = useState<{ id: string; label: string }>(null);

    useEffect(() => {
        setSelectedSubCategory(localStorage.getItem("subCategory"));
        setSelectedSubCategoryId(localStorage.getItem("subCategoryId"));
    }, []);

    const triggerCreateExercice = () => {
        tableRef.current?.handleCreateExercice();
    };

    const triggerDeleteCategory = (id: string) => {
        console.log("triggered");
        sideBarRef.current?.handleCategoryDelete(id);
    };

    const handleCategory = async (categoryId: string) => {
        localStorage.setItem("subCategoryId", categoryId);
        const retrieveCategory = await getSubCategoryRequest(categoryId);
        if (retrieveCategory) {
            setSelectedSubCategoryId(categoryId);
            setSelectedSubCategory(retrieveCategory.name);
            localStorage.setItem("subCategory", retrieveCategory.name);
        }
    };

    const handleSideBarStatus = (open: boolean) => {
        setSideBarOpen(open);
    };

    const handleCancelWindow = () => {
        setShowConfirmationWindow(!showConfirmationWindow);
    };

    return (
        <AuthWrapper>
            <div className={styles.root}>
                {showConfirmationWindow && (
                    <ConfirmWindow
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
                    retrieveSubCategory={handleCategory}
                    retrieveSideBarStatus={handleSideBarStatus}
                    onClickDelete={(categoryId, label) => {
                        handleCancelWindow();
                        setTempCategory({ id: categoryId, label: label });
                    }}
                    ref={sideBarRef}
                />
                <div className={`${styles.mainContainer} ${!sideBarOpen && styles.extendedMainContainer}`}>
                    <div className={`${styles.titleContainer} ${sideBarOpen && styles.titleContainerResponsive}`}>
                        <span className={styles.title}>
                            {selectedSubCategory ? selectedSubCategory + " section" : "..."}
                        </span>
                        <Button className={styles.addButton} variant="contained" onClick={triggerCreateExercice}>
                            Add new exercice
                        </Button>
                    </div>
                    <ExerciceTable subCategoryId={selectedSubCategoryId} ref={tableRef} />
                </div>
            </div>
        </AuthWrapper>
    );
}
