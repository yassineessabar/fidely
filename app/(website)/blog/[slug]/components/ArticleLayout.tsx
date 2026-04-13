import { posts } from "../../posts";

// Shared style constants
export const p = {
  margin: "0 0 20px",
  fontSize: "17px",
  lineHeight: "28px",
  color: "rgb(55,53,68)",
} as const;

export const h2 = {
  fontSize: "28px",
  lineHeight: "34px",
  fontWeight: 700,
  color: "rgb(11,5,29)",
  margin: "48px 0 16px",
} as const;

export const h3style = {
  fontSize: "22px",
  lineHeight: "28px",
  fontWeight: 700,
  color: "rgb(11,5,29)",
  margin: "36px 0 12px",
} as const;

export const ul = {
  margin: "0 0 20px",
  paddingLeft: "24px",
  fontSize: "17px",
  lineHeight: "28px",
  color: "rgb(55,53,68)",
} as const;

export const li = { marginBottom: "8px" } as const;

export const blockquote = {
  borderLeft: "4px solid rgb(147,51,234)",
  paddingLeft: "20px",
  margin: "24px 0",
  fontStyle: "italic" as const,
  color: "rgb(97,95,109)",
  fontSize: "18px",
  lineHeight: "28px",
} as const;

// Layout components

export function ArticleHeader({
  title,
  date,
  readTime,
  category,
}: {
  title: string;
  date: string;
  readTime: string;
  category: string;
}) {
  return (
    <header style={{ marginBottom: "48px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "16px",
        }}
      >
        <span
          style={{
            backgroundColor: "rgb(243,232,255)",
            color: "rgb(147,51,234)",
            fontSize: "13px",
            fontWeight: 600,
            padding: "4px 14px",
            borderRadius: "100px",
          }}
        >
          {category}
        </span>
        <span style={{ fontSize: "14px", color: "rgb(97,95,109)" }}>
          {date} · {readTime}
        </span>
      </div>
      <h1
        className="font-display"
        style={{
          fontSize: "42px",
          lineHeight: "48px",
          fontWeight: 700,
          color: "rgb(11,5,29)",
          margin: "0 0 16px",
        }}
      >
        {title}
      </h1>
    </header>
  );
}

export function RelatedArticles({ currentSlug }: { currentSlug: string }) {
  const related = posts.filter((p) => p.slug !== currentSlug).slice(0, 3);
  return (
    <div style={{ marginTop: "64px", borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: "40px" }}>
      <h3 className="font-display" style={{ fontSize: "24px", fontWeight: 700, color: "rgb(11,5,29)", margin: "0 0 24px" }}>
        Continue reading
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {related.map((post) => (
          <a
            key={post.slug}
            href={`/blog/${post.slug}`}
            style={{
              display: "flex",
              gap: "16px",
              alignItems: "center",
              textDecoration: "none",
              padding: "16px",
              borderRadius: "12px",
              border: "1px solid rgba(0,0,0,0.06)",
              transition: "border-color 0.2s",
            }}
          >
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "10px",
              backgroundColor: post.color,
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <span style={{
                fontSize: "10px",
                fontWeight: 600,
                color: "rgb(11,5,29)",
                opacity: 0.5,
              }}>
                {post.category.slice(0, 3).toUpperCase()}
              </span>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: "15px", fontWeight: 600, color: "rgb(11,5,29)", lineHeight: "20px" }}>
                {post.title}
              </p>
              <p style={{ margin: "4px 0 0", fontSize: "13px", color: "rgb(97,95,109)" }}>
                {post.date} · {post.readTime}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

export function ArticleFooter() {
  return (
    <div
      style={{
        marginTop: "64px",
        padding: "32px",
        backgroundColor: "rgb(243,232,255)",
        borderRadius: "16px",
        textAlign: "center",
      }}
    >
      <h3
        className="font-display"
        style={{
          fontSize: "24px",
          fontWeight: 700,
          color: "rgb(11,5,29)",
          margin: "0 0 8px",
        }}
      >
        Ready to bring your customers back?
      </h3>
      <p
        style={{
          fontSize: "16px",
          color: "rgb(97,95,109)",
          margin: "0 0 20px",
        }}
      >
        Launch your digital loyalty program in 24 hours. No app required.
      </p>
      <a
        href="/signup"
        style={{
          display: "inline-block",
          padding: "14px 32px",
          backgroundColor: "rgb(11,5,29)",
          color: "white",
          borderRadius: "100px",
          fontSize: "15px",
          fontWeight: 600,
          textDecoration: "none",
        }}
      >
        Start free trial
      </a>
    </div>
  );
}
