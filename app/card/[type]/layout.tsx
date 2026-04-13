import { Metadata } from "next";

const passMetadata: Record<string, { title: string; description: string }> = {
  punch: {
    title: "Punch Card — Buy 9, Get the 10th Free",
    description: "Digital punch card for Apple & Google Wallet. Collect stamps with every visit and earn free rewards. No paper card needed.",
  },
  reward: {
    title: "Reward Card — Earn Points, Unlock Rewards",
    description: "Digital reward card for Apple & Google Wallet. Earn points with every purchase and redeem exclusive rewards.",
  },
  membership: {
    title: "Membership Card — Your VIP Access Pass",
    description: "Digital membership card for Apple & Google Wallet. Unlock member-only benefits, priority access, and exclusive perks.",
  },
  cashback: {
    title: "Cashback Card — Get Money Back on Every Visit",
    description: "Digital cashback card for Apple & Google Wallet. Earn cashback on every purchase, redeemable on your next visit.",
  },
  discount: {
    title: "Discount Card — Exclusive Discounts, Always",
    description: "Digital discount card for Apple & Google Wallet. Present your card for instant discounts on every purchase.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: { type: string };
}): Promise<Metadata> {
  const type = params.type;
  const meta = passMetadata[type] || passMetadata.punch;

  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: `/card/${type}` },
    openGraph: {
      title: `${meta.title} | Fidely`,
      description: meta.description,
      url: `/card/${type}`,
    },
  };
}

export default function CardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
