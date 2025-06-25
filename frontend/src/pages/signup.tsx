import AppBar from "../components/appBar/appBar";
import SignUp from "../components/signUp/signUp";
import styles from "./signup.module.scss";

export default function Identification() {
    return (
        <div className={styles.root}>
            <div className={styles.header}>
                <AppBar />
            </div>
            <div className={styles.body}>
                <SignUp />
            </div>
        </div>
    );
}
