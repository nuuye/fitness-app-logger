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
    const [selectedSubCategoryLabel, setSelectedSubCategoryLabel] = useState<string>();
    const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<string>();
    const [showConfirmationWindow, setShowConfirmationWindow] = useState<boolean>(false);
    const [tempCategory, setTempCategory] = useState<{ id: string; label: string }>(null);

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
        setShowConfirmationWindow(!showConfirmationWindow);
    };

    const handleSideBarStatus = (open: boolean) => {
        setSideBarOpen(open);
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
                    retrieveSubCategory={handleSubCategory}
                    retrieveSideBarStatus={handleSideBarStatus}
                    onClickDelete={(categoryId, label) => {
                        handleCancelWindow();
                        setTempCategory({ id: categoryId, label: label });
                    }}
                    ref={sideBarRef}
                    onChangeSubCategoryLabel={setSelectedSubCategoryLabel}
                />
                <div className={`${styles.mainContainer} ${!sideBarOpen && styles.extendedMainContainer}`}>
                    <div className={`${styles.titleContainer} ${sideBarOpen && styles.titleContainerResponsive}`}>
                        <span className={styles.title}>
                            {selectedSubCategoryLabel ? selectedSubCategoryLabel : "..."}
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
