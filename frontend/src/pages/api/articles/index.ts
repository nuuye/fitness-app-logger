import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const articlesDirectory = path.join(process.cwd(), "src/content/blog");

        // Retrieve all .md files from articles dir
        const files = fs.readdirSync(articlesDirectory).filter((file) => file.endsWith(".md"));

        const articles = files.map((filename, index) => {
            const filepath = path.join(articlesDirectory, filename);
            const fileContent = fs.readFileSync(filepath, "utf8");
            const { data, content } = matter(fileContent);

            return {
                id: data.id ?? index + 1,
                title: data.title ?? filename.replace(".md", ""),
                description: data.description ?? content.slice(0, 200) + "...",
                category: data.category ?? "",
                date: data.date ?? "",
                readTime: data.readTime ?? "",
                icon: data.icon ?? "📖",
            };
        });

        // Trier par date décroissante
        articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        res.status(200).json(articles);
    } catch (error) {
        console.error("Erreur lors de la récupération des articles:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
