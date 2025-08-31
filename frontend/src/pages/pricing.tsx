import styles from "./pricing.module.scss";
import PricingCard from "../components/pricingCard/pricingCard";
import AppBar from "../components/appBar/appBar";
import { useRouter } from "next/router";
import Footer from "../components/footer/footer";

export default function Pricing() {
    const router = useRouter();

    const currentPlanFeatures = [
        "Unlimited categories & sub-categories",
        "Comprehensive analytics dashboard",
        "Long-term performance tracking",
        "Secure cloud storage",
        "Multi-device synchronization",
    ];

    const proPlanFeatures = [
        "Everything in Free plan",
        "AI-powered workout recommendations",
        "Advanced progress predictions",
        "Custom workout templates",
        "Export data to PDF/Excel",
        "Priority customer support",
    ];

    const handleGetStarted = () => {
        router.push("/signup");
    };

    return (
        <div className={styles.root}>
            <AppBar />
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>Simple & Transparent Pricing</h1>
                    <p>
                        Fitlogs is currently free for everyone. Track your fitness journey without limits, and stay
                        tuned for exciting premium features coming soon!
                    </p>
                </div>

                <div className={styles.pricingGrid}>
                    <PricingCard
                        title="Free"
                        price={0}
                        period="forever"
                        description="Full access to all current features. No hidden costs, no time limits."
                        features={currentPlanFeatures}
                        buttonText="Get Started Free"
                        buttonVariant="primary"
                        badge="Current"
                        badgeType="free"
                        isCurrent={true}
                        onButtonClick={handleGetStarted}
                    />

                    <PricingCard
                        title="Pro"
                        price={5}
                        period="month"
                        description="Advanced features for serious fitness enthusiasts and professionals."
                        features={proPlanFeatures}
                        buttonVariant="secondary"
                        badge="Coming Soon"
                        badgeType="coming"
                    />
                </div>
            </div>
            <Footer />
        </div>
    );
}
