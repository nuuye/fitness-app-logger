import styles from "./faq.module.scss";
import FAQItem from "../components/faqItem/faqItem";
import AppBar from "../components/appBar/appBar";

export default function FAQ() {
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
                    <FAQItem title="About Fitlogs">
                        <p>
                            <strong>Fitlogs</strong> is a comprehensive fitness tracking application designed to help
                            you monitor and analyze your workout performance over time.
                        </p>
                        <p>
                            Our mission is to provide athletes, fitness enthusiasts, and anyone interested in improving
                            their physical health with powerful tools to track their progress, identify trends, and
                            optimize their training.
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

                    <FAQItem title="Help Center / How to get help">
                        <p>Need assistance with Fitlogs? We're here to help! Here are the best ways to get support:</p>

                        <h4>📧 Email Support</h4>
                        <p>
                            Send us an email at <a href="mailto:support@fitlogs.com">support@fitlogs.com</a> for
                            detailed questions or technical issues. We typically respond within 24 hours.
                        </p>

                        <h4>💬 Live Chat</h4>
                        <p>
                            Use the chat widget in the bottom-right corner of the application for quick questions and
                            real-time assistance during business hours (9 AM - 6 PM EST).
                        </p>

                        <h4>📚 Documentation</h4>
                        <p>
                            Check out our comprehensive <a href="/docs">documentation</a> for step-by-step guides,
                            tutorials, and best practices.
                        </p>

                        <h4>🐛 Bug Reports</h4>
                        <p>
                            Found a bug? Please report it to <a href="mailto:bugs@fitlogs.com">bugs@fitlogs.com</a>{" "}
                            with:
                        </p>
                        <ul>
                            <li>Detailed description of the issue</li>
                            <li>Steps to reproduce the problem</li>
                            <li>Screenshots or screen recordings if applicable</li>
                            <li>Your browser and device information</li>
                        </ul>
                    </FAQItem>

                    <FAQItem title="Privacy Policy">
                        <p>
                            At Fitlogs, we take your privacy seriously. This policy outlines how we collect, use, and
                            protect your personal information.
                        </p>

                        <h4>📊 Data Collection</h4>
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

                        <h4>🔒 Data Protection</h4>
                        <p>Your data is protected using industry-standard security measures:</p>
                        <ul>
                            <li>End-to-end encryption for sensitive information</li>
                            <li>Secure SSL connections for all data transmission</li>
                            <li>Regular security audits and updates</li>
                            <li>Limited access to authorized personnel only</li>
                        </ul>

                        <h4>🚫 What We DON'T Do</h4>
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

                    <FAQItem title="Terms of Service">
                        <p>By using Fitlogs, you agree to these terms and conditions. Please read them carefully.</p>

                        <h4>✅ Acceptable Use</h4>
                        <p>You agree to use Fitlogs for lawful purposes only. You may:</p>
                        <ul>
                            <li>Track your personal fitness activities and progress</li>
                            <li>Share your achievements with friends (if you choose)</li>
                            <li>Export your own data for personal use</li>
                            <li>Provide feedback to help us improve the service</li>
                        </ul>

                        <h4>🚫 Prohibited Activities</h4>
                        <p>The following activities are strictly prohibited:</p>
                        <ul>
                            <li>Attempting to hack, reverse engineer, or compromise our systems</li>
                            <li>Sharing false or misleading information</li>
                            <li>Using the service to spam or harass other users</li>
                            <li>Violating any applicable laws or regulations</li>
                        </ul>

                        <h4>📱 Service Availability</h4>
                        <p>
                            While we strive for 99.9% uptime, we cannot guarantee uninterrupted service. We reserve the
                            right to:
                        </p>
                        <ul>
                            <li>Perform maintenance and updates</li>
                            <li>Suspend service for security reasons</li>
                            <li>Modify features with reasonable notice</li>
                        </ul>

                        <h4>⚖️ Limitation of Liability</h4>
                        <p>
                            Fitlogs is provided "as is" without warranties. We are not liable for indirect damages or
                            loss of data, though we take every precaution to protect your information.
                        </p>

                        <p>
                            View the complete <a href="/terms">Terms of Service document</a> for full legal details.
                        </p>
                    </FAQItem>

                    <FAQItem title="Security">
                        <p>
                            Security is at the core of everything we do at Fitlogs. Here's how we protect your data and
                            ensure a secure experience.
                        </p>

                        <h4>🔐 Data Encryption</h4>
                        <ul>
                            <li>
                                <strong>In Transit:</strong> All data transmitted between your device and our servers is
                                encrypted using TLS 1.3
                            </li>
                            <li>
                                <strong>At Rest:</strong> Your data is encrypted using AES-256 encryption when stored in
                                our databases
                            </li>
                            <li>
                                <strong>Backups:</strong> All backups are encrypted and stored in geographically
                                distributed locations
                            </li>
                        </ul>

                        <h4>🏗️ Infrastructure Security</h4>
                        <ul>
                            <li>Hosted on enterprise-grade cloud infrastructure with 24/7 monitoring</li>
                            <li>Regular penetration testing by third-party security experts</li>
                            <li>Automated security scanning and vulnerability assessments</li>
                            <li>Multi-factor authentication required for all team access</li>
                        </ul>

                        <h4>👤 Account Security</h4>
                        <p>Protect your account with these recommended practices:</p>
                        <ul>
                            <li>Use a strong, unique password for your Fitlogs account</li>
                            <li>Enable two-factor authentication (2FA) when available</li>
                            <li>Log out from shared or public devices</li>
                            <li>Report any suspicious activity immediately</li>
                        </ul>

                        <h4>🚨 Incident Response</h4>
                        <p>In the unlikely event of a security incident:</p>
                        <ul>
                            <li>We have a dedicated incident response team available 24/7</li>
                            <li>Affected users will be notified within 72 hours</li>
                            <li>We work with law enforcement when necessary</li>
                            <li>Transparent post-incident reports are published</li>
                        </ul>

                        <p>
                            Questions about security? Contact our security team at{" "}
                            <a href="mailto:security@fitlogs.com">security@fitlogs.com</a>.
                        </p>
                    </FAQItem>
                </div>
            </div>
        </div>
    );
}
