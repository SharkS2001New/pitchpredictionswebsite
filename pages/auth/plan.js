import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AuthPreloader from "./includes/auth_preLoader";
import getUserIp from "../../components/auth/get_user_ip";
import getCountryByIp from "../../components/auth/get_country_by_ip";
import PremiumPlans from "./dashboard-plans/premium-plans";
import JackpotPlans from "./dashboard-plans/jackpot-plans";
import nookies from "nookies";

const SITE = "pitch";
const BRAND = "Pitch Predictions";

export default function PlanPage() {
  const [countryCode, setCountryCode] = useState(null);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const cookies = nookies.get(null);
    if (cookies.user) {
      setUser(JSON.parse(cookies.user));
    } else {
      router.push("/auth/login");
    }
  }, [router]);

  useEffect(() => {
    async function fetchData() {
      try {
        const ip = await getUserIp();
        const code = ip ? await getCountryByIp(ip) : "KE";
        setCountryCode(code || "KE");
      } catch (e) {
        setCountryCode("KE");
      }
    }
    fetchData();
  }, []);

  if (!countryCode || !user) {
    return (
      <div className="row justify-content-center" style={{ height: "420px" }}>
        <AuthPreloader />
      </div>
    );
  }

  return (
    <div className="pp-pay" data-site={SITE}>
      <div className="pp-pay-shell">
        <a className="pp-pay-back" href="/auth/dashboard">
          ← Back to dashboard
        </a>
        <div className="pp-pay-hero">
          <div className="pp-pay-kicker">{BRAND} · VIP store</div>
          <h1 className="pp-pay-title">Choose your tips plan</h1>
          <p className="pp-pay-subtitle">
            Pay securely with M-Pesa in Kenya. Your subscription unlocks premium tips on this site only.
          </p>
        </div>

        {countryCode === "KE" ? (
          <JackpotPlans countryCode={countryCode} user={user} />
        ) : null}
        <PremiumPlans countryCode={countryCode} user={user} />
      </div>
    </div>
  );
}
