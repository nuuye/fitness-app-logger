import styles from "./blogCard.module.scss";
import Chip from "@mui/material/Chip";
import { Clock } from "lucide-react";
import { blogPost } from "../../types/blog";

interface blogCardProps {
    post: blogPost;
}

export default function BlogCard({ post }: blogCardProps) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <article key={post.id} className={styles.blogCard}>
            <a href={`blog/article/${post.id}`}>
                {/* Image Placeholder */}
                <div className={styles.imageContainer}>
                    <div className={styles.imagePlaceholder}>{post.icon}</div>
                </div>

                {/* Content */}
                <div className={styles.content}>
                    <Chip className={styles.category} label={post.category} variant="outlined" color="primary" />

                    <h3 className={styles.title}>{post.title}</h3>

                    <p className={styles.description}>{post.description}</p>

                    <div className={styles.meta}>
                        <span className={styles.date}>{formatDate(post.date)}</span>
                        <div className={styles.readTime}>
                            <Clock className={styles.clockIcon} />
                            {post.readTime}
                        </div>
                    </div>
                </div>
            </a>
        </article>
    );
}
