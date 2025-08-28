import Card from "@mui/material/Card";
import styles from "./signUp.module.scss";
import { Box, Button, CircularProgress, FormControl, FormLabel, Link, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { GoogleIcon } from "../customIcons/customIcons";
import { signupRequest } from "../../services/user";
import { useRouter } from "next/router";
import { useUser } from "../../context/userContext";
import { getSession, signIn } from "next-auth/react";

export default function SignUp() {
    const router = useRouter();
    const [googleLoading, setGoogleLoading] = useState(false);
    const [loadingSignUp, setLoadingSignUp] = useState(false);
    const { setUser } = useUser();
    const [emailValue, setEmailValue] = useState<string>("");
    const [emailError, setEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState("");
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
    const [nameError, setNameError] = useState(false);
    const [nameErrorMessage, setNameErrorMessage] = useState("");

    useEffect(() => {
        const userEmail = localStorage.getItem("userEmail");
        if (userEmail) {
            setEmailValue(userEmail);
        }
    }, []);

    const handleGoogleSignIn = async () => {
        setGoogleLoading(true);
        console.log("Tentative de connexion Google...");

        try {
            const result = await signIn("google", {
                redirect: false,
                callbackUrl: "/dashboard",
            });

            console.log("Résultat signIn:", result);

            if (result?.error) {
                console.error("Erreur de connexion:", result.error);
            } else {
                // 🔹 Recharger la session
                const session = await getSession();
                console.log("session added props: ", session?.user?.userId, session?.user?.token);

                setUser({
                    userId: session?.user?.userId,
                    name: session?.user?.name,
                    email: session?.user?.email,
                });

                localStorage.setItem("userId", session?.user?.userId || "");
                localStorage.setItem("token", session?.user?.token || "");
            }
        } catch (error) {
            console.error("Erreur lors de la connexion:", error);
        } finally {
            setGoogleLoading(false);
        }
    };

    const validateInputs = (): void => {
        const email = document.getElementById("email") as HTMLInputElement;
        const password = document.getElementById("password") as HTMLInputElement;
        const name = document.getElementById("name") as HTMLInputElement;

        if (!email.value) {
            setEmailError(true);
            setEmailErrorMessage("Please enter a valid email address.");
        } else {
            setEmailError(false);
            setEmailErrorMessage("");
        }

        if (!password.value || password.value.length < 6) {
            setPasswordError(true);
            setPasswordErrorMessage("Password must be at least 6 characters long.");
        } else {
            setPasswordError(false);
            setPasswordErrorMessage("");
        }

        if (!name.value || name.value.length < 1) {
            setNameError(true);
            setNameErrorMessage("Name is required.");
        } else {
            setNameError(false);
            setNameErrorMessage("");
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (nameError || emailError || passwordError) return;

        setLoadingSignUp(true);

        try {
            const rawData = new FormData(event.currentTarget);

            const formData = {
                name: rawData.get("name") as string,
                email: rawData.get("email") as string,
                password: rawData.get("password") as string,
            };

            const newUser = await signupRequest(formData);

            if (newUser) {
                setUser({ userId: newUser.userId, name: newUser.name, email: newUser.email });
                localStorage.setItem("userId", newUser.userId);
                localStorage.setItem("token", newUser.token);
                router.push("/dashboard");
            }
        } catch (error) {
            console.error("Erreur lors de la connexion:", error);
        } finally {
            setLoadingSignUp(false);
        }
    };

    return (
        <div className={styles.root}>
            <Card className={styles.cardContainer} variant="outlined">
                <div className={styles.header}>
                    <h1>Sign up</h1>
                </div>
                <div className={styles.body}>
                    <Box
                        className={styles.form}
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
                                            borderColor: "hsla(210, 98%, 42%, 0.5)",
                                            borderRadius: "8px",
                                        },
                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "hsla(210, 98%, 42%, 0.5)",
                                            borderRadius: "8px",
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
                                            borderColor: "hsla(210, 98%, 42%, 0.5)",
                                            borderRadius: "8px",
                                        },
                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "hsla(210, 98%, 42%, 0.5)",
                                            borderRadius: "8px",
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
                                            borderColor: "hsla(210, 98%, 42%, 0.5)",
                                            borderRadius: "8px",
                                        },
                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "hsla(210, 98%, 42%, 0.5)",
                                            borderRadius: "8px",
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
                            className={styles.signUpButton}
                            type="submit"
                            fullWidth
                            variant="contained"
                            onClick={validateInputs}
                            disabled={loadingSignUp}
                        >
                            {loadingSignUp ? <CircularProgress size={22} color="inherit" thickness={4} /> : "Sign up"}
                        </Button>
                    </Box>
                    <Button
                        className={styles.googleButton}
                        fullWidth
                        variant="outlined"
                        onClick={handleGoogleSignIn}
                        startIcon={<GoogleIcon />}
                        disabled={googleLoading}
                    >
                        {googleLoading ? "Redirecting..." : "Sign in with Google"}
                    </Button>
                </div>
                <div className={styles.footer}>
                    <span className={styles.footerText}>
                        Already have an account?{" "}
                        <Link className={styles.signUpLink} variant="body2" href="/signin">
                            Sign in
                        </Link>
                    </span>
                </div>
            </Card>
        </div>
    );
}
