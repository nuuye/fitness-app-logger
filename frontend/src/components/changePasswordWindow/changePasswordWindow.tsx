import { useState } from "react";
import styles from "./changePassword.module.scss";
import { Button, Card, Input } from "@mui/material";

interface changePasswordWindowProps {
    onCancel?: () => void;
    onConfirm?: () => void;
}

export default function ChangePasswordWindow({ onCancel, onConfirm }: changePasswordWindowProps) {
    const [isExiting, setIsExiting] = useState(false);

    // Function to handle exit animation
    const handleClose = (callback: () => void) => {
        setIsExiting(true);
        setTimeout(() => {
            callback();
        }, 250); // Animation duration
    };

    return (
        <div className={`${styles.rootContainer} ${isExiting ? styles.exit : ""}`}>
            <Card variant="outlined" className={styles.card}>
                <div className={styles.cardBody}>
                    <span>Current password:</span>
                    <Input className={styles.inputs} />
                    <span>New password:</span>
                    <Input className={styles.inputs} />
                    <span>Confirm new password:</span>
                    <Input className={styles.inputs} />
                </div>
                <div className={styles.actions}>
                    <Button variant="outlined" onClick={() => handleClose(onCancel)}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="error" onClick={() => handleClose(onConfirm)}>
                        Change password
                    </Button>
                </div>
            </Card>
        </div>
    );
}
