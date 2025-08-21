import React, { useEffect, useState } from "react";
import { Search, BookOpen, Utensils, Dumbbell, Heart } from "lucide-react";
import styles from "./index.module.scss";
import AppBar from "../../components/appBar/appBar";
import Footer from "../../components/footer/footer";
import { blogPost } from "../../types/blog";
import BlogCard from "../../components/blogCard/blogCard";

const BlogPage = () => {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [blogPosts, setBlogPosts] = useState<blogPost[]>([]);

    useEffect(() => {
        setBlogPosts([
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
        ]);
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
            post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

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
                        <BlogCard post={post} />
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
