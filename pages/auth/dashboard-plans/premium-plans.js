import React, { useEffect, useMemo, useState } from "react";
import getPaymentsData from "../../../components/auth/fetch_payments_data";
import AuthPreloader from "../includes/auth_preLoader";
import axios from "axios";
import {
  userHasMonthly,
  userHasPlan,
  userHasWeeklyOrMonthly,
} from "../../../components/auth/plan_entitlements";

const PLAN_DETAILS = [
  {
    duration: "1 Day · 3.5–5 Odds",
    blurb: "Daily VIP multibets from admin tickets",
    amount: 80,
    planType: "multibet",
    planTypeId: 56,
  },
  {
    duration: "1 Day · 10+ Odds",
    blurb: "Higher-odds day package",
    amount: 150,
    planType: "multibet2",
    planTypeId: 57,
  },
  {
    duration: "7 Days",
    blurb: "Full week of premium tips",
    amount: 500,
    planType: "multibet3",
    planTypeId: 58,
  },
  {
    duration: "1 Month",
    blurb: "Best value for regular punters",
    amount: 1500,
    planType: "multibet4",
    planTypeId: 59,
  },
];

const PremiumPlans = (props) => {
  const [loadingOnclick, setLoadingOnClick] = useState({});
  const [convertedAmounts, setConvertedAmounts] = useState({});
  const [currencySymbol, setCurrencySymbol] = useState("Ksh");
  const cartEnabled = props.countryCode === "KE" && typeof props.onToggleCart === "function";
  const selectedIds = props.selectedIds || [];

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        let targetCurrency = "KES";
        let symbol = "Ksh";
        if (props.countryCode === "UG") {
          targetCurrency = "UGX";
          symbol = "UGX";
        } else if (props.countryCode === "TZ") {
          targetCurrency = "TZS";
          symbol = "TZS";
        } else if (props.countryCode === "NG") {
          targetCurrency = "NGN";
          symbol = "₦";
        } else if (["CM", "CI", "GA", "ML", "SN", "MU", "BF", "GH", "ZM"].includes(props.countryCode)) {
          targetCurrency = "USD";
          symbol = "$";
        }

        const response = await axios.get("https://api.exchangerate-api.com/v4/latest/KES");
        const rate = response.data.rates[targetCurrency] || 1;
        const newAmounts = {};
        PLAN_DETAILS.forEach((detail) => {
          const baseAmount = detail.amount + (props.countryCode !== "KE" ? 20 : 0);
          newAmounts[detail.planType] = (baseAmount * rate).toFixed(0);
        });
        setConvertedAmounts(newAmounts);
        setCurrencySymbol(symbol);
      } catch (error) {
        console.error("Error fetching exchange rate:", error);
      }
    };
    fetchExchangeRates();
  }, [props.countryCode]);

  const hasMonthly = userHasMonthly(props.user);
  const hasWeeklyOrMonthly = userHasWeeklyOrMonthly(props.user);

  const visiblePlans = PLAN_DETAILS.filter((detail) => {
    if (hasMonthly) return detail.planTypeId === 59;
    if (hasWeeklyOrMonthly && detail.planTypeId === 56) return false;
    if (hasWeeklyOrMonthly && detail.planTypeId === 57) return false;
    return true;
  });

  const handleButtonClick = async (planType, key) => {
    setLoadingOnClick((prev) => ({ ...prev, [key]: true }));
    try {
      const response = await getPaymentsData(planType);
      const planId = response.data[0]?.id || "";
      if (!planId) {
        alert("Plan data not available.");
        return;
      }
      const paymentRoutes = {
        NG: "pay-ng",
        KE: "pay-ke",
        GH: "pay-usd",
        TZ: "pay-tz",
        UG: "pay-ug",
        ZM: "pay-usd",
      };
      const route = paymentRoutes[props.countryCode] || "pay-usd";
      window.location.href = `/auth/pay/${route}?plan=${planId}`;
    } catch (error) {
      console.error(error);
      alert("Failed to fetch payment data. Please try again.");
    } finally {
      setLoadingOnClick((prev) => ({ ...prev, [key]: false }));
    }
  };

  const handleViewPremiumVip = (planType) => {
    if (planType === "multibet2") window.location.href = "/auth/vip/10-Odds";
    else if (planType === "multibet") window.location.href = "/auth/vip/premium_multibets";
    else if (planType === "multibet3") window.location.href = "/auth/vip/weekly-monthly?plan=weekly";
    else if (planType === "multibet4") window.location.href = "/auth/vip/weekly-monthly?plan=monthly";
  };

  return (
    <section className="pp-plan-section">
      <div className="pp-section-head">
        <h2 className="pp-section-title">Premium multibets</h2>
        <p className="pp-section-copy">Daily, weekly, and monthly VIP tip packages.</p>
      </div>
      <div className="pp-plans-grid">
        {visiblePlans.map((detail) => {
          const isActive =
            userHasPlan(props.user, detail.planTypeId) ||
            (hasWeeklyOrMonthly && (detail.planTypeId === 58 || detail.planTypeId === 59));
          const price = convertedAmounts[detail.planType] || detail.amount;
          const selected = selectedIds.includes(detail.planTypeId);
          return (
            <article
              className={`pp-plan-card${selected ? " is-selected" : ""}${isActive ? " is-active" : ""}`}
              key={detail.planTypeId}
            >
              <div className="pp-plan-card-top">
                <span className="pp-plan-badge">Multibet</span>
                {selected ? <span className="pp-plan-check" aria-hidden="true">✓</span> : null}
              </div>
              <h4>{detail.duration}</h4>
              <p className="pp-plan-meta">{detail.blurb}</p>
              <p className="pp-plan-price">
                {currencySymbol} {Number(price).toLocaleString("en-US")}
              </p>
              <div className="pp-plan-actions">
                {isActive ? (
                  <button
                    type="button"
                    className="pp-pay-btn ghost"
                    onClick={() => handleViewPremiumVip(detail.planType)}
                  >
                    View tips
                  </button>
                ) : cartEnabled ? (
                  <button
                    type="button"
                    className={`pp-pay-btn${selected ? " selected" : ""}`}
                    onClick={() =>
                      props.onToggleCart({
                        id: detail.planTypeId,
                        label: detail.duration,
                        amount: Number(detail.amount),
                        kind: "multibet",
                        planType: detail.planType,
                      })
                    }
                  >
                    {selected ? "Remove" : "Add to cart"}
                  </button>
                ) : loadingOnclick[detail.planType] ? (
                  <AuthPreloader />
                ) : (
                  <button
                    type="button"
                    className="pp-pay-btn"
                    onClick={() => handleButtonClick(detail.planType, detail.planType)}
                  >
                    Pay now
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default PremiumPlans;
