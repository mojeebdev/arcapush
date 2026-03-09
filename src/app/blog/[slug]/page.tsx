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
      title: post.title,
      description: post.description,
      url,
      siteName: AdminConfig.SITE_NAME,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      images: [{ url: post.image, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      site: AdminConfig.BRAND_TWITTER,
      creator: AdminConfig.FOUNDER_TWITTER,
      title: post.title,
      description: post.description,
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
      logo: `${AdminConfig.SITE_URL}/logo.png`,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${AdminConfig.SITE_URL}/blog/${post.slug}`,
    },
    url: `${AdminConfig.SITE_URL}/blog/${post.slug}`,
    keywords: ["vibe coding", "vibe coder", "VC startups", "AI startups", post.category],
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="flex-grow">
        {/* Hero Image */}
        <div className="relative h-[360px] md:h-[480px] w-full overflow-hidden">
          <Image
            src={post.image}
            alt={post.title}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
        </div>

        {/* Back */}
        <div className="px-6 max-w-3xl mx-auto mt-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 hover:text-white transition-colors"
          >
            &larr; Back to The Signal
          </Link>
        </div>

        {/* Post Header */}
        <header className="pt-8 pb-12 px-6 max-w-3xl mx-auto border-b border-white/5">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-[#4E24CF]/30 bg-[#4E24CF]/10 text-[#4E24CF]">
              {post.category}
            </span>
            <span className="text-zinc-600 text-[9px] font-black uppercase tracking-widest">
              {post.readTime}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white leading-[0.9] mb-6">
            {post.title}
          </h1>

          <p className="text-zinc-400 text-base leading-relaxed mb-8">
            {post.description}
          </p>

          {/* Author + Share Row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-center gap-4">
              {post.authorImage ? (
                <Image
                  src={post.authorImage}
                  alt={post.author}
                  width={36}
                  height={36}
                  className="rounded-full object-cover ring-2 ring-[#4E24CF]/40"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-[#4E24CF] flex items-center justify-center text-[10px] font-black text-white flex-shrink-0">
                  {post.author.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <a
                  href={post.authorUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-black uppercase tracking-widest text-white hover:text-[#D4AF37] transition-colors"
                >
                  {post.author}
                </a>
                <p className="text-[9px] text-zinc-600 uppercase tracking-widest">
                  {new Date(post.date).toLocaleDateString("en-US", {
                    month: "long", day: "numeric", year: "numeric",
                  })}
                </p>
              </div>
            </div>

            <ShareBar title={post.title} slug={post.slug} />
          </div>
        </header>

        {/* Article Body */}
        <article className="px-6 max-w-3xl mx-auto py-14">
          <ReactMarkdown
            components={{
              h2: ({ children }) => (
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-white mt-16 mb-6 border-b border-white/5 pb-4">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl font-black uppercase tracking-tighter text-white mt-10 mb-4">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-zinc-400 text-base leading-[1.9] mb-6">{children}</p>
              ),
              strong: ({ children }) => (
                <strong className="text-white font-black">{children}</strong>
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#4E24CF] hover:text-[#D4AF37] transition-colors underline underline-offset-4"
                >
                  {children}
                </a>
              ),
              ul: ({ children }) => (
                <ul className="space-y-3 my-6 ml-4">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="space-y-3 my-6 ml-4 list-decimal">{children}</ol>
              ),
              li: ({ children }) => (
                <li className="text-zinc-400 text-base leading-relaxed flex gap-3 items-start">
                  <span className="text-[#D4AF37] mt-1.5 text-[8px] flex-shrink-0">◆</span>
                  <span>{children}</span>
                </li>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-2 border-[#4E24CF] pl-6 my-8 italic text-zinc-300 text-lg leading-relaxed">
                  {children}
                </blockquote>
              ),
              code: ({ children }) => (
                <code className="bg-zinc-900 border border-white/10 rounded px-2 py-0.5 text-[#D4AF37] text-sm font-mono">
                  {children}
                </code>
              ),
              pre: ({ children }) => (
                <pre className="bg-zinc-950 border border-white/10 rounded-2xl p-6 overflow-x-auto my-8 text-sm">
                  {children}
                </pre>
              ),
              table: ({ children }) => (
                <div className="overflow-x-auto my-8">
                  <table className="w-full border-collapse">{children}</table>
                </div>
              ),
              thead: ({ children }) => (
                <thead className="border-b border-white/10">{children}</thead>
              ),
              th: ({ children }) => (
                <th className="text-left text-[9px] font-black uppercase tracking-widest text-zinc-500 py-3 pr-6">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="text-zinc-400 text-sm py-3 pr-6 border-b border-white/5">
                  {children}
                </td>
              ),
              hr: () => <hr className="border-t border-white/5 my-12" />,
            }}
          >
            {post.content}
          </ReactMarkdown>
        </article>

        {/* Bottom Share Bar */}
        <div className="px-6 max-w-3xl mx-auto pb-10 border-t border-white/5 pt-8">
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-4">
            Found this useful? Pass it on.
          </p>
          <ShareBar title={post.title} slug={post.slug} />
        </div>

        {/* CTA */}
        <div className="px-6 max-w-3xl mx-auto pb-20 pt-6">
          <div className="bg-zinc-950 border border-[#4E24CF]/20 rounded-[2rem] p-10 text-center">
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#D4AF37] mb-3">
              Vibestream Encyclopedia
            </p>
            <h3 className="text-2xl font-black uppercase tracking-tighter text-white mb-4">
              Is your startup listed?
            </h3>
            <p className="text-zinc-500 text-sm mb-8 max-w-md mx-auto">
              Get your vibe coding product permanently indexed in the encyclopedia.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/submit"
                className="px-8 py-4 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#4E24CF] hover:text-white transition-all"
              >
                Submit Your Startup
              </Link>
              <Link
                href="/registry"
                className="px-8 py-4 border border-white/10 text-zinc-400 rounded-xl font-black text-[10px] uppercase tracking-widest hover:text-white hover:border-white/30 transition-all"
              >
                Browse Registry
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
