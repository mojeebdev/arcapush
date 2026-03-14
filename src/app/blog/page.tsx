import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { AdminConfig } from "@/lib/adminConfig";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: `Blog · ${AdminConfig.SITE_NAME}`,
  description:
    "Insights, data, and strategy from the definitive registry for vibe-coded products. Vibe coding, AI startups, solo founders, and the future of building.",
  metadataBase: new URL(AdminConfig.SITE_URL),
  alternates: { canonical: `${AdminConfig.SITE_URL}/blog` },
  openGraph: {
    title: `Blog · ${AdminConfig.SITE_NAME}`,
    description: "Insights from the vibe coding registry.",
    url: `${AdminConfig.SITE_URL}/blog`,
    siteName: AdminConfig.SITE_NAME,
    type: "website",
    images: [{ url: AdminConfig.SITE_OG_IMAGE, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: AdminConfig.BRAND_TWITTER,
    creator: AdminConfig.FOUNDER_TWITTER,
    title: `Blog · ${AdminConfig.SITE_NAME}`,
    images: [AdminConfig.SITE_OG_IMAGE],
  },
};

const CATEGORY_STYLE: Record<string, React.CSSProperties> = {
  "Deep Dive":     { color: "var(--accent)",  borderColor: "var(--accent-border)",  background: "var(--accent-dim)"  },
  "Data":          { color: "var(--accent)",  borderColor: "var(--accent-border)",  background: "var(--accent-dim)"  },
  "Strategy":      { color: "#60a5fa",        borderColor: "rgba(96,165,250,0.3)",  background: "rgba(96,165,250,0.1)"  },
  "Founder":       { color: "#4ade80",        borderColor: "rgba(74,222,128,0.3)",  background: "rgba(74,222,128,0.1)"  },
  "Founder Story": { color: "#4ade80",        borderColor: "rgba(74,222,128,0.3)",  background: "rgba(74,222,128,0.1)"  },
  "Insights":      { color: "var(--text-secondary)", borderColor: "var(--border)", background: "var(--bg-3)" },
};

const fallbackCategoryStyle: React.CSSProperties = {
  color: "var(--text-secondary)",
  borderColor: "var(--border)",
  background: "var(--bg-3)",
};

function CategoryBadge({ category }: { category: string }) {
  const style = CATEGORY_STYLE[category] ?? fallbackCategoryStyle;
  return (
    <span
      className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border"
      style={style}
    >
      {category}
    </span>
  );
}

function AuthorAvatar({ author, size = 28 }: { author: string; size?: number }) {
  return (
    <div
      className="rounded-full flex items-center justify-center font-black flex-shrink-0"
      style={{
        width: size, height: size,
        background: "var(--accent-dim)",
        border: "1px solid var(--accent-border)",
        color: "var(--accent)",
        fontSize: size < 28 ? "7px" : "9px",
      }}
    >
      {author.charAt(0).toUpperCase()}
    </div>
  );
}

export default function BlogPage() {
  const posts = getAllPosts();
  const featured = posts.find((p) => p.featured);
  const rest = posts.filter((p) => !p.featured);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)", color: "var(--text-primary)" }}>
      <main className="flex-grow">

        {/* Header */}
        <div
          className="pt-32 pb-16 px-6 max-w-5xl mx-auto"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <p className="ap-label mb-2">Arcapush Intelligence</p>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mt-2" style={{ color: "var(--text-primary)" }}>
            The <span style={{ color: "var(--accent)" }}>Signal.</span>
          </h1>
          <p className="text-sm mt-4 font-bold uppercase tracking-widest max-w-xl" style={{ color: "var(--text-secondary)" }}>
            Data, strategy, and insights from the vibe coding registry.
          </p>
        </div>

        <div className="px-6 max-w-5xl mx-auto py-16">
          {posts.length === 0 ? (
            <div className="text-center py-32">
              <p className="ap-label">First post incoming.</p>
            </div>
          ) : (
            <>
              {/* Featured Post */}
              {featured && (
                <div className="mb-16">
                  <p className="ap-label mb-4">Featured</p>
                  <Link href={`/blog/${featured.slug}`}>
                    <div
                      className="group rounded-[2.5rem] overflow-hidden transition-all"
                      style={{
                        background: "var(--bg-2)",
                        border: "1px solid var(--accent-border)",
                      }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--accent)")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--accent-border)")}
                    >
                      {/* Cover */}
                      <div className="relative h-[260px] w-full overflow-hidden">
                        <Image
                          src={featured.image}
                          alt={featured.title}
                          fill
                          className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                        />
                        <div
                          className="absolute inset-0"
                          style={{ background: "linear-gradient(to top, var(--bg-2), rgba(17,17,17,0.6), transparent)" }}
                        />
                      </div>

                      {/* Body */}
                      <div className="p-10">
                        <div className="flex items-center gap-3 mb-6">
                          <CategoryBadge category={featured.category} />
                          <span className="ap-label">{featured.readTime}</span>
                        </div>

                        <h2
                          className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-4 leading-tight transition-colors"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {featured.title}
                        </h2>

                        <p className="text-sm leading-relaxed mb-6 max-w-2xl" style={{ color: "var(--text-secondary)" }}>
                          {featured.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {featured.authorImage ? (
                              <Image
                                src={featured.authorImage}
                                alt={featured.author}
                                width={28} height={28}
                                className="rounded-full object-cover flex-shrink-0"
                                style={{ border: "2px solid var(--accent-border)" }}
                              />
                            ) : (
                              <AuthorAvatar author={featured.author} size={28} />
                            )}
                            <div>
                              <p className="text-xs font-black uppercase tracking-widest" style={{ color: "var(--text-primary)" }}>
                                {featured.author}
                              </p>
                              <p className="ap-label mt-0.5">
                                {new Date(featured.date).toLocaleDateString("en-US", {
                                  month: "long", day: "numeric", year: "numeric",
                                })}
                              </p>
                            </div>
                          </div>
                          <span
                            className="text-xs font-black uppercase tracking-widest group-hover:translate-x-1 transition-transform inline-block"
                            style={{ color: "var(--accent)" }}
                          >
                            Read →
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              )}

              {/* Post Grid */}
              {rest.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {rest.map((post) => (
                    <Link key={post.slug} href={`/blog/${post.slug}`}>
                      <div
                        className="group rounded-[2rem] overflow-hidden transition-all h-full flex flex-col"
                        style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--accent-border)")}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--border)")}
                      >
                        {/* Thumbnail */}
                        <div className="relative h-[160px] w-full overflow-hidden">
                          <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
                          />
                          <div
                            className="absolute inset-0"
                            style={{ background: "linear-gradient(to top, var(--bg-2), rgba(17,17,17,0.4), transparent)" }}
                          />
                          <div className="absolute top-4 left-4">
                            <CategoryBadge category={post.category} />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-8 flex-grow flex flex-col">
                          <span className="ap-label mb-3">{post.readTime}</span>

                          <h2
                            className="text-xl font-black uppercase tracking-tighter mb-3 leading-tight flex-grow transition-colors"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {post.title}
                          </h2>

                          <p className="text-xs leading-relaxed mb-6 line-clamp-2" style={{ color: "var(--text-secondary)" }}>
                            {post.description}
                          </p>

                          <div className="flex items-center justify-between mt-auto">
                            <div className="flex items-center gap-2">
                              {post.authorImage ? (
                                <Image
                                  src={post.authorImage}
                                  alt={post.author}
                                  width={20} height={20}
                                  className="rounded-full object-cover flex-shrink-0"
                                  style={{ border: "1px solid var(--accent-border)" }}
                                />
                              ) : (
                                <AuthorAvatar author={post.author} size={20} />
                              )}
                              <p className="ap-label">
                                {new Date(post.date).toLocaleDateString("en-US", {
                                  month: "short", day: "numeric", year: "numeric",
                                })}
                              </p>
                            </div>
                            <span
                              className="ap-label transition-colors group-hover:text-[var(--accent)]"
                            >
                              Read →
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}