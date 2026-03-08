import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Works both locally and on Vercel
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

function getBlogDir(): string {
  // Try multiple paths — handles Vercel's deployment structure
  const candidates = [
    path.join(process.cwd(), "content/blog"),
    path.join(process.cwd(), ".next/server/content/blog"),
    path.join(process.cwd(), "../../content/blog"),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }
  return path.join(process.cwd(), "content/blog");
}

export function getAllPosts(): Omit<BlogPost, "content">[] {
  const dir = getBlogDir();
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((filename) => {
      const raw = fs.readFileSync(path.join(dir, filename), "utf-8");
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
  const dir = getBlogDir();
  const filePath = path.join(dir, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    console.error(`[blog] Post not found: ${filePath}`);
    console.error(`[blog] cwd: ${process.cwd()}`);
    console.error(`[blog] dir exists: ${fs.existsSync(dir)}`);
    if (fs.existsSync(dir)) {
      console.error(`[blog] files in dir:`, fs.readdirSync(dir));
    }
    return null;
  }

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
  const dir = getBlogDir();
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(".md", ""));
}