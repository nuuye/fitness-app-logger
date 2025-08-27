import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import styles from "./article.module.scss";
import AppBar from "../../../components/appBar/appBar";
import Footer from "../../../components/footer/footer";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface Article {
    id: number | string;
    title: string;
    description: string;
    category: string;
    date: string;
    readTime: string;
    icon: string;
    content: string;
}

export default function ArticlePage() {
    const router = useRouter();
    const { id } = router.query;

    const [article, setArticle] = useState<Article | null>(null);

    useEffect(() => {
        if (id) {
            fetch(`/api/articles/${id}`)
                .then((res) => res.json())
                .then((data) => setArticle(data));
        }
    }, [id]);

    if (!article) {
        return (
            <div className={styles.root}>
                <div className={styles.container}>
                    <div className={styles.loading}>
                        <div className={styles.loadingText}>Loading article</div>
                        <div className={styles.loadingDots}>
                            <div className={styles.dot}></div>
                            <div className={styles.dot}></div>
                            <div className={styles.dot}></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.root}>
            <AppBar />
            <div className={styles.container}>
                {/* Header de l'article */}
                <div className={styles.articleHeader}>
                    <div className={styles.titleContainer}>
                        <h1 className={styles.title}>{article.title}</h1>
                        {article.icon && <span className={styles.emoji}>{article.icon}</span>}
                    </div>
                    <div className={styles.meta}>
                        <div className={styles.metaItem}>
                            <span>{article.date}</span>
                        </div>
                        <div className={styles.separator}></div>
                        <div className={styles.metaItem}>
                            <span>{article.readTime}</span>
                        </div>
                    </div>

                    <div className={styles.category}>{article.category}</div>
                </div>

                {/* Contenu de l'article */}
                <div className={styles.articleContent}>
                    <ReactMarkdown>{article.content}</ReactMarkdown>
                </div>

                {/* Navigation */}
                <div className={styles.navigation}>
                    <Link href="/blog" className={styles.backButton}>
                        <ArrowBackIcon /> Blog page
                    </Link>
                </div>
            </div>
            <Footer />
        </div>
    );
}
