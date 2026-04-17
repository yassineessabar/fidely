let cachedPlan: string | null = null;
let fetchPromise: Promise<string> | null = null;

export function getCachedPlan(): string | null {
  return cachedPlan;
}

export async function fetchPlan(): Promise<string> {
  if (cachedPlan) return cachedPlan;
  if (fetchPromise) return fetchPromise;

  fetchPromise = fetch("/api/merchant/plan")
    .then((r) => r.json())
    .then((d) => {
      cachedPlan = d?.plan || "free";
      fetchPromise = null;
      return cachedPlan!;
    })
    .catch(() => {
      fetchPromise = null;
      return "free";
    });

  return fetchPromise;
}

export function invalidatePlanCache() {
  cachedPlan = null;
  fetchPromise = null;
}
