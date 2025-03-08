import styles from "./dashboard.module.scss";
import SideBar from "../components/sideBar/sideBar";
import { useRouter } from "next/router";

export default function Dashboard() {
    const router = useRouter();

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
