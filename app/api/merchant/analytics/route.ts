import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("business_id")
    .eq("id", user.id)
    .single();
  if (!profile?.business_id) return NextResponse.json({ error: "No business" }, { status: 403 });

  const admin = createAdminClient();
  const businessId = profile.business_id;

  // Get merchant's cards
  const { data: cards } = await admin
    .from("loyalty_cards")
    .select("id, name, type, status, logic, created_at")
    .eq("business_id", businessId);

  const cardIds = (cards || []).map((c: any) => c.id);

  if (cardIds.length === 0) {
    return NextResponse.json({
      enrollmentsByMonth: [],
      cardBreakdown: [],
      topCustomers: [],
      stampDistribution: [],
      totalEnrollments: 0,
      activeRate: 0,
      avgStamps: 0,
      avgPoints: 0,
    });
  }

  // Get all enrollments
  const { data: enrollments } = await admin
    .from("card_enrollments" as any)
    .select("id, card_id, customer_name, customer_email, stamps_collected, points_balance, status, created_at")
    .in("card_id", cardIds)
    .order("created_at", { ascending: true });

  const allEnrollments = (enrollments || []) as any[];
  const activeEnrollments = allEnrollments.filter((e) => e.status === "active");

  // Enrollments by month (last 6 months)
  const now = new Date();
  const monthLabels: string[] = [];
  const monthCounts: number[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = d.toLocaleDateString("en-AU", { month: "short" });
    const year = d.getFullYear();
    const month = d.getMonth();
    const count = allEnrollments.filter((e) => {
      const created = new Date(e.created_at);
      return created.getFullYear() === year && created.getMonth() === month;
    }).length;
    monthLabels.push(label);
    monthCounts.push(count);
  }

  // Card breakdown (enrollments per card)
  const cardMap = Object.fromEntries((cards || []).map((c: any) => [c.id, c]));
  const cardBreakdown = (cards || []).map((c: any) => ({
    name: c.name,
    type: c.type,
    status: c.status,
    members: allEnrollments.filter((e) => e.card_id === c.id).length,
    active: allEnrollments.filter((e) => e.card_id === c.id && e.status === "active").length,
  }));

  // Top customers by stamps or points
  const topCustomers = [...allEnrollments]
    .sort((a, b) => (b.stamps_collected + b.points_balance) - (a.stamps_collected + a.points_balance))
    .slice(0, 10)
    .map((e) => ({
      name: e.customer_name,
      email: e.customer_email,
      stamps: e.stamps_collected,
      points: e.points_balance,
      card: cardMap[e.card_id]?.name || "Unknown",
      status: e.status,
    }));

  // Stamp distribution (how many customers have 0, 1-3, 4-6, 7-9, 10 stamps)
  const stampCards = (cards || []).filter((c: any) => c.type === "stamp");
  const stampCardIds = stampCards.map((c: any) => c.id);
  const stampEnrollments = allEnrollments.filter((e) => stampCardIds.includes(e.card_id));
  const stampDistribution = [
    { label: "0 stamps", count: stampEnrollments.filter((e) => e.stamps_collected === 0).length },
    { label: "1-3 stamps", count: stampEnrollments.filter((e) => e.stamps_collected >= 1 && e.stamps_collected <= 3).length },
    { label: "4-6 stamps", count: stampEnrollments.filter((e) => e.stamps_collected >= 4 && e.stamps_collected <= 6).length },
    { label: "7-9 stamps", count: stampEnrollments.filter((e) => e.stamps_collected >= 7 && e.stamps_collected <= 9).length },
    { label: "10+ stamps", count: stampEnrollments.filter((e) => e.stamps_collected >= 10).length },
  ];

  // Averages
  const avgStamps = stampEnrollments.length > 0
    ? Math.round((stampEnrollments.reduce((sum, e) => sum + e.stamps_collected, 0) / stampEnrollments.length) * 10) / 10
    : 0;
  const pointsEnrollments = allEnrollments.filter((e) => {
    const card = cardMap[e.card_id];
    return card?.type === "points";
  });
  const avgPoints = pointsEnrollments.length > 0
    ? Math.round(pointsEnrollments.reduce((sum, e) => sum + e.points_balance, 0) / pointsEnrollments.length)
    : 0;

  return NextResponse.json({
    enrollmentsByMonth: monthLabels.map((label, i) => ({ month: label, count: monthCounts[i] })),
    cardBreakdown,
    topCustomers,
    stampDistribution,
    totalEnrollments: allEnrollments.length,
    activeRate: allEnrollments.length > 0 ? Math.round((activeEnrollments.length / allEnrollments.length) * 100) : 0,
    avgStamps,
    avgPoints,
  });
}
