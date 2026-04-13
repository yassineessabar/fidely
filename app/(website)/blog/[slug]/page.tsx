import { Metadata } from "next";
import { notFound } from "next/navigation";
import { posts, getPost } from "../posts";
import { ArticleHeader, ArticleFooter, RelatedArticles, p } from "./components/ArticleLayout";
import Article1 from "./components/Article1";
import Article2 from "./components/Article2";
import Article3 from "./components/Article3";
import Article4 from "./components/Article4";
import Article5 from "./components/Article5";
import Article6 from "./components/Article6";

export async function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = getPost(params.slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.desc,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.desc,
      url: `/blog/${post.slug}`,
      publishedTime: post.dateISO,
      authors: ["Fidely"],
      tags: [post.category, "loyalty", "customer retention"],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.desc,
    },
  };
}

const articleContent: Record<string, React.ReactNode> = {
  "why-paper-loyalty-cards-are-costing-you-customers": <Article1 />,
  "how-cafe-bloom-increased-revenue-30-percent": <Article2 />,
  "push-notification-advantage-free-marketing": <Article3 />,
  "5-retention-strategies-every-local-business-should-know": <Article4 />,
  "apple-wallet-vs-apps-why-less-is-more": <Article5 />,
  "how-to-collect-customer-data-without-being-creepy": <Article6 />,
};

export default function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = getPost(params.slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.desc,
    datePublished: post.dateISO,
    dateModified: post.dateISO,
    author: { "@type": "Organization", name: "Fidely", url: "https://fidely.com" },
    publisher: {
      "@type": "Organization",
      name: "Fidely",
      url: "https://fidely.com",
      logo: { "@type": "ImageObject", url: "https://fidely.com/favicon.svg" },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://fidely.com/blog/${post.slug}` },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://fidely.com" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://fidely.com/blog" },
      { "@type": "ListItem", position: 3, name: post.title, item: `https://fidely.com/blog/${post.slug}` },
    ],
  };

  const content = articleContent[post.slug];

  return (
    <article style={{ backgroundColor: "white", padding: "80px 0" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "0 24px" }}>
        <a
          href="/blog"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "14px",
            color: "rgb(147,51,234)",
            textDecoration: "none",
            fontWeight: 500,
            marginBottom: "32px",
          }}
        >
          ← Back to blog
        </a>
        <ArticleHeader
          title={post.title}
          date={post.date}
          readTime={post.readTime}
          category={post.category}
        />
        {content || <p style={p}>{post.desc}</p>}
        <ArticleFooter />
        <RelatedArticles currentSlug={post.slug} />
      </div>
    </article>
  );
}
