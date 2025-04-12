import { Button, Card } from "@mui/material";
import React, { useState } from "react";
import styles from "./deleteCategoryWindow.module.scss";

interface deleteCategoryWindowProps {
    isCategory: boolean;
    label: string;
    onCancel: () => void;
    onConfirm: () => void;
}

export default function DeleteCategoryWindow({ isCategory, label, onCancel, onConfirm }: deleteCategoryWindowProps) {
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
