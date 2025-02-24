import SignUp from "../components/signUp/signUp";
import SignIn from "../components/signIn/signIn";

import styles from "./identification.module.scss";

export default function Identification() {
    return (
        <div className={styles.root}>
            <SignIn />
        </div>
    );
}
