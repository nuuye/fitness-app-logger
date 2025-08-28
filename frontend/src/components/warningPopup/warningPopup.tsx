import { Button, Card } from "@mui/material";
import React, { useState } from "react";
import styles from "./warningPopup.module.scss";

interface warningPopupProps {
    title?: string;
    text: string;
    onCancel: () => void;
}

export default function WarningPopup({ title, text, onCancel }: warningPopupProps) {
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
                <div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                </div>
                <div className={styles.actions}>
                    <Button variant="outlined" onClick={() => handleClose(onCancel)}>
                        OK
                    </Button>
                </div>
            </Card>
        </div>
    );
}
