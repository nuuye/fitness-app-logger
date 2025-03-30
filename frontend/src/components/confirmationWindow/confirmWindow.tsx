import { Button, Card, CardActions, CardContent, Typography } from "@mui/material";
import React from "react";
import styles from "./confirmWindow.module.scss";

interface ConfirmWindowProps {
    isCategory: boolean;
    label: string;
    onCancel: () => void;
    onConfirm: () => void;
}

export default function ConfirmWindow({ isCategory, label, onCancel, onConfirm }: ConfirmWindowProps) {
    return (
        <div className={styles.rootContainer}>
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
                    <Button variant="outlined" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="error" onClick={onConfirm}>
                        Delete category
                    </Button>
                </div>
            </Card>
        </div>
    );
}
