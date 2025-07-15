import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import AppBar from "../components/appBar/appBar";
import Input from "@mui/material/Input";
import Button from "@mui/material/Button";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useRouter } from "next/router";
import { emailCheckRequest } from "../services/user";
import Image from "next/image";
import previewImage from "../../public/images/landing.png";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import LockIcon from "@mui/icons-material/Lock";

const Landing = () => {
    const router = useRouter();
    const [emailValue, setEmailValue] = useState<string>("");

    useEffect(() => {
        localStorage.removeItem("userEmail");
    }, []);

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
                        Fitlogs, your <span style={{ color: "hsl(210, 100%, 65%)" }}>personal</span> training
                        <span style={{ color: "hsl(210, 100%, 65%)" }}> companion</span>
                    </p>
                    <p className={styles.subTitle}>
                        Tracking your workouts has never been easier. Log your sets, track your progress, and stay
                        motivated on your fitness journey.
                    </p>
                    <div className={styles.startContainer}>
                        <Input
                            value={emailValue}
                            onChange={(e) => setEmailValue(e.target.value)}
                            placeholder="Your email address"
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
                <div className={styles.previewContainer}>
                    <Image className={styles.previewImage} alt="previewContent" src={previewImage}></Image>
                </div>
                <div className={styles.featuresSection}>
                    <div className={styles.featuresContainer}>
                        <h2 className={styles.featuresTitle}>
                            Why <span style={{ color: "hsl(210, 100%, 65%)" }}>Fitlogs</span>?
                        </h2>

                        <div className={styles.featuresGrid}>
                            <div className={styles.featureCard}>
                                <div className={styles.featureIcon}>
                                    <AddCircleOutlineIcon />
                                </div>
                                <h3 className={styles.featureCardTitle}>Real-time tracking</h3>
                                <p className={styles.featureCardDescription}>
                                    Record your performance instantly during your training sessions
                                </p>
                            </div>

                            <div className={styles.featureCard}>
                                <div className={styles.featureIcon}>
                                    <QueryStatsIcon />
                                </div>
                                <h3 className={styles.featureCardTitle}>Progress analysis</h3>
                                <p className={styles.featureCardDescription}>
                                    Visualize your progress with detailed graphs and advanced statistics
                                </p>
                            </div>

                            <div className={styles.featureCard}>
                                <div className={styles.featureIcon}>
                                    <LockIcon />
                                </div>
                                <h3 className={styles.featureCardTitle}>Secured data</h3>
                                <p className={styles.featureCardDescription}>
                                    Your training data is protected by secure authentication{" "}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Landing;
