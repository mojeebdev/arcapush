import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { AdminConfig } from "@/lib/adminConfig";
import { getPostBySlug, getAllSlugs } from "@/lib/blog";
import { ShareBar } from "./share-bar";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  const url = `${AdminConfig.SITE_URL}/blog/${post.slug}`;
  return {
    title: `${post.title} · ${AdminConfig.SITE_NAME}`,
    description: post.description,
    metadataBase: new URL(AdminConfig.SITE_URL),
    alternates: { canonical: url },
    authors: [{ name: post.author, url: post.authorUrl }],
    openGraph: {
      title: post.title, description: post.description, url,
      siteName: AdminConfig.SITE_NAME, type: "article",
      publishedTime: post.date, authors: [post.author],
      images: [{ url: post.image, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      site: AdminConfig.BRAND_TWITTER,
      creator: AdminConfig.FOUNDER_TWITTER,
      title: post.title, description: post.description,
      images: [post.image],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    image: post.image,
    author: {
      "@type": "Person",
      name: post.author,
      url: post.authorUrl,
      sameAs: [AdminConfig.FOUNDER_TWITTER, post.authorUrl],
    },
    publisher: {
      "@type": "Organization",
      name: AdminConfig.SITE_NAME,
      url: AdminConfig.SITE_URL,
      logo: `${AdminConfig.SITE_URL}/arcapush_logo.png`,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${AdminConfig.SITE_URL}/blog/${post.slug}`,
    },
    url: `${AdminConfig.SITE_URL}/blog/${post.slug}`,
    keywords: ["vibe coding", "vibe coder", "VC startups", "AI startups", post.category],
  };

  
  const prose = {
    h2: "text-2xl md:text-3xl font-black uppercase tracking-tighter mt-16 mb-6 pb-4",
    h3: "text-xl font-black uppercase tracking-tighter mt-10 mb-4",
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)", color: "var(--text-primary)" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main className="flex-grow">
        {/* Header */}
        <header className="pt-32 pb-10 px-6 max-w-3xl mx-auto">
          <Link href="/blog"
            className="inline-flex items-center gap-2 ap-label hover:text-[var(--text-primary)] mb-10 transition-colors"
          >
            ← Back to The Signal
          </Link>

          {/* Category + Read Time */}
          <div className="flex items-center gap-3 mb-6">
            <span
              className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border"
              style={{ borderColor: "var(--accent-border)", background: "var(--accent-dim)", color: "var(--accent)" }}
            >
              {post.category}
            </span>
            <span className="ap-label">{post.readTime}</span>
          </div>

          <h1
            className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9] mb-6"
            style={{ color: "var(--text-primary)" }}
          >
            {post.title}
          </h1>
          <p className="text-xl leading-relaxed mb-10" style={{ color: "var(--text-secondary)" }}>
            {post.description}
          </p>

          {/* Author + share row */}
          <div
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-10"
            style={{ borderBottom: "1px solid var(--border)" }}
          >
            <div className="flex items-center gap-4">
              {post.authorImage ? (
                <Image src={post.authorImage} alt={post.author} width={40} height={40}
                  className="rounded-full object-cover flex-shrink-0"
                  style={{ border: "2px solid var(--accent-border)" }}
                />
              ) : (
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                  style={{ background: "var(--accent-dim)", border: "1px solid var(--accent-border)", color: "var(--accent)" }}
                >
                  {post.author.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <a href={post.authorUrl} target="_blank" rel="noopener noreferrer"
                  className="text-xs font-black uppercase tracking-widest transition-colors"
                  style={{ color: "var(--text-primary)" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--accent)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-primary)")}
                >
                  {post.author}
                </a>
                <p className="ap-label mt-0.5">
                  {new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </p>
              </div>
            </div>
            <ShareBar title={post.title} slug={post.slug} />
          </div>
        </header>

        {/* Cover image */}
        <div className="px-6 max-w-3xl mx-auto mb-14">
          <div className="relative w-full h-[320px] md:h-[460px] rounded-[2rem] overflow-hidden">
            <Image src={post.image} alt={post.title} fill priority className="object-cover" />
          </div>
        </div>

        {/* Article body */}
        <article className="px-6 max-w-3xl mx-auto pb-14">
          <ReactMarkdown
            components={{
              h2: ({ children }) => (
                <h2 className={prose.h2} style={{ color: "var(--text-primary)", borderBottom: "1px solid var(--border)" }}>{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className={prose.h3} style={{ color: "var(--text-primary)" }}>{children}</h3>
              ),
              p: ({ children }) => (
                <p className="text-base leading-[1.9] mb-6" style={{ color: "var(--text-secondary)" }}>{children}</p>
              ),
              strong: ({ children }) => (
                <strong className="font-black" style={{ color: "var(--text-primary)" }}>{children}</strong>
              ),
              a: ({ href, children }) => (
                <a href={href} target="_blank" rel="noopener noreferrer"
                  className="underline underline-offset-4 transition-colors"
                  style={{ color: "var(--accent)" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.8")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
                >
                  {children}
                </a>
              ),
              ul: ({ children }) => <ul className="space-y-3 my-6 ml-4">{children}</ul>,
              ol: ({ children }) => <ol className="space-y-3 my-6 ml-4 list-decimal">{children}</ol>,
              li: ({ children }) => (
                <li className="text-base leading-relaxed flex gap-3 items-start" style={{ color: "var(--text-secondary)" }}>
                  <span className="mt-1.5 text-xs flex-shrink-0" style={{ color: "var(--accent)" }}>◆</span>
                  <span>{children}</span>
                </li>
              ),
              blockquote: ({ children }) => (
                <blockquote className="pl-6 my-8 italic text-lg leading-relaxed"
                  style={{ borderLeft: "2px solid var(--accent)", color: "var(--text-secondary)" }}
                >
                  {children}
                </blockquote>
              ),
              code: ({ children }) => (
                <code className="rounded px-2 py-0.5 text-sm font-mono"
                  style={{ background: "var(--bg-3)", border: "1px solid var(--border)", color: "var(--accent)" }}
                >
                  {children}
                </code>
              ),
              pre: ({ children }) => (
                <pre className="rounded-2xl p-6 overflow-x-auto my-8 text-sm"
                  style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}
                >
                  {children}
                </pre>
              ),
              table: ({ children }) => (
                <div className="overflow-x-auto my-10 rounded-2xl" style={{ border: "1px solid var(--border)" }}>
                  <table className="w-full border-collapse text-sm">{children}</table>
                </div>
              ),
              thead: ({ children }) => <thead style={{ background: "var(--bg-3)" }}>{children}</thead>,
              tbody: ({ children }) => <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>{children}</tbody>,
              tr: ({ children }) => <tr className="transition-colors" style={{ color: "var(--text-secondary)" }}>{children}</tr>,
              th: ({ children }) => (
                <th className="text-left text-xs font-black uppercase tracking-widest px-6 py-4 whitespace-nowrap"
                  style={{ color: "var(--text-tertiary)", borderBottom: "1px solid var(--border)" }}
                >
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="text-sm px-6 py-4 align-middle" style={{ color: "var(--text-secondary)" }}>{children}</td>
              ),
              hr: () => <hr className="my-12" style={{ borderColor: "var(--border)" }} />,
            }}
          >
            {post.content}
          </ReactMarkdown>
        </article>

        {/* Bottom share bar */}
        <div className="px-6 max-w-3xl mx-auto pb-10 pt-8" style={{ borderTop: "1px solid var(--border)" }}>
          <p className="ap-label mb-4">Found this useful? Pass it on.</p>
          <ShareBar title={post.title} slug={post.slug} />
        </div>

        {/* CTA */}
        <div className="px-6 max-w-3xl mx-auto pb-20 pt-6">
          <div
            className="rounded-[2rem] p-10 text-center"
            style={{ background: "var(--bg-2)", border: "1px solid var(--accent-border)" }}
          >
            <p className="ap-label mb-3">Arcapush Registry</p>
            <h3 className="text-2xl font-black uppercase tracking-tighter mb-4" style={{ color: "var(--text-primary)" }}>
              Is your product listed?
            </h3>
            <p className="text-sm mb-8 max-w-md mx-auto" style={{ color: "var(--text-secondary)" }}>
              Submit your vibe-coded product and get permanently indexed in the registry. Free for every founder.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/submit" className="ap-btn-primary">List Your Product</Link>
              <Link href="/registry" className="ap-btn-ghost">Browse Registry</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


