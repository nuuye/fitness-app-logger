import styles from "./appBar.module.scss";
import Button from "@mui/material/Button";
import logo from "../../../public/images/dumbbell_icon.png";
import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect } from "react";

export default function AppBar() {
    const router = useRouter();

    useEffect(() => {
        router.prefetch("/#featureSection");
        router.prefetch("/#testimonialSection");
        router.prefetch("/faq?section=about");
    }, [router]);

    const scrollToElement = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
            return true;
        }
        return false;
    };

    const handleScroll = (id: string) => {
        if (router.pathname === "/" && scrollToElement(id)) return;
        router.push(`/#${id}`);
    };

    const handleAboutScroll = (id: string) => {
        if (router.pathname === "/faq" && scrollToElement(id)) return;
        router.push(`/faq?section=${id}`);
    };

    return (
        <div className={styles.mainContainer}>
            <div className={styles.leftNavContainer}>
                <div className={styles.logoContainer}>
                    <Link href="/" prefetch>
                        <Image alt="logo" src={logo} />
                    </Link>
                </div>
                <div className={styles.sectionContainer}>
                    <Button
                        className={styles.sectionButtonContainer}
                        variant="text"
                        onClick={() => handleScroll("featureSection")}
                    >
                        Features
                    </Button>
                    <Button
                        className={styles.sectionButtonContainer}
                        variant="text"
                        onClick={() => handleScroll("testimonialSection")}
                    >
                        Testimonials
                    </Button>
                    <Button
                        className={styles.sectionButtonContainer}
                        variant="text"
                        onClick={() => handleAboutScroll("about")}
                    >
                        About
                    </Button>

                    <Link href="/blog" prefetch className={styles.link}>
                        <Button className={styles.sectionButtonContainer} variant="text">
                            Blog
                        </Button>
                    </Link>
                    <Link href="/faq" prefetch className={styles.link}>
                        <Button className={styles.sectionButtonContainer} variant="text">
                            FAQ
                        </Button>
                    </Link>
                </div>
            </div>
            <div className={styles.rightNavContainer}>
                <Link href="/signin" prefetch className={styles.link}>
                    <Button className={styles.signInContainer} variant="text">
                        Sign in
                    </Button>
                </Link>
                <Link href="/signup" prefetch className={styles.link}>
                    <Button className={styles.signUpContainer} variant="contained">
                        Sign up
                    </Button>
                </Link>
            </div>
        </div>
    );
}
