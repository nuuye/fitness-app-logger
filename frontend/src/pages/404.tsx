import styles from "./404.module.scss";

export default function Custom404() {
    return (
        <div className={styles.root}>
            <div className={styles.container}>
                <div className={styles.errorNumber}>404</div>
                <h1 className={styles.errorTitle}>Oops! Page not found</h1>

                <p className={styles.errorSubtitle}>
                    Looks like this page ran away while we weren't looking! Maybe it's doing cardio somewhere...
                </p>
            </div>
        </div>
    );
}
