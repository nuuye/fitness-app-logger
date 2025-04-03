import { Button, Card } from "@mui/material";
import React, { useState } from "react";
import styles from "./confirmWindow.module.scss";

interface ConfirmWindowProps {
    isCategory: boolean;
    label: string;
    onCancel: () => void;
    onConfirm: () => void;
}

export default function ConfirmWindow({ isCategory, label, onCancel, onConfirm }: ConfirmWindowProps) {
    const [isExiting, setIsExiting] = useState(false);

    // Fonction simple pour gérer l'animation de sortie
    const handleClose = (callback: () => void) => {
        setIsExiting(true);
        setTimeout(() => {
            callback();
        }, 250); // Correspondant à la durée de l'animation
    };

    return (
        <div className={`${styles.rootContainer} ${isExiting ? styles.exit : ""}`}>
            <Card variant="outlined" className={styles.card}>
                <div>
                    <h3>Are you sure?</h3>
                    {isCategory ? (
                        <p>This will permanently delete the category "{label}" and its sub-categories</p>
                    ) : (
                        <p>This will permanently delete the sub-category "{label}" and all related exercices</p>
                    )}
                </div>
                <div className={styles.actions}>
                    <Button variant="outlined" onClick={() => handleClose(onCancel)}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="error" onClick={() => handleClose(onConfirm)}>
                        Delete category
                    </Button>
                </div>
            </Card>
        </div>
    );
}
