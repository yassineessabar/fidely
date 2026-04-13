import { p, h2, ul, li, blockquote } from "./ArticleLayout";

export default function Article4() {
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
