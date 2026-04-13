import { p, h2, h3style, ul, li, blockquote } from "./ArticleLayout";

export default function Article2() {
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
