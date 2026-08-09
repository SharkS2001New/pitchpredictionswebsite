/**
 * Shared VIP entitlement helpers for plan store / checkout.
 */

export function parseActivePlanIds(user) {
  if (!user) return [];
  const ids = [];
  const raw = user.active_plan_ids;
  if (Array.isArray(raw)) {
    raw.forEach((id) => ids.push(Number(id)));
  } else if (typeof raw === "string" && raw.trim() !== "") {
    try {
      const decoded = JSON.parse(raw);
      if (Array.isArray(decoded)) {
        decoded.forEach((id) => ids.push(Number(id)));
      }
    } catch {
      // ignore
    }
  }
  if (user.active_plan_id) {
    ids.push(Number(user.active_plan_id));
  }
  return [...new Set(ids.filter((id) => Number.isFinite(id) && id > 0))];
}

export function subscriptionStillValid(user) {
  if (!user?.subscription_end_date) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(user.subscription_end_date);
  end.setHours(0, 0, 0, 0);
  return end >= today;
}

const JACKPOT_IDS = new Set([61, 62, 63, 64, 65]);
const WEEKLY_MONTHLY = new Set([58, 59]);

export function userHasPlan(user, planId) {
  if (!user || !subscriptionStillValid(user)) return false;
  const id = Number(planId);
  const ids = parseActivePlanIds(user);
  if (ids.includes(id)) return true;
  // Weekly / monthly still unlock jackpot tickets
  if (JACKPOT_IDS.has(id) && ids.some((x) => WEEKLY_MONTHLY.has(x))) {
    return true;
  }
  return false;
}

export function userHasWeeklyOrMonthly(user) {
  if (!subscriptionStillValid(user)) return false;
  return parseActivePlanIds(user).some((id) => WEEKLY_MONTHLY.has(id));
}

export function userHasMonthly(user) {
  if (!subscriptionStillValid(user)) return false;
  return parseActivePlanIds(user).includes(59);
}
