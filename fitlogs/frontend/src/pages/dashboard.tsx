import styles from "./dashboard.module.scss";
import SideBar from "../components/sideBar/sideBar";

export default function Dashboard() {
    const handleCategory = (category: string) => {
        console.log(category);
    };

    return (
        <div className={styles.root}>
            <SideBar retrieveCategory={handleCategory} />
            <div className={styles.mainContainer}></div>
        </div>
    );
}
