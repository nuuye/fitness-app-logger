import SignIn from "../components/signIn/signIn";
import styles from "./signup.module.scss";

export default function signin() {
    return (
        <div className={styles.root}>
            <SignIn />
        </div>
    );
}
