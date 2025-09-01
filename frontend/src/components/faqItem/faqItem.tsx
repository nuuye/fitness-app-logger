import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import styles from "./faqItem.module.scss";

interface faqItemProps {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
    id?: string;
    forceOpen?: boolean;
}

export default function faqItem({ id, title, children, defaultOpen = false, forceOpen = false }: faqItemProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen || forceOpen);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div id={id} className={`${styles.faqItem} ${isOpen ? styles.open : ""}`}>
            <div className={styles.header} onClick={toggleOpen}>
                <h3 className={styles.title}>{title}</h3>
                <button className={`${styles.toggleButton} ${isOpen && styles.rotated}`}>
                    <AddIcon />
                </button>
            </div>

            <div className={`${styles.content} ${isOpen && styles.expanded}`}>
                <div className={styles.contentInner}>{children}</div>
            </div>
        </div>
    );
}
