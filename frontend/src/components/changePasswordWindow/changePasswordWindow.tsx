import { useEffect, useState } from "react";
import styles from "./changePassword.module.scss";
import { Button, Card, Input } from "@mui/material";
import { useUser } from "../../context/userContext";

interface changePasswordWindowProps {
    onCancel?: () => void;
    onConfirm?: () => void;
}

export default function ChangePasswordWindow({ onCancel, onConfirm }: changePasswordWindowProps) {
    const { user, userInitials, setUser } = useUser();
    const [isExiting, setIsExiting] = useState<boolean>(false);
    const [currentPassword, setCurrentPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [canSave, setCanSave] = useState<boolean>(false);
    const [displayPasswordMatch, setDisplayPasswordMatch] = useState<boolean>(false);
    const [displayPasswordLengthWarning, setDisplayPasswordLengthWarning] = useState<boolean>(false);

    const handleClose = (callback: () => void, resetFields?: boolean) => {
        if (resetFields) {
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        }
        setIsExiting(true);
        setTimeout(() => {
            callback();
        }, 250);
    };

    useEffect(() => {
        const allFieldsFilled = newPassword.length > 0 && confirmPassword.length > 0;
        const passwordsMatch = newPassword === confirmPassword;
        setDisplayPasswordLengthWarning(newPassword && newPassword.length < 6);
        setDisplayPasswordMatch(allFieldsFilled && !passwordsMatch);
        setCanSave(currentPassword.length > 0 && allFieldsFilled && passwordsMatch && newPassword.length >= 6);
    }, [currentPassword, newPassword, confirmPassword]);

    return (
        <div className={`${styles.rootContainer} ${isExiting ? styles.exit : ""}`}>
            <Card variant="outlined" className={styles.card}>
                <div className={styles.cardBody}>
                    <form autoComplete="off">
                        <span>Current password:</span>
                        <Input
                            autoComplete="new-password"
                            className={styles.inputs}
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                        <span>New password:</span>
                        <Input
                            autoComplete="new-password"
                            className={styles.inputs}
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        {displayPasswordLengthWarning && (
                            <span className={`${styles.passwordLengthWarning} ${styles.show}`}>
                                Password must be at least 6 characters long.
                            </span>
                        )}
                        <span>Confirm new password:</span>
                        <Input
                            autoComplete="new-password"
                            className={styles.inputs}
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        {displayPasswordMatch && (
                            <span className={`${styles.passwordMatch} ${styles.show}`}>Passwords must match!</span>
                        )}
                    </form>
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
