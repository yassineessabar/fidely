import { p, h2, h3style, ul, li, blockquote } from "./ArticleLayout";

export default function Article1() {
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
