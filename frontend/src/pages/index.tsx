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
import StarIcon from "@mui/icons-material/Star";
import Avatar from "@mui/material/Avatar";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Footer from "../components/footer/footer";

const testimonials = [
    {
        id: 1,
        name: "Sarah Johnson",
        role: "Fitness Enthusiast",
        avatar: "SJ",
        rating: 5,
        text: "Fitlogs has completely transformed how I track my workouts. The interface is intuitive and the progress tracking keeps me motivated every day!",
    },
    {
        id: 2,
        name: "Mike Chen",
        role: "Personal Trainer",
        avatar: "MC",
        rating: 5,
        text: "As a personal trainer, I recommend Fitlogs to all my clients. The real-time tracking feature is game-changing for monitoring form and progress.",
    },
    {
        id: 3,
        name: "Emma Rodriguez",
        role: "Marathon Runner",
        avatar: "ER",
        rating: 5,
        text: "The detailed analytics helped me identify patterns in my training. I've improved my performance significantly since using Fitlogs!",
    },
];

const Landing = () => {
    const router = useRouter();
    const [emailValue, setEmailValue] = useState<string>("");
    const currentYear = new Date().getFullYear();

    useEffect(() => {
        localStorage.removeItem("userEmail");
    }, []);

    useEffect(() => {
        if (router.asPath.includes("#")) {
            const id = router.asPath.split("#")[1];
            const element = document.getElementById(id);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: "smooth" });
                }, 100);
            }
        }
    }, [router.asPath]);

    const handleStartButton = async () => {
        localStorage.setItem("userEmail", emailValue);
        const hasAccount = await emailCheckRequest(emailValue);
        if (hasAccount) {
            router.push("/signin");
        } else {
            router.push("/signup");
        }
    };

    const handleScroll = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div className={styles.root}>
            <AppBar />
            <div className={styles.mainContainer}>
                <div className={styles.textContainer}>
                    <p className={styles.title}>
                        Fit<span style={{ color: "hsl(210, 100%, 65%)" }}>logs</span>, your{" "}
                        <span style={{ color: "hsl(210, 100%, 65%)" }}>personal</span> training
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
                            endIcon={<KeyboardArrowRightIcon className={styles.arrowIcon} fontSize="small" />}
                            onClick={() => handleStartButton()}
                        >
                            Start now
                        </Button>
                    </div>
                </div>
                <div className={styles.previewContainer}>
                    <div className={styles.innerContainer}>
                        <Image priority className={styles.previewImage} alt="previewContent" src={previewImage}></Image>
                    </div>
                </div>
                <div className={styles.featuresSection} id="featuresSection">
                    <div className={styles.featuresContainer}>
                        <h2 className={styles.featuresTitle}>
                            Why Fit<span style={{ color: "hsl(210, 100%, 65%)" }}>logs</span>?
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
                <div className={styles.testimonialsSection} id="testimonialsSection">
                    <div className={styles.testimonialsContainer}>
                        <h2 className={styles.testimonialsTitle}>
                            <span className={styles.communityTitle}>
                                Community love <FavoriteIcon fontSize="large" />
                            </span>
                        </h2>
                        <div className={styles.testimonialsGrid}>
                            {testimonials.map((testimonial) => (
                                <div key={testimonial.id} className={styles.testimonialCard}>
                                    <div className={styles.testimonialHeader}>
                                        <Avatar className={styles.testimonialAvatar}>{testimonial.avatar}</Avatar>
                                        <div className={styles.testimonialUserInfo}>
                                            <h4 className={styles.testimonialName}>{testimonial.name}</h4>
                                            <p className={styles.testimonialRole}>{testimonial.role}</p>
                                        </div>
                                    </div>
                                    <div className={styles.testimonialRating}>
                                        {[...Array(testimonial.rating)].map((_, index) => (
                                            <StarIcon key={index} className={styles.starIcon} />
                                        ))}
                                    </div>
                                    <p className={styles.testimonialText}>"{testimonial.text}"</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default Landing;
