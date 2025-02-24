import Card from "@mui/material/Card";
import styles from "./signUp.module.scss";
import { Box, Button, FormControl, FormLabel, TextField } from "@mui/material";
import { useState } from "react";

export default function SignUp() {
    const [emailError, setEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState("");
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
    const [nameError, setNameError] = useState(false);
    const [nameErrorMessage, setNameErrorMessage] = useState("");

    let isValid: boolean = true;

    const validateInputs = (): boolean => {
        const email = document.getElementById("email") as HTMLInputElement;
        const password = document.getElementById("password") as HTMLInputElement;
        const name = document.getElementById("name") as HTMLInputElement;

        if (!email.value) {
            setEmailError(true);
            setEmailErrorMessage("Please enter a valid email address.");
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage("");
        }

        if (!password.value || password.value.length < 6) {
            setPasswordError(true);
            setPasswordErrorMessage("Password must be at least 6 characters long.");
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage("");
        }

        if (!name.value || name.value.length < 1) {
            setNameError(true);
            setNameErrorMessage("Name is required.");
            isValid = false;
        } else {
            setNameError(false);
            setNameErrorMessage("");
        }

        return isValid;
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        if (nameError || emailError || passwordError) {
            event.preventDefault();
            return;
        }
        const data = new FormData(event.currentTarget);
        console.log({
            name: data.get("name"),
            lastName: data.get("lastName"),
            email: data.get("email"),
            password: data.get("password"),
        });
    };

    return (
        <div className={styles.root}>
            <Card className={styles.cardContainer} variant="outlined">
                <div className={styles.header}>
                    <h1>Sign up</h1>
                </div>
                <div className={styles.body}>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                        noValidate
                    >
                        <FormControl>
                            <FormLabel className={styles.formLabel} htmlFor="name">
                                Full name
                            </FormLabel>
                            <TextField
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        "&:hover .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "rgb(11, 114, 84)",
                                        },
                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "rgb(11, 114, 84)",
                                        },
                                    },
                                }}
                                className={styles.textField}
                                autoComplete="name"
                                name="name"
                                required
                                fullWidth
                                id="name"
                                placeholder="John Doe"
                                error={nameError}
                                helperText={nameErrorMessage}
                                color={nameError ? "error" : "primary"}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel className={styles.formLabel} htmlFor="email">
                                Email
                            </FormLabel>
                            <TextField
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        "&:hover .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "rgb(11, 114, 84)",
                                        },
                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "rgb(11, 114, 84)",
                                        },
                                    },
                                }}
                                className={styles.textField}
                                required
                                fullWidth
                                id="email"
                                placeholder="your@email.com"
                                name="email"
                                autoComplete="email"
                                variant="outlined"
                                error={emailError}
                                helperText={emailErrorMessage}
                                color={passwordError ? "error" : "primary"}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel className={styles.formLabel} htmlFor="password">
                                Password
                            </FormLabel>
                            <TextField
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        "&:hover .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "rgb(11, 114, 84)",
                                        },
                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "rgb(11, 114, 84)",
                                        },
                                    },
                                }}
                                className={styles.textField}
                                required
                                fullWidth
                                name="password"
                                placeholder="••••••"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                                variant="outlined"
                                error={passwordError}
                                helperText={passwordErrorMessage}
                                color={passwordError ? "error" : "primary"}
                            />
                        </FormControl>
                        <Button
                            className={styles.button}
                            type="submit"
                            fullWidth
                            variant="contained"
                            onClick={validateInputs}
                        >
                            Sign up
                        </Button>
                    </Box>
                </div>
                <div className={styles.footer}></div>
            </Card>
        </div>
    );
}
