import Card from "@mui/material/Card";
import styles from "./signUp.module.scss";

export default function SignUp() {
    return (
        <div className={styles.root}>
            <Card className={styles.cardContainer} variant="outlined">
                <h1>Sign up</h1>
            </Card>
        </div>
    );
}
