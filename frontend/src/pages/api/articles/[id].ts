import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    try {
        const articlesDirectory = path.join(process.cwd(), "src/content/blog");

        const files = fs.readdirSync(articlesDirectory).filter((file) => file.endsWith(".md"));

        const file = files.find((f) => f.startsWith(`article-${id}`) || f.includes(`${id}`));
        if (!file) {
            return res.status(404).json({ error: "Article not found" });
        }

        const filepath = path.join(articlesDirectory, file);
        const fileContent = fs.readFileSync(filepath, "utf8");
        const { data, content } = matter(fileContent);

        res.status(200).json({
            id: data.id ?? id,
            title: data.title ?? "",
            description: data.description ?? "",
            category: data.category ?? "",
            date: data.date ?? "",
            readTime: data.readTime ?? "",
            icon: data.icon ?? "📖",
            content,
        });
    } catch (error) {
        console.error("Erreur lors de la récupération de l'article:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
