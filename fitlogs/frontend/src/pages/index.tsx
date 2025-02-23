import React from "react";
import styles from "./index.module.scss";
import AppBar from "../components/appBar/appBar";
import TextField from "@mui/material/TextField";
import Input from "@mui/material/Input";
import Button from "@mui/material/Button";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

const Home = () => {
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
                        <Input placeholder="your email address" className={styles.inputContainer}></Input>
                        <Button className={styles.startButtonContainer} variant="contained" endIcon>
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
