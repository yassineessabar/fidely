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

function Article3() {
  return (
    <>
      <p style={p}>
        Every business owner knows the drill: you want to reach your customers, so you pay. Google Ads, Instagram campaigns, SMS blasts — marketing costs money. But what if there was a channel that was completely free, had a 90%+ delivery rate, and landed directly on your customer&apos;s lock screen?
      </p>
      <p style={p}>
        That channel exists. It&apos;s called push notifications through Apple Wallet and Google Wallet. And it&apos;s about to change how you think about marketing.
      </p>

      <h2 className="font-display" style={h2}>The cost comparison</h2>
      <p style={p}>
        Let&apos;s look at what it costs to reach 1,000 customers through different channels:
      </p>
      <ul style={ul}>
        <li style={li}><strong>SMS:</strong> €50-80 per campaign (€0.05-0.08 per message)</li>
        <li style={li}><strong>Email:</strong> €20-50/month for a platform, plus time to design</li>
        <li style={li}><strong>Instagram/Facebook ads:</strong> €100-500+ per campaign</li>
        <li style={li}><strong>Google Ads:</strong> €200-1,000+ per campaign</li>
        <li style={li}><strong>Wallet push notifications:</strong> €0. Free. Always.</li>
      </ul>
      <p style={p}>
        That&apos;s not a typo. Push notifications through Apple Wallet and Google Wallet cost nothing to send. You can send them daily if you want. There&apos;s no per-message fee, no platform subscription, no ad spend.
      </p>

      <h2 className="font-display" style={h2}>Why wallet notifications outperform everything</h2>
      <h3 className="font-display" style={h3style}>They actually get seen</h3>
      <p style={p}>
        Email open rates average 20-25%. SMS gets 90%+ but costs money. Wallet push notifications have a <strong>delivery rate above 95%</strong> and appear directly on the lock screen — the same place texts and calls show up. They&apos;re almost impossible to miss.
      </p>
      <h3 className="font-display" style={h3style}>They&apos;re not spam</h3>
      <p style={p}>
        Customers opted in when they added your loyalty card to their wallet. They expect updates. A notification saying &ldquo;You&apos;re 2 stamps away from a free coffee&rdquo; isn&apos;t spam — it&apos;s a helpful reminder. This is permission-based marketing at its best.
      </p>
      <h3 className="font-display" style={h3style}>They drive immediate action</h3>
      <p style={p}>
        A &ldquo;Double points today!&rdquo; notification at 11am drives lunch traffic that same day. An &ldquo;Your reward expires tomorrow&rdquo; message creates urgency. These aren&apos;t brand awareness plays — they&apos;re direct response triggers that convert within hours.
      </p>

      <h2 className="font-display" style={h2}>What to send (and when)</h2>
      <p style={p}>
        The best-performing notification types for local businesses:
      </p>
      <ul style={ul}>
        <li style={li}><strong>Progress updates:</strong> &ldquo;You&apos;re 3 stamps away from a free reward!&rdquo; — drives completion</li>
        <li style={li}><strong>Slow day promotions:</strong> &ldquo;Double stamps today until 5pm&rdquo; — fills dead hours</li>
        <li style={li}><strong>New products:</strong> &ldquo;Try our new seasonal latte — this week only&rdquo; — creates urgency</li>
        <li style={li}><strong>Win-back:</strong> &ldquo;We haven&apos;t seen you in a while! Here&apos;s a bonus stamp&rdquo; — reactivates lapsed customers</li>
        <li style={li}><strong>Milestone celebrations:</strong> &ldquo;You just earned your 5th reward! 🎉&rdquo; — reinforces loyalty</li>
      </ul>

      <h2 className="font-display" style={h2}>The frequency sweet spot</h2>
      <p style={p}>
        Don&apos;t overdo it. <strong>2-3 notifications per week</strong> is the sweet spot for most local businesses. Enough to stay top-of-mind, not so much that customers mute you. The key is making every notification valuable — if a customer reads your message and thinks &ldquo;I&apos;m glad I saw that,&rdquo; you&apos;re doing it right.
      </p>

      <h2 className="font-display" style={h2}>The compound effect</h2>
      <p style={p}>
        Here&apos;s where it gets powerful. Every notification you send is free. So as your customer base grows from 100 to 500 to 2,000, your reach grows proportionally — but your cost stays at zero. Compare that to ads, where reaching more people means spending more money.
      </p>
      <p style={p}>
        After 6 months, a business with 1,000 wallet customers sending 2 notifications per week has sent 48,000 marketing messages. At SMS rates, that would have cost €2,400-3,800. With wallet notifications: €0.
      </p>

      <blockquote style={blockquote}>
        &ldquo;We used to spend €300/month on SMS campaigns. Now we reach the same customers through wallet notifications for free. That&apos;s €3,600/year back in our pocket.&rdquo;
      </blockquote>

      <h2 className="font-display" style={h2}>Getting started</h2>
      <p style={p}>
        The barrier to entry is surprisingly low. Set up a digital loyalty card through a wallet pass platform, get customers to add it (a QR code at the counter works perfectly), and you have a free marketing channel for life. No ongoing costs, no complicated campaigns, no ad algorithms to fight.
      </p>
      <p style={p}>
        In a world where customer acquisition costs keep rising, having a free, direct line to your existing customers isn&apos;t just nice to have — it&apos;s a competitive advantage.
      </p>
    </>
  );
}

