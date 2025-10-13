import React, { useEffect, useState } from "react";
import { Search, BookOpen, Utensils, Dumbbell, Heart } from "lucide-react";
import styles from "./index.module.scss";
import AppBar from "../../components/appBar/appBar";
import Footer from "../../components/footer/footer";
import { blogPost } from "../../types/blog";
import BlogCard from "../../components/blogCard/blogCard";

const BlogPage = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [blogPosts, setBlogPosts] = useState<blogPost[]>([]);
    const [loading, setLoading] = useState<string>("Loading articles");

    useEffect(() => {
        window.scrollTo(0, 0);
        const loadArticles = async () => {
            try {
                let articles: blogPost[] = [];

                // Load articles
                try {
                    const response = await fetch(`/api/frontend/articles/`);
                    console.log("response: ", response);
                    if (response.ok) {
                        articles = await response.json();
                    }
                } catch (error) {
                    console.warn(`Error while loading articles:`, error);
                }

                console.log(articles);

                // Sorting by date (most recent first)
                articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                setBlogPosts(articles);
            } catch (error) {
                console.error("Erreur lors du chargement des articles:", error);
            } finally {
                setLoading("");
            }
        };

        loadArticles();
    }, []);

    const categories = [
        { id: "all", label: "All Articles", icon: BookOpen },
        { id: "Training", label: "Training", icon: Dumbbell },
        { id: "Nutrition", label: "Nutrition", icon: Utensils },
        { id: "Recovery", label: "Recovery", icon: Heart },
        { id: "Mindset", label: "Mindset", icon: BookOpen },
    ];

    const filteredPosts = blogPosts.filter((post) => {
        const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
        const matchesSearch =
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (loading) {
        return (
            <div className={`${styles.root} ${styles.loadingRoot}`}>
                <div className={styles.loadingContainer}>
                    <span className={styles.loadingText}>{loading}</span>
                    <div className={styles.loadingDots}>
                        <div className={styles.dot}></div>
                        <div className={styles.dot}></div>
                        <div className={styles.dot}></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.root}>
            <AppBar />
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <h1>Fitness Blog</h1>
                    <p>
                        Discover evidence-based insights, practical tips, and expert guidance to elevate your fitness
                        journey
                    </p>
                </div>

                {/* Search */}
                <div className={styles.searchContainer}>
                    <Search className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Search articles..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>

                {/* Categories */}
                <div className={styles.categoriesFilter}>
                    {categories.map((category) => {
                        const IconComponent = category.icon;
                        return (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`${styles.categoryButton} ${
                                    selectedCategory === category.id ? styles.active : ""
                                }`}
                            >
                                <IconComponent className={styles.categoryIcon} />
                                {category.label}
                            </button>
                        );
                    })}
                </div>

                {/* Blog Grid */}
                <div className={styles.blogGrid}>
                    {filteredPosts.map((post) => (
                        <BlogCard key={post.id} post={post} onClick={() => setLoading("Loading article")} />
                    ))}
                </div>

                {/* No Results */}
                {filteredPosts.length === 0 && (
                    <div className={styles.noResults}>
                        <h3 className={styles.noResultsTitle}>🔍 No articles found</h3>
                        <p className={styles.noResultsText}>Try adjusting your search or category filter</p>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default BlogPage;
