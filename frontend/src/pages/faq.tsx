import styles from "./faq.module.scss";
import FAQItem from "../components/faqItem/faqItem";
import AppBar from "../components/appBar/appBar";
import Footer from "../components/footer/footer";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function FAQ() {
    const router = useRouter();
    const { section } = router.query;

    useEffect(() => {
        if (section) {
            // waiting everything is mounted
            setTimeout(() => {
                document.getElementById(section as string)?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 200);
        }
    }, [section]);

    return (
        <div className={styles.root}>
            <AppBar />
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>Frequently Asked Questions</h1>
                    <p>
                        Everything you need to know about Fitlogs. Can't find the answer you're looking for? Feel free
                        to reach out to our team.
                    </p>
                </div>

                <div className={styles.faqList}>
                    <FAQItem title="About Fitlogs" id="about" forceOpen={section === "about"}>
                        <p>
                            <strong>Fitlogs</strong> is a comprehensive fitness tracking application designed to help
                            you monitor and analyze your workout performance over time.
                        </p>
                        <p>
                            Built with modern web technologies including React with TypeScript for a robust front-end
                            experience, Node.js with Express for reliable backend services, and MongoDB for flexible
                            data storage. The application is containerized with Docker and deployed on AWS
                            infrastructure, ensuring scalability and performance. The user interface combines SCSS for
                            custom styling with Material-UI components for a polished, responsive design.
                        </p>

                        <h4>Key Features:</h4>
                        <ul>
                            <li>Create unlimited custom categories and sub-categories for your workouts</li>
                            <li>Comprehensive analytics dashboard to visualize your progress</li>
                            <li>Long-term performance tracking with detailed insights</li>
                            <li>Secure cloud storage to keep your data safe across devices</li>
                            <li>Multi-device synchronization for seamless access anywhere</li>
                        </ul>

                        <p>
                            Whether you're a beginner starting your fitness journey or an experienced athlete looking to
                            optimize performance, Fitlogs provides the tools you need to succeed.
                        </p>
                    </FAQItem>

                    <FAQItem title="Help Center" id="help" forceOpen={section === "help"}>
                        <p>Need assistance with Fitlogs? We're here to help! Here are the best ways to get support:</p>

                        <h4>Email Support</h4>
                        <p>
                            Send us an email at <a href="mailto:support@fitlogs.com">support@fitlogs.com</a> for
                            detailed questions or technical issues. We typically respond within 24 hours.
                        </p>
                    </FAQItem>

                    <FAQItem title="Report an Issue" id="bug" forceOpen={section === "bug"}>
                        <h4>🐛 Bug Reports</h4>
                        <p>
                            Found a bug? Please report it to <a href="mailto:bugs@fitlogs.com">bugs@fitlogs.com</a> with
                            if possible:
                        </p>
                        <ul>
                            <li>Description of the issue</li>
                            <li>Steps to reproduce the problem</li>
                            <li>Screenshots or screen recordings if applicable</li>
                            <li>Your browser and device information</li>
                        </ul>
                    </FAQItem>

                    <FAQItem title="Privacy Policy" id="privacy" forceOpen={section === "privacy"}>
                        <p>
                            At Fitlogs, we take your privacy seriously. This policy outlines how we collect, use, and
                            protect your personal information.
                        </p>

                        <h4>Data Collection</h4>
                        <p>We collect only the information necessary to provide and improve our services:</p>
                        <ul>
                            <li>
                                <strong>Account Information:</strong> Email, name, and profile data
                            </li>
                            <li>
                                <strong>Workout Data:</strong> Exercise logs, performance metrics, and analytics
                            </li>
                            <li>
                                <strong>Usage Data:</strong> How you interact with our application for improvement
                                purposes
                            </li>
                            <li>
                                <strong>Technical Data:</strong> Device information, IP address, and browser details
                            </li>
                        </ul>

                        <h4>Data Protection</h4>
                        <p>Your data is protected using industry-standard security measures:</p>
                        <ul>
                            <li>End-to-end encryption for sensitive information</li>
                            <li>Secure SSL connections for all data transmission</li>
                            <li>Regular security audits and updates</li>
                            <li>Limited access to authorized personnel only</li>
                        </ul>

                        <h4>What We DON'T Do</h4>
                        <ul>
                            <li>We never sell your personal data to third parties</li>
                            <li>We don't share your workout data without explicit consent</li>
                            <li>We don't track your activity outside of Fitlogs</li>
                            <li>We don't store payment information on our servers</li>
                        </ul>

                        <p>
                            For the complete privacy policy, please visit{" "}
                            <a href="/privacy-policy">our detailed privacy page</a>.
                        </p>
                    </FAQItem>

                    <FAQItem title="Cookies" id="cookies" forceOpen={section === "cookies"}>
                        <p>Fitlogs uses cookies to provide you with a secure and seamless experience.</p>

                        <h4>🍪 How We Use Cookies</h4>
                        <ul>
                            <li>Authentication cookies: Used to keep you logged in and secure your session</li>
                            <li>
                                Session management: Automatically generated when you log in with a 24-hour expiration
                            </li>
                            <li>No tracking: We don't use cookies for advertising or tracking purposes</li>
                        </ul>

                        <p>
                            We only use necessary cookies required for the application to work - no third-party tracking
                            or analytics cookies are used.
                        </p>
                    </FAQItem>

                    <FAQItem title="Terms of Service" id="terms" forceOpen={section === "terms"}>
                        <p>By using Fitlogs, you agree to these terms and conditions. Please read them carefully.</p>

                        <h4>Acceptable Use</h4>
                        <p>You agree to use Fitlogs for lawful purposes only. You may:</p>
                        <ul>
                            <li>Track your personal fitness activities and progress</li>
                            <li>Share your achievements with friends (if you choose)</li>
                            <li>Export your own data for personal use</li>
                            <li>Provide feedback to help us improve the service</li>
                        </ul>

                        <h4>Prohibited Activities</h4>
                        <p>The following activities are strictly prohibited:</p>
                        <ul>
                            <li>Attempting to hack, reverse engineer, or compromise our systems</li>
                            <li>Sharing false or misleading information</li>
                            <li>Violating any applicable laws or regulations</li>
                        </ul>

                        <h4>Service Availability</h4>
                        <p>
                            While we strive for 99.9% uptime, we cannot guarantee uninterrupted service. We reserve the
                            right to:
                        </p>
                        <ul>
                            <li>Perform maintenance and updates</li>
                            <li>Suspend service for security reasons</li>
                            <li>Modify features with reasonable notice</li>
                        </ul>

                        <h4>Limitation of Liability</h4>
                        <p>
                            Fitlogs is provided "as is" without warranties. We are not liable for indirect damages or
                            loss of data, though we take every precaution to protect your information.
                        </p>
                    </FAQItem>

                    <FAQItem title="Security" id="security" forceOpen={section === "security"}>
                        <p>
                            Security is a priority in Fitlogs development. Your data is protected through multiple
                            layers of security measures implemented throughout the application.
                        </p>

                        <h4>Data Encryption</h4>
                        <ul>
                            <li>All passwords are securely hashed using industry-standard bcrypt encryption</li>
                            <li>
                                Data transmission between your device and servers is protected with HTTPS encryption
                            </li>
                            <li>User authentication is required to access your personal dashboard and data</li>
                        </ul>

                        <h4>Access Control</h4>
                        <ul>
                            <li>Protected API routes ensure only authenticated users can access their own data</li>
                            <li>Request rate limiting prevents abuse and protects server resources</li>
                            <li>Each user can only access and modify their own workout data</li>
                        </ul>

                        <h4>Account Security</h4>
                        <p>Protect your account with these recommended practices:</p>
                        <ul>
                            <li>Use a strong, unique password for your Fitlogs account</li>
                            <li>Log out from shared or public devices</li>
                            <li>Contact support if you notice any unusual account activity</li>
                        </ul>

                        <p>
                            Your fitness data privacy and security are taken seriously, with ongoing attention to
                            security best practices as the application evolves.
                        </p>

                        <p>
                            Questions about security? Contact our security team at{" "}
                            <a href="mailto:security@fitlogs.com">security@fitlogs.com</a>.
                        </p>
                    </FAQItem>
                </div>
            </div>
            <Footer />
        </div>
    );
}
