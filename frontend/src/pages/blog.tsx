import React, { useState } from "react";
import { Search, BookOpen, Utensils, Dumbbell, Heart, Clock } from "lucide-react";
import styles from "./blog.module.scss";
import AppBar from "../components/appBar/appBar";
import Footer from "../components/footer/footer";
import Chip from "@mui/material/Chip";

const BlogPage = () => {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    const blogPosts = [
        {
            id: 1,
            title: "The Science Behind Progressive Overload",
            excerpt:
                "Understanding how to systematically increase training demands to maximize muscle growth and strength gains over time.",
            category: "Training",
            date: "2024-08-15",
            readTime: "5 min read",
            icon: "💪",
        },
        {
            id: 2,
            title: "Macronutrients: Your Complete Guide",
            excerpt:
                "Learn how to balance proteins, carbohydrates, and fats to fuel your workouts and support your fitness goals.",
            category: "Nutrition",
            date: "2024-08-12",
            readTime: "7 min read",
            icon: "🥗",
        },
        {
            id: 3,
            title: "Recovery: The Missing Piece of Your Fitness Puzzle",
            excerpt:
                "Discover why rest and recovery are just as important as your training sessions for achieving optimal results.",
            category: "Recovery",
            date: "2024-08-10",
            readTime: "6 min read",
            icon: "😴",
        },
        {
            id: 4,
            title: "Building Your First Workout Routine",
            excerpt:
                "A beginner's guide to creating an effective workout plan that fits your schedule and fitness level.",
            category: "Training",
            date: "2024-08-08",
            readTime: "8 min read",
            icon: "🏋️",
        },
        {
            id: 5,
            title: "Hydration and Performance: What You Need to Know",
            excerpt: "How proper hydration impacts your workout performance, recovery, and overall health.",
            category: "Nutrition",
            date: "2024-08-05",
            readTime: "4 min read",
            icon: "💧",
        },
        {
            id: 6,
            title: "The Psychology of Consistency",
            excerpt: "Mental strategies and techniques to stay motivated and build lasting fitness habits that stick.",
            category: "Mindset",
            date: "2024-08-03",
            readTime: "6 min read",
            icon: "🧠",
        },
    ];

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
            post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

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
                        <article key={post.id} className={styles.blogCard}>
                            {/* Image Placeholder */}
                            <div className={styles.imageContainer}>
                                <div className={styles.imagePlaceholder}>{post.icon}</div>
                            </div>

                            {/* Content */}
                            <div className={styles.content}>
                                <Chip
                                    className={styles.category}
                                    label={post.category}
                                    variant="outlined"
                                    color="primary"
                                />

                                <h3 className={styles.title}>{post.title}</h3>

                                <p className={styles.excerpt}>{post.excerpt}</p>

                                <div className={styles.meta}>
                                    <span className={styles.date}>{formatDate(post.date)}</span>
                                    <div className={styles.readTime}>
                                        <Clock className={styles.clockIcon} />
                                        {post.readTime}
                                    </div>
                                </div>
                            </div>
                        </article>
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
