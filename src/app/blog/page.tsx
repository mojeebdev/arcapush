import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { AdminConfig } from "@/lib/adminConfig";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: `Blog · ${AdminConfig.SITE_NAME}`,
  description: "Insights, data, and strategy from the definitive encyclopedia for VC-backed Vibe Coders.",
  metadataBase: new URL(AdminConfig.SITE_URL),
  alternates: { canonical: `${AdminConfig.SITE_URL}/blog` },
  openGraph: {
    title: `Blog · ${AdminConfig.SITE_NAME}`,
    description: "Insights from the vibe coding encyclopedia.",
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

const CATEGORY_COLORS: Record<string, string> = {
  "Deep Dive":    "text-[#4E24CF] border-[#4E24CF]/30 bg-[#4E24CF]/8",
  "Data":         "text-[#D4AF37] border-[#D4AF37]/30 bg-[#D4AF37]/8",
  "Strategy":     "text-blue-600 border-blue-400/30 bg-blue-400/8",
  "Founder":      "text-emerald-600 border-emerald-400/30 bg-emerald-400/8",
  "Founder Story":"text-emerald-600 border-emerald-400/30 bg-emerald-400/8",
  "Insights":     "text-zinc-500 border-zinc-300 bg-zinc-100",
};

export default function BlogPage() {
  const posts = getAllPosts();
  const featured = posts.find((p) => p.featured);
  const rest = posts.filter((p) => !p.featured);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#F5F0E8" }}>
      <main className="flex-grow">

        {/* Header */}
        <div className="pt-32 pb-16 px-6 max-w-5xl mx-auto border-b border-black/8">
          <span className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.4em]">
            Vibestream Intelligence
          </span>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mt-2 text-zinc-900">
            The <span className="text-[#4E24CF]">Signal.</span>
          </h1>
          <p className="text-zinc-500 text-sm mt-4 font-bold uppercase tracking-widest max-w-xl">
            Data, strategy, and insights from the vibe coding encyclopedia.
          </p>
        </div>

        <div className="px-6 max-w-5xl mx-auto py-16">
          {posts.length === 0 ? (
            <div className="text-center py-32">
              <p className="text-zinc-400 font-black uppercase tracking-widest text-[10px]">
                First transmission incoming.
              </p>
            </div>
          ) : (
            <>
              {/* Featured Post */}
              {featured && (
                <div className="mb-16">
                  <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#D4AF37] mb-4">Featured</p>
                  <Link href={`/blog/${featured.slug}`}>
                    <div className="group bg-white border border-[#4E24CF]/20 rounded-[2.5rem] overflow-hidden hover:border-[#4E24CF] transition-all shadow-card">
                      <div className="relative h-[260px] w-full overflow-hidden">
                        <Image
                          src={featured.image} alt={featured.title} fill
                          className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/30 to-transparent" />
                      </div>
                      <div className="p-10">
                        <div className="flex items-center gap-3 mb-6">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${CATEGORY_COLORS[featured.category] ?? CATEGORY_COLORS["Insights"]}`}>
                            {featured.category}
                          </span>
                          <span className="text-zinc-400 text-[9px] font-black uppercase tracking-widest">
                            {featured.readTime}
                          </span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-zinc-900 group-hover:text-[#4E24CF] transition-colors mb-4 leading-tight">
                          {featured.title}
                        </h2>
                        <p className="text-zinc-600 text-sm leading-relaxed mb-6 max-w-2xl">
                          {featured.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {featured.authorImage ? (
                              <Image src={featured.authorImage} alt={featured.author} width={28} height={28}
                                className="rounded-full object-cover ring-2 ring-[#4E24CF]/40 flex-shrink-0" />
                            ) : (
                              <div className="w-7 h-7 rounded-full bg-[#4E24CF] flex items-center justify-center text-[9px] font-black text-white flex-shrink-0">
                                {featured.author.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <p className="text-[10px] font-black text-zinc-900 uppercase tracking-widest">{featured.author}</p>
                              <p className="text-[9px] text-zinc-400 uppercase tracking-widest">
                                {new Date(featured.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                              </p>
                            </div>
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#4E24CF] group-hover:translate-x-1 transition-transform inline-block">
                            Read &rarr;
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
                      <div className="group bg-white border border-black/8 rounded-[2rem] overflow-hidden hover:border-[#4E24CF]/30 transition-all h-full flex flex-col shadow-card">
                        <div className="relative h-[160px] w-full overflow-hidden">
                          <Image src={post.image} alt={post.title} fill
                            className="object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" />
                          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
                          <div className="absolute top-4 left-4">
                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${CATEGORY_COLORS[post.category] ?? CATEGORY_COLORS["Insights"]}`}>
                              {post.category}
                            </span>
                          </div>
                        </div>
                        <div className="p-8 flex-grow flex flex-col">
                          <span className="text-zinc-400 text-[9px] font-black uppercase tracking-widest mb-3">{post.readTime}</span>
                          <h2 className="text-xl font-black uppercase tracking-tighter text-zinc-900 group-hover:text-[#4E24CF] transition-colors mb-3 leading-tight flex-grow">
                            {post.title}
                          </h2>
                          <p className="text-zinc-500 text-xs leading-relaxed mb-6 line-clamp-2">{post.description}</p>
                          <div className="flex items-center justify-between mt-auto">
                            <div className="flex items-center gap-2">
                              {post.authorImage ? (
                                <Image src={post.authorImage} alt={post.author} width={20} height={20}
                                  className="rounded-full object-cover ring-1 ring-[#4E24CF]/30 flex-shrink-0" />
                              ) : (
                                <div className="w-5 h-5 rounded-full bg-[#4E24CF] flex items-center justify-center text-[7px] font-black text-white flex-shrink-0">
                                  {post.author.charAt(0).toUpperCase()}
                                </div>
                              )}
                              <p className="text-[9px] text-zinc-400 font-black uppercase tracking-widest">
                                {new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                              </p>
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-[#4E24CF] transition-colors">
                              Read &rarr;
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