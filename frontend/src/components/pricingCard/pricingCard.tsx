import React from "react";
import { Button } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import NotificationsIcon from "@mui/icons-material/Notifications";
import styles from "./PricingCard.module.scss";

interface pricingCardProps {
    title: string;
    price: number;
    period: string;
    description: string;
    features: string[];
    buttonText: string;
    buttonVariant: "primary" | "secondary";
    badge: string;
    badgeType: "free" | "coming";
    isCurrent?: boolean;
    onButtonClick: () => void;
}

export default function pricingCard({
    title,
    price,
    period,
    description,
    features,
    buttonText,
    buttonVariant,
    badge,
    badgeType,
    isCurrent = false,
    onButtonClick,
}: pricingCardProps) {
    return (
        <div
            className={`${styles.pricingCard} ${isCurrent ? styles.current : ""} ${
                badgeType === "coming" ? styles.comingSoon : ""
            }`}
        >
            <div className={`${styles.cardBadge} ${styles[`badge${badgeType === "free" ? "Free" : "Coming"}`]}`}>
                {badge}
            </div>
            <h2 className={styles.cardTitle}>
                Fit<span style={{ color: "hsl(210, 100%, 65%)" }}>logs </span>
                {title}
            </h2>
            <div className={styles.cardPrice}>
                <span className={styles.currency}>$</span>
                {price}
                <span className={styles.period}>/{period}</span>
            </div>
            <p className={styles.cardDescription}>{description}</p>

            <ul className={styles.featuresList}>
                {features.map((feature, index) => (
                    <li key={index}>
                        <div className={`${styles.checkIcon} ${badgeType === "coming" ? styles.comingSoonIcon : ""}`}>
                            <CheckIcon fontSize="small" />
                        </div>
                        {feature}
                    </li>
                ))}
            </ul>

            <Button
                className={`${styles.ctaButton} ${styles[buttonVariant === "primary" ? "ctaPrimary" : "ctaSecondary"]}`}
                onClick={onButtonClick}
                startIcon={badgeType === "coming" ? <NotificationsIcon /> : undefined}
            >
                {buttonText}
            </Button>
        </div>
    );
}
