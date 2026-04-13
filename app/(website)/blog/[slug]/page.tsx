import { Metadata } from "next";
import { notFound } from "next/navigation";
import { posts, getPost } from "../posts";

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

function ArticleHeader({
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

function ArticleFooter() {
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

const p = {
  margin: "0 0 20px",
  fontSize: "17px",
  lineHeight: "28px",
  color: "rgb(55,53,68)",
} as const;
const h2 = {
  fontSize: "28px",
  lineHeight: "34px",
  fontWeight: 700,
  color: "rgb(11,5,29)",
  margin: "48px 0 16px",
} as const;
const h3style = {
  fontSize: "22px",
  lineHeight: "28px",
  fontWeight: 700,
  color: "rgb(11,5,29)",
  margin: "36px 0 12px",
} as const;
const ul = {
  margin: "0 0 20px",
  paddingLeft: "24px",
  fontSize: "17px",
  lineHeight: "28px",
  color: "rgb(55,53,68)",
} as const;
const li = { marginBottom: "8px" } as const;
const blockquote = {
  borderLeft: "4px solid rgb(147,51,234)",
  paddingLeft: "20px",
  margin: "24px 0",
  fontStyle: "italic" as const,
  color: "rgb(97,95,109)",
  fontSize: "18px",
  lineHeight: "28px",
} as const;

function Article1() {
  return (
    <>
      <p style={p}>
        You hand a customer a paper punch card. They smile, tuck it in their
        wallet. Two days later, it&apos;s in the washing machine. Sound familiar?
      </p>
      <p style={p}>
        Paper loyalty cards have been around for decades, and for good reason —
        they&apos;re simple, cheap, and customers understand them instantly. But in
        2025, they&apos;re quietly bleeding your business dry. Here&apos;s how.
      </p>

      <h2 className="font-display" style={h2}>
        The numbers don&apos;t lie
      </h2>
      <p style={p}>
        Studies show that{" "}
        <strong>
          80% of paper loyalty cards are lost, thrown away, or forgotten within
          the first week
        </strong>
        . That means 4 out of 5 customers who showed interest in coming back
        never complete their card. Not because they don&apos;t want to — because the
        card disappeared.
      </p>
      <p style={p}>
        Now think about what that costs you. Each lost card is a lost customer
        relationship. If your average customer visits 3 times before completing
        a punch card, and your average order is €15, every lost card represents
        at least{" "}
        <strong>€45 in potential revenue</strong> that walks out the door.
      </p>

      <h2 className="font-display" style={h2}>
        The hidden costs you&apos;re not counting
      </h2>
      <h3 className="font-display" style={h3style}>
        1. Printing costs add up
      </h3>
      <p style={p}>
        A batch of 1,000 punch cards costs €50-100. You go through 3-4 batches
        a year. That&apos;s €200-400 annually — not huge, but not zero either.
        Digital cards cost nothing to distribute.
      </p>
      <h3 className="font-display" style={h3style}>
        2. You have zero customer data
      </h3>
      <p style={p}>
        Paper cards are anonymous. You have no idea who your loyal customers
        are, when they last visited, or how to reach them. You can&apos;t send a
        &ldquo;we miss you&rdquo; message because you don&apos;t know who to send it to.
      </p>
      <h3 className="font-display" style={h3style}>
        3. Fraud is surprisingly common
      </h3>
      <p style={p}>
        Self-stamping. Photocopied cards. Employees giving extra stamps to
        friends. Paper has no security. Digital passes are tied to unique
        identifiers and can only be updated through your system.
      </p>
      <h3 className="font-display" style={h3style}>
        4. No reminders, no return visits
      </h3>
      <p style={p}>
        A paper card sitting in a drawer doesn&apos;t remind anyone to come back. A
        digital card in Apple Wallet can send a push notification: &ldquo;You&apos;re 2
        stamps away from a free coffee!&rdquo; That notification is free and it works.
      </p>

      <h2 className="font-display" style={h2}>
        The digital alternative
      </h2>
      <p style={p}>
        Digital loyalty cards live in your customer&apos;s phone — specifically in
        Apple Wallet or Google Wallet. They can&apos;t be lost, don&apos;t need an app
        download, and they let you collect customer data automatically.
      </p>
      <p style={p}>When a customer adds your card:</p>
      <ul style={ul}>
        <li style={li}>
          You get their name, email, and phone number — automatically
        </li>
        <li style={li}>
          The card is always with them (because their phone is always with them)
        </li>
        <li style={li}>
          You can send unlimited push notifications for free
        </li>
        <li style={li}>
          You can track visits, spending patterns, and redemption rates
        </li>
        <li style={li}>
          The card updates in real-time (stamps, points, rewards)
        </li>
      </ul>

      <h2 className="font-display" style={h2}>
        Making the switch
      </h2>
      <p style={p}>
        Switching from paper to digital doesn&apos;t mean disrupting your whole
        operation. You keep the same loyalty logic (buy 9, get 1 free), but now
        it&apos;s tracked digitally. Your staff scans a QR code instead of stamping a
        card. That&apos;s it.
      </p>
      <p style={p}>
        The setup takes less than 24 hours. Your customers add the card in 2
        taps. And from day one, you start building a customer database that
        actually drives revenue.
      </p>

      <blockquote style={blockquote}>
        &ldquo;We switched from paper to digital and saw 3x more completed punch cards
        in the first month. The notifications alone brought back customers we
        hadn&apos;t seen in weeks.&rdquo;
      </blockquote>

      <h2 className="font-display" style={h2}>
        The bottom line
      </h2>
      <p style={p}>
        Paper loyalty cards were a great idea 20 years ago. Today, they&apos;re
        leaving money on the table. Digital wallet cards are easier for
        customers, cheaper for you, and give you data that paper never could.
      </p>
      <p style={p}>
        If you&apos;re still handing out paper cards, you&apos;re not just behind the
        times — you&apos;re actively losing the customers who want to come back.
      </p>
    </>
  );
}

function Article2() {
  return (
    <>
      <p style={p}>
        Café Bloom is a 40-seat coffee shop in the 11th arrondissement of
        Paris. Owner Marie Duval had the same problem every small café faces:
        regulars loved the place, but there was no system to keep them coming
        back consistently.
      </p>
      <p style={p}>
        &ldquo;We had a paper punch card,&rdquo; Marie says. &ldquo;Buy 9 coffees, get the 10th
        free. Maybe 10% of people actually completed one.&rdquo;
      </p>

      <h2 className="font-display" style={h2}>
        The problem
      </h2>
      <p style={p}>
        Café Bloom&apos;s revenue was flat. Weekday mornings were strong, but
        afternoons and weekends were hit-or-miss. Marie tried Instagram
        promotions and a €500 Google Ads campaign. Both brought in new faces,
        but most never came back for a second visit.
      </p>
      <p style={p}>
        The real issue wasn&apos;t attracting customers — it was{" "}
        <strong>keeping them</strong>. Marie had no way to contact people who&apos;d
        visited once, no data on who her regulars were, and no tool to bring
        people back.
      </p>

      <h2 className="font-display" style={h2}>
        The solution
      </h2>
      <p style={p}>
        In February 2025, Marie launched a digital loyalty card with Fidely.
        Setup took one afternoon. Here&apos;s what she did:
      </p>
      <ul style={ul}>
        <li style={li}>
          <strong>Card type:</strong> Digital punch card (buy 9, get 1 free) —
          same as before, but in Apple Wallet
        </li>
        <li style={li}>
          <strong>Sign-up:</strong> QR code at the counter + a small table tent
          card
        </li>
        <li style={li}>
          <strong>Incentive:</strong> First stamp given free for signing up
        </li>
      </ul>

      <h2 className="font-display" style={h2}>
        Week 1: 127 sign-ups
      </h2>
      <p style={p}>
        Marie was surprised by the adoption rate. &ldquo;People pulled out their
        phones and added the card in 10 seconds. No app to download, no account
        to create. That was the key.&rdquo;
      </p>
      <p style={p}>
        By end of week 1, 127 customers had added the digital card. Marie now
        had 127 names, emails, and phone numbers — a customer database she&apos;d
        never had in 4 years of running the café.
      </p>

      <h2 className="font-display" style={h2}>
        Week 2: The notification experiment
      </h2>
      <p style={p}>
        Marie sent her first push notification on a slow Wednesday afternoon:
        &ldquo;Double stamps today until 5pm&rdquo; The result:{" "}
        <strong>34 visits that afternoon</strong>, compared to the usual 12.
      </p>
      <p style={p}>
        &ldquo;I couldn&apos;t believe it,&rdquo; she says. &ldquo;These were people who&apos;d already been
        in that week. They came back for a second visit because their phone
        reminded them.&rdquo;
      </p>
      <p style={p}>
        Cost of that notification? €0. The equivalent SMS campaign would have
        cost €12-15.
      </p>

      <h2 className="font-display" style={h2}>
        Week 3: The numbers
      </h2>
      <p style={p}>By the end of week 3, the results were clear:</p>
      <ul style={ul}>
        <li style={li}>
          <strong>Revenue:</strong> +30% compared to the same 3 weeks last year
        </li>
        <li style={li}>
          <strong>Repeat visits:</strong> +45% (customers visiting 2+ times per
          week)
        </li>
        <li style={li}>
          <strong>Card completion rate:</strong> 38% (vs. ~10% with paper)
        </li>
        <li style={li}>
          <strong>Customer database:</strong> 312 contacts (from zero)
        </li>
        <li style={li}>
          <strong>Notification open rate:</strong> 67%
        </li>
      </ul>

      <h2 className="font-display" style={h2}>
        What made it work
      </h2>
      <h3 className="font-display" style={h3style}>
        Zero friction sign-up
      </h3>
      <p style={p}>
        No app download. No account creation. Scan QR → add to wallet → done.
        This is why 127 people signed up in week 1. If it had required an app,
        Marie estimates she&apos;d have gotten maybe 15.
      </p>
      <h3 className="font-display" style={h3style}>
        The notification channel
      </h3>
      <p style={p}>
        Being able to reach customers directly through their lock screen — for
        free — changed everything. Marie now sends 2-3 notifications per week:
        slow day promotions, new menu items, and &ldquo;you&apos;re X stamps away from a
        free coffee.&rdquo;
      </p>
      <h3 className="font-display" style={h3style}>
        Data-driven decisions
      </h3>
      <p style={p}>
        For the first time, Marie could see patterns. She learned that her best
        customers visit on Tuesday and Thursday mornings, that 60% of
        redemptions happen on Fridays, and that customers who get their 3rd
        stamp within 2 weeks almost always complete the card.
      </p>

      <h2 className="font-display" style={h2}>
        Marie&apos;s advice
      </h2>
      <blockquote style={blockquote}>
        &ldquo;Don&apos;t overthink it. Put the QR code at the counter, give them a free
        stamp for signing up, and let the system do the rest. The notifications
        bring people back. That&apos;s the whole game.&rdquo;
      </blockquote>

      <h2 className="font-display" style={h2}>
        The takeaway
      </h2>
      <p style={p}>
        Café Bloom didn&apos;t change their coffee, their menu, or their prices. They
        just gave customers a reason to come back — and a system to remind them.
        The result: 30% more revenue in 3 weeks, a growing customer database,
        and a marketing channel that costs nothing to use.
      </p>
    </>
  );
}

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
    author: {
      "@type": "Organization",
      name: "Fidely",
      url: "https://fidely.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Fidely",
      url: "https://fidely.com",
      logo: { "@type": "ImageObject", url: "https://fidely.com/favicon.svg" },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://fidely.com/blog/${post.slug}`,
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://fidely.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://fidely.com/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `https://fidely.com/blog/${post.slug}`,
      },
    ],
  };

  const articleContent: Record<string, React.ReactNode> = {
    "why-paper-loyalty-cards-are-costing-you-customers": <Article1 />,
    "how-cafe-bloom-increased-revenue-30-percent": <Article2 />,
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
      <div
        style={{ maxWidth: "720px", margin: "0 auto", padding: "0 24px" }}
      >
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
      </div>
    </article>
  );
}
