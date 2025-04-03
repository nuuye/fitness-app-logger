import styles from "./appBar.module.scss";
import Button from "@mui/material/Button";
import logo from "../../../public/images/dumbbell_icon.png";
import Image from "next/image";
import { useRouter } from "next/router";

export default function AppBar() {
    const router = useRouter();

    return (
        <div className={styles.mainContainer}>
            <div className={styles.leftNavContainer}>
                <div className={styles.logoContainer}>
                    <Image alt="logo" src={logo}></Image>
                </div>
                <div className={styles.sectionContainer}>
                    <Button className={styles.sectionButtonContainer} variant="text">
                        Features
                    </Button>
                    <Button className={styles.sectionButtonContainer} variant="text">
                        Testimonials
                    </Button>
                    <Button className={styles.sectionButtonContainer} variant="text">
                        About
                    </Button>
                    <Button className={styles.sectionButtonContainer} variant="text">
                        Blog
                    </Button>
                </div>
            </div>
            <div className={styles.rightNavContainer}>
                <Button className={styles.signInContainer} variant="text" onClick={() => router.push("/signin")}>
                    Sign in
                </Button>
                <Button className={styles.signUpContainer} variant="contained" onClick={() => router.push("/signup")}>
                    Sign up
                </Button>
            </div>
        </div>
    );
}
