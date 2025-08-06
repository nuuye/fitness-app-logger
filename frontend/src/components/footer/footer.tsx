import { Facebook, X, Instagram, LinkedIn, Mail, Phone } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import styles from "./footer.module.scss";
import { useRouter } from "next/router";
import FmdGoodIcon from "@mui/icons-material/FmdGood";
import GitHubIcon from "@mui/icons-material/GitHub";

export default function footer() {
    const router = useRouter();
    const currentYear = new Date().getFullYear();

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
                            Your personal training companion for tracking workouts, monitoring progress, and achieving
                            your fitness goals.
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
                            <IconButton
                                className={styles.socialIcon}
                                aria-label="LinkedIn"
                                component="a"
                                href="https://www.linkedin.com/in/thomas-mostowfi-5425b32a0"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <LinkedIn />
                            </IconButton>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className={styles.linksSection1}>
                        <h4 className={styles.sectionTitle}>Quick Links</h4>
                        <ul className={styles.linksList}>
                            <li>
                                <a onClick={() => handleScroll("featuresSection")} className={styles.footerLink}>
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
                                    About Fitlogs
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
                    <div className={styles.linksSection2}>
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
                                <GitHubIcon className={styles.contactIcon} />
                                <span>
                                    <a
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        href="https://github.com/nuuye/fitness-app-logger"
                                    >
                                        fitness-app-logger
                                    </a>
                                </span>
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
    );
}
