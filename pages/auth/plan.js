import { useEffect, useMemo, useState } from "react";
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
  const [cart, setCart] = useState([]);
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

  const selectedIds = useMemo(() => cart.map((item) => item.id), [cart]);
  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + Number(item.amount || 0), 0),
    [cart]
  );

  const onToggleCart = (item) => {
    setCart((prev) => {
      const exists = prev.some((row) => row.id === item.id);
      if (exists) return prev.filter((row) => row.id !== item.id);
      return [...prev, item];
    });
  };

  const checkout = () => {
    if (!cart.length) return;
    const ids = cart.map((item) => item.id).join(",");
    window.location.href = `/auth/pay/pay-ke?plans=${ids}`;
  };

  if (!countryCode || !user) {
    return (
      <div className="row justify-content-center" style={{ height: "420px" }}>
        <AuthPreloader />
      </div>
    );
  }

  return (
    <div className={`pp-pay${cart.length ? " has-cart" : ""}`} data-site={SITE}>
      <div className="pp-pay-atmosphere" aria-hidden="true" />
      <div className="pp-pay-shell">
        <a className="pp-pay-back" href="/auth/dashboard">
          ← Back to dashboard
        </a>
        <div className="pp-pay-hero">
          <div className="pp-pay-kicker">{BRAND} · VIP store</div>
          <h1 className="pp-pay-title">Build your tip pack</h1>
          <p className="pp-pay-subtitle">
            Mix jackpot and multibet plans in one cart. Kenya M-Pesa unlocks everything together in a single STK push.
          </p>
        </div>

        {countryCode === "KE" ? (
          <JackpotPlans
            countryCode={countryCode}
            user={user}
            selectedIds={selectedIds}
            onToggleCart={onToggleCart}
          />
        ) : null}
        <PremiumPlans
          countryCode={countryCode}
          user={user}
          selectedIds={selectedIds}
          onToggleCart={countryCode === "KE" ? onToggleCart : undefined}
        />
      </div>

      {countryCode === "KE" && cart.length > 0 ? (
        <div className="pp-cart-bar" role="region" aria-label="Checkout cart">
          <div className="pp-cart-bar-inner">
            <div className="pp-cart-summary">
              <strong>
                {cart.length} plan{cart.length === 1 ? "" : "s"}
              </strong>
              <span>KES {cartTotal.toLocaleString("en-US")}</span>
              <div className="pp-cart-chips">
                {cart.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="pp-cart-chip"
                    onClick={() => onToggleCart(item)}
                    title="Remove"
                  >
                    {item.label} ×
                  </button>
                ))}
              </div>
            </div>
            <button type="button" className="pp-pay-btn pp-cart-checkout" onClick={checkout}>
              Checkout
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