function Article4() {
  return (
    <>
      <p style={p}>
        Acquiring a new customer costs 5-7x more than retaining an existing one. Yet most local businesses spend 80% of their marketing budget on acquisition and almost nothing on retention. Here are five strategies that flip that equation.
      </p>

      <h2 className="font-display" style={h2}>1. Make the second visit automatic</h2>
      <p style={p}>
        The hardest visit to get is the second one. A customer tries your restaurant, enjoys it, but never comes back — not because anything was wrong, but because they simply forgot. Life moved on.
      </p>
      <p style={p}>
        <strong>The fix:</strong> Capture customer info on the first visit and trigger an automatic follow-up within 48 hours. A simple &ldquo;Thanks for visiting! Here&apos;s a 10% off your next order&rdquo; message has a 15-25% conversion rate. Digital loyalty cards make this automatic — the moment they add the card, you can reach them.
      </p>

      <h2 className="font-display" style={h2}>2. Create a completion incentive</h2>
      <p style={p}>
        The &ldquo;buy 9, get 1 free&rdquo; model works because it creates a progress loop. Customers who are 70% toward a goal are <strong>3x more likely to complete it</strong> than customers who just started. This is called the &ldquo;endowed progress effect&rdquo; — and it&apos;s incredibly powerful.
      </p>
      <p style={p}>
        <strong>Pro tip:</strong> Give new customers their first stamp for free. Starting at 1/10 instead of 0/10 dramatically increases completion rates. It feels like they&apos;ve already made progress, which motivates them to continue.
      </p>

      <h2 className="font-display" style={h2}>3. Surprise and delight (strategically)</h2>
      <p style={p}>
        Random acts of generosity create powerful emotional connections. A free dessert on a customer&apos;s birthday. An unexpected &ldquo;You&apos;ve been our customer for a year — here&apos;s a bonus reward.&rdquo; These moments get talked about, shared on social media, and remembered.
      </p>
      <p style={p}>
        <strong>The key:</strong> Make it feel personal, not promotional. &ldquo;Happy birthday, Sarah! Your usual chai latte is on us today&rdquo; hits differently than &ldquo;Birthday promotion: 20% off all items.&rdquo;
      </p>

      <h2 className="font-display" style={h2}>4. Turn your best customers into VIPs</h2>
      <p style={p}>
        Your top 20% of customers generate 60-80% of your revenue. These people deserve special treatment — and they&apos;ll reward you for it with even more loyalty.
      </p>
      <p style={p}>
        <strong>How to do it:</strong> Create tiers. After 10 visits, customers unlock &ldquo;Gold&rdquo; status with perks: skip the line, early access to new items, a higher cashback rate. The tier itself costs you almost nothing, but the sense of exclusivity keeps high-value customers coming back.
      </p>

      <h2 className="font-display" style={h2}>5. Use data to predict and prevent churn</h2>
      <p style={p}>
        If a customer who usually visits every 5 days hasn&apos;t come in for 2 weeks, they&apos;re at risk of churning. With a digital loyalty system, you can see this pattern and act on it before it&apos;s too late.
      </p>
      <p style={p}>
        <strong>The playbook:</strong> Set up an automatic &ldquo;We miss you&rdquo; notification for customers who haven&apos;t visited in 2x their normal frequency. Include a small incentive: &ldquo;Come back this week and get double stamps.&rdquo; This simple automation recovers 15-20% of at-risk customers.
      </p>

      <h2 className="font-display" style={h2}>The math of retention</h2>
      <p style={p}>
        Let&apos;s make this concrete. Say you have 500 active customers with an average order of €15. If these strategies increase visit frequency by just one extra visit per month:
      </p>
      <ul style={ul}>
        <li style={li}>500 customers × 1 extra visit × €15 = <strong>€7,500/month in additional revenue</strong></li>
        <li style={li}>That&apos;s €90,000/year from retention alone</li>
        <li style={li}>Cost: a digital loyalty platform at €29-79/month</li>
      </ul>
      <p style={p}>
        The ROI isn&apos;t just good — it&apos;s absurd. Retention is the highest-leverage growth strategy any local business can deploy.
      </p>

      <blockquote style={blockquote}>
        &ldquo;We stopped spending on Facebook ads and put that energy into retaining existing customers. Revenue went up, not down. Turns out the customers we already had were the growth opportunity.&rdquo;
      </blockquote>
    </>
  );
}

