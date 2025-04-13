import { useEffect, useState } from "react";
import styles from "./changePassword.module.scss";
import { Button, Card, Input } from "@mui/material";

interface changePasswordWindowProps {
    onCancel?: () => void;
    onConfirm?: () => void;
}

export default function ChangePasswordWindow({ onCancel, onConfirm }: changePasswordWindowProps) {
    const [isExiting, setIsExiting] = useState<boolean>(false);
    const [currentPassword, setCurrendPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [canSave, setCanSave] = useState<boolean>(false);
    const [displayPasswordMatch, setDisplayPasswordMatch] = useState<boolean>(false);

    const handleClose = (callback: () => void, resetFields?: boolean) => {
        if (resetFields) {
            setCurrendPassword("");
            setNewPassword("");
            setConfirmPassword("");
            console.log(currentPassword, newPassword, confirmPassword);
        }
        setIsExiting(true);
        setTimeout(() => {
            callback();
        }, 250);
    };

    useEffect(() => {
        const allFieldsFilled = currentPassword.length > 0 && newPassword.length > 0 && confirmPassword.length > 0;
        const passwordsMatch = newPassword === confirmPassword;
        setDisplayPasswordMatch(allFieldsFilled && !passwordsMatch);
        setCanSave(allFieldsFilled && passwordsMatch);
    }, [currentPassword, newPassword, confirmPassword]);

    return (
        <div className={`${styles.rootContainer} ${isExiting ? styles.exit : ""}`}>
            <Card variant="outlined" className={styles.card}>
                <div className={styles.cardBody}>
                    <span>Current password:</span>
                    <Input
                        className={styles.inputs}
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrendPassword(e.target.value)}
                    />
                    <span>New password:</span>
                    <Input
                        className={styles.inputs}
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <span>Confirm new password:</span>
                    <Input
                        className={styles.inputs}
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {displayPasswordMatch && (
                        <span className={`${styles.passwordMatch} ${styles.show}`}>Passwords must match!</span>
                    )}
                </div>
                <div className={styles.actions}>
                    <Button variant="outlined" onClick={() => handleClose(onCancel, true)}>
                        Cancel
                    </Button>
                    <Button
                        disabled={!canSave}
                        variant="contained"
                        color="error"
                        onClick={() => handleClose(onConfirm)}
                    >
                        Change password
                    </Button>
                </div>
            </Card>
        </div>
    );
}
