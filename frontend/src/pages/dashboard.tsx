import styles from "./dashboard.module.scss";
import SideBar from "../components/sideBar/sideBar";
import { useEffect, useRef, useState } from "react";
import ExerciceTable, { ExerciceTableRef } from "../components/exerciceTable/exerciceTable";
import { getCategoryRequest } from "../services/category";
import { Button } from "@mui/material";

export default function Dashboard() {
    const tableRef = useRef<ExerciceTableRef>(null);
    const [sideBarOpen, setSideBarOpen] = useState<boolean>(true);
    const [selectedSubCategory, setSelectedSubCategory] = useState<string>();
    const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<string>();

    useEffect(() => {
        setSelectedSubCategory(localStorage.getItem("subCategory"));
        setSelectedSubCategoryId(localStorage.getItem("subCategoryId"));
    }, []);

    const triggerChildMethod = () => {
        tableRef.current?.handleCreateExercice();
    };

    const handleCategory = async (categoryId: string) => {
        localStorage.setItem("subCategoryId", categoryId);
        const retrieveCategory = await getCategoryRequest(categoryId);
        if (retrieveCategory) {
            setSelectedSubCategoryId(categoryId);
            setSelectedSubCategory(retrieveCategory.name);
            localStorage.setItem("subCategory", retrieveCategory.name);
        }
    };

    const handleSideBarStatus = (open: boolean) => {
        setSideBarOpen(open);
    };

    return (
        <div className={styles.root}>
            <SideBar retrieveCategory={handleCategory} retrieveSideBarStatus={handleSideBarStatus} />
            <div className={`${styles.mainContainer} ${!sideBarOpen && styles.extendedMainContainer}`}>
                <div className={styles.titleContainer}>
                    <span className={styles.title}>
                        {selectedSubCategory ? selectedSubCategory + " section" : "..."}
                    </span>
                    <Button className={styles.addButton} variant="contained" onClick={triggerChildMethod}>
                        Add new exercice
                    </Button>
                </div>
                <ExerciceTable categoryId={selectedSubCategoryId} ref={tableRef}/>
            </div>
        </div>
    );
}