function Article5() {
  return (
    <>
      <p style={p}>
        &ldquo;We should build an app.&rdquo; Every business owner has heard this advice. And for most local businesses, it&apos;s the worst possible investment they could make. Here&apos;s why Apple Wallet (and Google Wallet) is a better bet than any custom app.
      </p>

      <h2 className="font-display" style={h2}>The app graveyard</h2>
      <p style={p}>
        The average smartphone user has 80 apps installed but only uses 9 daily. The rest? They sit untouched, draining storage, until the phone suggests deleting them. For local businesses, the numbers are even worse:
      </p>
      <ul style={ul}>
        <li style={li}><strong>77% of users</strong> never use an app again after 72 hours</li>
        <li style={li}><strong>95% of apps</strong> are abandoned within 30 days</li>
        <li style={li}><strong>The average cost</strong> to build a basic app: €15,000-50,000</li>
        <li style={li}><strong>Ongoing maintenance:</strong> €3,000-10,000/year</li>
      </ul>
      <p style={p}>
        So you spend €20,000+ on an app that 95% of your customers will stop using within a month. That&apos;s not a growth strategy — that&apos;s an expensive mistake.
      </p>

      <h2 className="font-display" style={h2}>The wallet advantage</h2>
      <p style={p}>
        Apple Wallet and Google Wallet are pre-installed on every iPhone and Android phone. Your customers already have them. Here&apos;s what that means:
      </p>
      <h3 className="font-display" style={h3style}>Zero download friction</h3>
      <p style={p}>
        Adding a wallet pass takes 2 taps. No app store visit, no 50MB download, no account creation, no password to remember. The difference in conversion is staggering: <strong>wallet passes see 70-80% adoption rates</strong>, while apps struggle to hit 5-10%.
      </p>
      <h3 className="font-display" style={h3style}>They never get deleted</h3>
      <p style={p}>
        You can&apos;t uninstall Apple Wallet. Your loyalty card lives there permanently, alongside boarding passes, concert tickets, and credit cards. When&apos;s the last time you cleaned out your wallet app? Exactly.
      </p>
      <h3 className="font-display" style={h3style}>Lock screen presence</h3>
      <p style={p}>
        Wallet passes can appear on the lock screen based on time or location. Walk near a participating store? Your loyalty card pops up. This kind of contextual reminder is powerful — and it&apos;s built into the OS for free.
      </p>
      <h3 className="font-display" style={h3style}>Push notifications included</h3>
      <p style={p}>
        Just like apps, wallet passes can send push notifications. The difference: customers are far more likely to keep notifications enabled for a wallet pass (it feels like a card update) than for an app (which feels like marketing spam).
      </p>

      <h2 className="font-display" style={h2}>When does an app make sense?</h2>
      <p style={p}>
        To be fair, apps do make sense in some cases. If you&apos;re Starbucks with 30,000 locations and need mobile ordering, payment integration, and a content platform — yes, build an app. But if you&apos;re a local business with 1-10 locations and your goal is customer retention? A wallet pass does everything you need at a fraction of the cost.
      </p>

      <h2 className="font-display" style={h2}>The feature comparison</h2>
      <ul style={ul}>
        <li style={li}><strong>Loyalty tracking:</strong> Wallet ✓ — App ✓</li>
        <li style={li}><strong>Push notifications:</strong> Wallet ✓ — App ✓</li>
        <li style={li}><strong>Customer data collection:</strong> Wallet ✓ — App ✓</li>
        <li style={li}><strong>No download required:</strong> Wallet ✓ — App ✗</li>
        <li style={li}><strong>Setup cost:</strong> Wallet ~€30/month — App ~€20,000+</li>
        <li style={li}><strong>Time to launch:</strong> Wallet: 24 hours — App: 3-6 months</li>
        <li style={li}><strong>Adoption rate:</strong> Wallet: 70-80% — App: 5-10%</li>
      </ul>

      <h2 className="font-display" style={h2}>The bottom line</h2>
      <p style={p}>
        Your customers don&apos;t want another app on their phone. They want something that just works — invisibly, effortlessly, and without adding clutter to their home screen. Wallet passes deliver exactly that.
      </p>
      <p style={p}>
        Less is more. And in this case, less costs less too.
      </p>
    </>
  );
}

