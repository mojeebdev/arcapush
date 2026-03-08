import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  authorUrl: string;
  category: string;
  readTime: string;
  image: string;
  featured?: boolean;
  content: string;
}

export function getAllPosts(): Omit<BlogPost, "content">[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((filename) => {
      const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf-8");
      const { data } = matter(raw);
      return {
        slug: filename.replace(".md", ""),
        title: data.title,
        description: data.description,
        date: data.date,
        author: data.author ?? "Mojeeb",
        authorUrl: data.authorUrl ?? "https://mojeeb.xyz",
        category: data.category ?? "Insights",
        readTime: data.readTime ?? "5 min read",
        image: data.image ?? "/og-vibestream.png",
        featured: data.featured ?? false,
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    slug,
    title: data.title,
    description: data.description,
    date: data.date,
    author: data.author ?? "Mojeeb",
    authorUrl: data.authorUrl ?? "https://mojeeb.xyz",
    category: data.category ?? "Insights",
    readTime: data.readTime ?? "5 min read",
    image: data.image ?? "/og-vibestream.png",
    featured: data.featured ?? false,
    content,
  };
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(".md", ""));
}