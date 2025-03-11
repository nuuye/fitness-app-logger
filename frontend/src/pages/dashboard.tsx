import styles from "./dashboard.module.scss";
import SideBar from "../components/sideBar/sideBar";
import { useState } from "react";
import ExerciceTable from "../components/exerciceTable/exerciceTable";

export default function Dashboard() {
    const [sideBarOpen, setSideBarOpen] = useState<boolean>(true);

    const handleCategory = (category: string) => {
        console.log(category);
    };

    const handleSideBarStatus = (open: boolean) => {
        setSideBarOpen(open);
    };

    return (
        <div className={styles.root}>
            <SideBar retrieveCategory={handleCategory} retrieveSideBarStatus={handleSideBarStatus} />
            <div className={`${styles.mainContainer} ${!sideBarOpen && styles.extendedMainContainer}`}>
                <ExerciceTable />
            </div>
        </div>
    );
}
