import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import styles from "./faqItem.module.scss";

interface faqItemProps {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

export default function faqItem({ title, children, defaultOpen = false } : faqItemProps)  {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={`${styles.faqItem} ${isOpen ? styles.open : ""}`}>
            <div className={styles.header} onClick={toggleOpen}>
                <h3 className={styles.title}>{title}</h3>
                <button className={`${styles.toggleButton} ${isOpen ? styles.rotated : ""}`}>
                    <AddIcon />
                </button>
            </div>

            <div className={`${styles.content} ${isOpen ? styles.expanded : ""}`}>
                <div className={styles.contentInner}>{children}</div>
            </div>
        </div>
    );
};
