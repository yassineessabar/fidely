import { p, h2, h3style, ul, li } from "./ArticleLayout";

export default function Article5() {
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
