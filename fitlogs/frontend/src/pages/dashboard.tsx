import styles from "./dashboard.module.scss";
import SideBar from "../components/sideBar/sideBar";

export default function Dashboard() {
    return (
        <div className={styles.root}>
            <SideBar />
        </div>
    );
}