function Article6() {
  return (
    <>
      <p style={p}>
        You need customer data to grow your business. Your customers are increasingly wary of giving it away. This tension defines modern marketing — and most businesses handle it poorly. Here&apos;s how to do it right.
      </p>

      <h2 className="font-display" style={h2}>The value exchange</h2>
      <p style={p}>
        People will share their data when they get something valuable in return. The keyword is &ldquo;valuable&rdquo; — not just &ldquo;something.&rdquo; A 5% discount for signing up with your email doesn&apos;t cut it anymore. People are tired of trading their inbox for mediocre offers.
      </p>
      <p style={p}>
        What works in 2025:
      </p>
      <ul style={ul}>
        <li style={li}><strong>A digital loyalty card</strong> that tracks their progress toward a free reward</li>
        <li style={li}><strong>Instant gratification</strong> — a free stamp or bonus points just for signing up</li>
        <li style={li}><strong>Convenience</strong> — their loyalty info on their phone instead of a paper card</li>
        <li style={li}><strong>Relevant notifications</strong> — updates they actually want to receive</li>
      </ul>

      <h2 className="font-display" style={h2}>The wallet card approach</h2>
      <p style={p}>
        Digital wallet cards are the cleanest data collection mechanism available today. Here&apos;s why:
      </p>
      <h3 className="font-display" style={h3style}>It feels like getting a card, not giving data</h3>
      <p style={p}>
        When a customer adds a loyalty card to Apple Wallet, the mental model is &ldquo;I&apos;m getting something&rdquo; — not &ldquo;I&apos;m giving my information away.&rdquo; The card IS the value. The data collection is a byproduct, not the main event.
      </p>
      <h3 className="font-display" style={h3style}>You only collect what you need</h3>
      <p style={p}>
        A wallet card sign-up typically collects: name, email, phone number. That&apos;s it. No home address, no date of birth, no social media profiles. Just the minimum needed to identify the customer and communicate with them. This restraint builds trust.
      </p>
      <h3 className="font-display" style={h3style}>The data is immediately useful</h3>
      <p style={p}>
        Every data point you collect has a clear purpose. Name → personalized notifications. Email → receipts and account recovery. Phone → SMS backup. Visit history → understanding customer behavior. There&apos;s no &ldquo;nice to have&rdquo; data hoarding.
      </p>

      <h2 className="font-display" style={h2}>The three rules of ethical data collection</h2>
      <h3 className="font-display" style={h3style}>Rule 1: Be transparent</h3>
      <p style={p}>
        Tell customers exactly what you&apos;ll use their data for. &ldquo;We&apos;ll send you loyalty updates and occasional offers via push notification.&rdquo; That&apos;s it. No 40-page privacy policy written in legalese. Simple, honest, human language.
      </p>
      <h3 className="font-display" style={h3style}>Rule 2: Provide immediate value</h3>
      <p style={p}>
        The moment someone shares their data, they should get something back. A free stamp. A welcome bonus. A &ldquo;thanks for joining&rdquo; notification with a perk. Don&apos;t make them wait to see why sharing their info was worth it.
      </p>
      <h3 className="font-display" style={h3style}>Rule 3: Make opting out easy</h3>
      <p style={p}>
        If a customer wants to remove their card or stop receiving notifications, make it frictionless. One tap, done. The businesses that make it hard to leave are the ones that create resentment. The ones that make it easy to leave are the ones people choose to stay with.
      </p>

      <h2 className="font-display" style={h2}>What to do with the data</h2>
      <p style={p}>
        Once you have a customer database, the temptation is to &ldquo;blast&rdquo; everyone with promotions. Don&apos;t do that. Instead:
      </p>
      <ul style={ul}>
        <li style={li}><strong>Segment by behavior:</strong> Treat a customer who visits 3x/week differently from someone who came once 2 months ago</li>
        <li style={li}><strong>Personalize messages:</strong> &ldquo;Hey Sarah, you&apos;re 2 stamps away!&rdquo; beats &ldquo;Dear customer, complete your card!&rdquo;</li>
        <li style={li}><strong>Time it right:</strong> Send slow-day promotions on actual slow days. Don&apos;t message at midnight</li>
        <li style={li}><strong>Respect frequency:</strong> 2-3 messages per week max. Quality over quantity, always</li>
      </ul>

      <h2 className="font-display" style={h2}>The trust dividend</h2>
      <p style={p}>
        When you handle data ethically, something interesting happens: customers trust you more. They engage more with your messages. They share your loyalty program with friends. They become advocates, not just customers.
      </p>

      <blockquote style={blockquote}>
        &ldquo;We were nervous about asking for customer data. But when we offered a digital loyalty card, people gave us their info happily — because the card was genuinely useful to them. No tricks needed.&rdquo;
      </blockquote>

      <p style={p}>
        The best customer data strategy isn&apos;t about collecting more — it&apos;s about earning the right to collect at all. Give people a genuine reason, be honest about what you&apos;ll do with their information, and deliver on that promise. The data will follow.
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
    "push-notification-advantage-free-marketing": <Article3 />,
    "5-retention-strategies-every-local-business-should-know": <Article4 />,
    "apple-wallet-vs-apps-why-less-is-more": <Article5 />,
    "how-to-collect-customer-data-without-being-creepy": <Article6 />,
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
