import { p, h2, h3style, ul, li, blockquote } from "./ArticleLayout";

export default function Article3() {
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
        <li style={li}><strong>SMS:</strong> $50-80 per campaign ($0.05-0.08 per message)</li>
        <li style={li}><strong>Email:</strong> $20-50/month for a platform, plus time to design</li>
        <li style={li}><strong>Instagram/Facebook ads:</strong> $100-500+ per campaign</li>
        <li style={li}><strong>Google Ads:</strong> $200-1,000+ per campaign</li>
        <li style={li}><strong>Wallet push notifications:</strong> $0. Free. Always.</li>
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
        After 6 months, a business with 1,000 wallet customers sending 2 notifications per week has sent 48,000 marketing messages. At SMS rates, that would have cost $2,400-3,800. With wallet notifications: $0.
      </p>

      <blockquote style={blockquote}>
        &ldquo;We used to spend $300/month on SMS campaigns. Now we reach the same customers through wallet notifications for free. That&apos;s $3,600/year back in our pocket.&rdquo;
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
