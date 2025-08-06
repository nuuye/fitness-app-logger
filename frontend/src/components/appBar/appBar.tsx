import styles from "./appBar.module.scss";
import Button from "@mui/material/Button";
import logo from "../../../public/images/dumbbell_icon.png";
import Image from "next/image";
import { useRouter } from "next/router";

export default function AppBar() {
    const router = useRouter();

    const handleScroll = (id: string) => {
        if (router.pathname === "/") {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
        } else {
            router.push(`/#${id}`);
        }
    };

    return (
        <div className={styles.mainContainer}>
            <div className={styles.leftNavContainer}>
                <div className={styles.logoContainer} onClick={() => router.push("/")}>
                    <Image alt="logo" src={logo}></Image>
                </div>
                <div className={styles.sectionContainer}>
                    <Button
                        className={styles.sectionButtonContainer}
                        variant="text"
                        onClick={() => handleScroll("featuresSection")}
                    >
                        Features
                    </Button>
                    <Button
                        className={styles.sectionButtonContainer}
                        variant="text"
                        onClick={() => handleScroll("testimonialsSection")}
                    >
                        Testimonials
                    </Button>
                    <Button className={styles.sectionButtonContainer} variant="text">
                        About
                    </Button>
                    <Button
                        className={styles.sectionButtonContainer}
                        variant="text"
                        onClick={() => router.push("/blog")}
                    >
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
