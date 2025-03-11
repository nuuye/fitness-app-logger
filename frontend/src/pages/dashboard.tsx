import styles from "./dashboard.module.scss";
import SideBar from "../components/sideBar/sideBar";
import { useEffect, useState } from "react";
import ExerciceTable from "../components/exerciceTable/exerciceTable";
import { getCategoryRequest } from "../services/category";
import { categoryType } from "../types";

export default function Dashboard() {
    const [sideBarOpen, setSideBarOpen] = useState<boolean>(true);
    const [selectedSubCategory, setSelectedSubCategory] = useState<string>();
    const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<string>();

    useEffect(() => {
        setSelectedSubCategory(localStorage.getItem("subCategory"));
        setSelectedSubCategoryId(localStorage.getItem("subCategoryId"));
    }, []);

    const handleCategory = async (categoryId: string) => {
        localStorage.setItem("subCategoryId", categoryId);
        const retrieveCategory = await getCategoryRequest(categoryId);
        if (retrieveCategory) {
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
                <span className={styles.title}>{selectedSubCategory ? selectedSubCategory + " section" : "..."}</span>
                <ExerciceTable categoryId={selectedSubCategoryId} />
            </div>
        </div>
    );
}
