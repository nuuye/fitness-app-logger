import SignIn from "../components/signIn/signIn";
import styles from "./signin.module.scss";
import AppBar from '../components/appBar/appBar';

export default function signin() {
    return (
        <div className={styles.root}>
            <div className={styles.header}>
                <AppBar />
            </div>
            <div className={styles.body}>
                <SignIn />
            </div>
        </div>
    );
}
