import React from "react";
import styles from "./index.module.scss";
import Card from "@mui/material/Card";
import AppBar from "../components/appBar/appBar";

const Home = () => {
    return (
        <div className={styles.mainContainer}>
            <AppBar />
        </div>
    );
};

export default Home;
