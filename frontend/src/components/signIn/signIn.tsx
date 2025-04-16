import Card from "@mui/material/Card";
import styles from "./signIn.module.scss";
import { Box, Button, Checkbox, FormControl, FormControlLabel, FormLabel, Link, TextField } from "@mui/material";
import { useState } from "react";
import { GoogleIcon } from "../customIcons/customIcons";
import { loginRequest } from "../../services/user";
import { useRouter } from "next/router";
import { useUser } from "../../context/userContext";

export default function SignIn() {
    const router = useRouter();
    const { setUser } = useUser();
    const [emailValue, setEmailValue] = useState<string>(localStorage.getItem("userEmail") || "");
    const [emailError, setEmailError] = useState<boolean>(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState<string>("");
    const [passwordError, setPasswordError] = useState<boolean>(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState<string>("");

    const validateInputs = (): void => {
        const email = document.getElementById("email") as HTMLInputElement;
        const password = document.getElementById("password") as HTMLInputElement;

        if (!email.value) {
            setEmailError(true);
            setEmailErrorMessage("You must enter an email.");
        } else {
            setEmailError(false);
            setEmailErrorMessage("");
        }

        if (!password.value || password.value.length < 6) {
            setPasswordError(true);
            setPasswordErrorMessage("You must enter a password.");
        } else {
            setPasswordError(false);
            setPasswordErrorMessage("");
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (emailError || passwordError) {
            event.preventDefault();
            return;
        }
        const rawdata = new FormData(event.currentTarget);
        const formData = {
            email: rawdata.get("email") as string,
            password: rawdata.get("password") as string,
        };
        const userData = await loginRequest(formData);
        if (userData) {
            setUser({userId: userData.userId, name: userData.name, email: userData.email})
            localStorage.setItem("userId", userData.userId);
            localStorage.setItem("token", userData.token);
            router.push("/dashboard");
        }
    };

    return (
        <div className={styles.root}>
            <Card className={styles.cardContainer} variant="outlined">
                <div className={styles.header}>
                    <h1>Sign in</h1>
                </div>
                <div className={styles.body}>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                        noValidate
                    >
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
                                value={emailValue}
                                onChange={(e) => setEmailValue(e.target.value)}
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
                        <div className={styles.middleSectionContainer}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        value="remember"
                                        color="primary"
                                        sx={{
                                            color: "rgb(11, 114, 84)",
                                            "&.Mui-checked": {
                                                color: "rgb(11, 114, 84)",
                                            },
                                        }}
                                    />
                                }
                                label="Remember me"
                                sx={{
                                    color: "white",
                                    "& .MuiFormControlLabel-label": {
                                        fontSize: "0.875rem",
                                    },
                                }}
                            />

                            <Link className={styles.forgotPasswordText}>Forgot your password?</Link>
                        </div>
                        <Button
                            className={styles.signUpButton}
                            type="submit"
                            fullWidth
                            variant="contained"
                            onClick={validateInputs}
                        >
                            Sign in
                        </Button>
                    </Box>
                    <Button
                        className={styles.googleButton}
                        fullWidth
                        variant="outlined"
                        onClick={() => alert("Sign in with Google")}
                        startIcon={<GoogleIcon />}
                    >
                        Sign in with Google
                    </Button>
                </div>
                <div className={styles.footer}>
                    <span className={styles.footerText}>
                        Don't have an account?{" "}
                        <Link href="/signup" className={styles.signUpLink} variant="body2">
                            Sign up
                        </Link>
                    </span>
                </div>
            </Card>
        </div>
    );
}
