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
import { Facebook, X, Instagram, LinkedIn, Mail, Phone } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import FmdGoodIcon from "@mui/icons-material/FmdGood";

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
                <div className={styles.testimonialsSection}>
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
                <div className={styles.footer}>
                    <div className={styles.footerContainer}>
                        {/* Main Footer Content */}
                        <div className={styles.footerContent}>
                            {/* Brand Section */}
                            <div className={styles.brandSection}>
                                <h3 className={styles.brandName}>
                                    Fit<span style={{ color: "hsl(210, 100%, 65%)" }}>logs</span>
                                </h3>
                                <p className={styles.brandDescription}>
                                    Your personal training companion for tracking workouts, monitoring progress, and
                                    achieving your fitness goals.
                                </p>
                                <div className={styles.socialLinks}>
                                    <IconButton className={styles.socialIcon} aria-label="Facebook">
                                        <Facebook />
                                    </IconButton>
                                    <IconButton className={styles.socialIcon} aria-label="Twitter">
                                        <X />
                                    </IconButton>
                                    <IconButton className={styles.socialIcon} aria-label="Instagram">
                                        <Instagram />
                                    </IconButton>
                                    <IconButton className={styles.socialIcon} aria-label="LinkedIn">
                                        <LinkedIn />
                                    </IconButton>
                                </div>
                            </div>

                            {/* Quick Links */}
                            <div className={styles.linksSection}>
                                <h4 className={styles.sectionTitle}>Quick Links</h4>
                                <ul className={styles.linksList}>
                                    <li>
                                        <a href="/features" className={styles.footerLink}>
                                            Features
                                        </a>
                                    </li>
                                    <li>
                                        <a href="/pricing" className={styles.footerLink}>
                                            Pricing
                                        </a>
                                    </li>
                                    <li>
                                        <a href="/about" className={styles.footerLink}>
                                            About Us
                                        </a>
                                    </li>
                                    <li>
                                        <a href="/blog" className={styles.footerLink}>
                                            Blog
                                        </a>
                                    </li>
                                    <li>
                                        <a href="/help" className={styles.footerLink}>
                                            Help Center
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            {/* Support */}
                            <div className={styles.linksSection}>
                                <h4 className={styles.sectionTitle}>Support</h4>
                                <ul className={styles.linksList}>
                                    <li>
                                        <a href="/contact" className={styles.footerLink}>
                                            Contact Us
                                        </a>
                                    </li>
                                    <li>
                                        <a href="/faq" className={styles.footerLink}>
                                            FAQ
                                        </a>
                                    </li>
                                    <li>
                                        <a href="/privacy" className={styles.footerLink}>
                                            Privacy Policy
                                        </a>
                                    </li>
                                    <li>
                                        <a href="/terms" className={styles.footerLink}>
                                            Terms of Service
                                        </a>
                                    </li>
                                    <li>
                                        <a href="/security" className={styles.footerLink}>
                                            Security
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            {/* Contact Info */}
                            <div className={styles.contactSection}>
                                <h4 className={styles.sectionTitle}>Get in Touch</h4>
                                <div className={styles.contactInfo}>
                                    <div className={styles.contactItem}>
                                        <Mail className={styles.contactIcon} />
                                        <span>support@fitlogs.com</span>
                                    </div>
                                    <div className={styles.contactItem}>
                                        <Phone className={styles.contactIcon} />
                                        <span>+33 (0) 7 43 50 96 00</span>
                                    </div>
                                    <div className={styles.contactItem}>
                                        <FmdGoodIcon className={styles.contactIcon} />
                                        <span>Paris, FR</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Bottom */}
                        <div className={styles.footerBottom}>
                            <div className={styles.footerBottomContent}>
                                <p className={styles.copyright}>© {currentYear} Fitlogs. All rights reserved.</p>
                                <div className={styles.footerBottomLinks}>
                                    <a href="/privacy" className={styles.bottomLink}>
                                        Privacy
                                    </a>
                                    <a href="/terms" className={styles.bottomLink}>
                                        Terms
                                    </a>
                                    <a href="/cookies" className={styles.bottomLink}>
                                        Cookies
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Landing;
