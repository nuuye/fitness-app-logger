import React, { useState } from "react";
import styles from "./index.module.scss";
import AppBar from "../components/appBar/appBar";
import Input from "@mui/material/Input";
import Button from "@mui/material/Button";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useRouter } from "next/router";
import { emailCheckRequest } from "../services/user";

const Home = () => {
    const router = useRouter();
    const [emailValue, setEmailValue] = useState<string>("");

    const handleStartButton = async () => {
        localStorage.setItem("userEmail", emailValue);
        const hasAccount = await emailCheckRequest(emailValue);
        if (hasAccount) {
            router.push("/signin");
        } else {
            router.push("/signup");
        }
    };
    return (
        <div className={styles.root}>
            <AppBar />
            <div className={styles.mainContainer}>
                <div className={styles.textContainer}>
                    <p className={styles.title}>
                        Fitlogs, your <span style={{ color: "#072c24" }}>personal</span> training
                        <span style={{ color: "#072c24" }}> companion</span>
                    </p>
                    <p className={styles.subTitle}>
                        Tracking your workouts has never been easier. Log your sets, track your progress, and stay
                        motivated on your fitness journey.
                    </p>
                    <div className={styles.startContainer}>
                        <Input
                            value={emailValue}
                            onChange={(e) => setEmailValue(e.target.value)}
                            placeholder="your email address"
                            className={styles.inputContainer}
                        ></Input>
                        <Button
                            className={styles.startButtonContainer}
                            variant="contained"
                            endIcon
                            onClick={() => handleStartButton()}
                        >
                            Start now
                            <KeyboardArrowRightIcon className={styles.arrowIcon} fontSize="small" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
