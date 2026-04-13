import { p, h2, h3style, ul, li, blockquote } from "./ArticleLayout";

export default function Article6() {
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
