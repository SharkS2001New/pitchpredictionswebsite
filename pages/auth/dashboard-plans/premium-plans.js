import React, { useEffect, useMemo, useState } from "react";
import getPaymentsData from "../../../components/auth/fetch_payments_data";
import AuthPreloader from "../includes/auth_preLoader";
import axios from "axios";

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

  const isExpired = useMemo(() => {
    if (!props.user?.subscription_end_date) return true;
    const today = new Date();
    const endDate = new Date(props.user.subscription_end_date);
    today.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    return today > endDate;
  }, [props.user]);

  const activePlanId = props.user?.active_plan_id;
  const hasMonthly = activePlanId === 59 && !isExpired;
  const hasWeeklyOrMonthly = !isExpired && (activePlanId === 58 || activePlanId === 59);

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
    <section>
      <h2 className="pp-section-title">Premium package plans</h2>
      <div className="pp-plans-grid">
        {visiblePlans.map((detail) => {
          const isActive = !isExpired && activePlanId === detail.planTypeId;
          const price = convertedAmounts[detail.planType] || detail.amount;
          return (
            <article className="pp-plan-card" key={detail.planTypeId}>
              <h4>{detail.duration}</h4>
              <p className="pp-plan-meta">{detail.blurb}</p>
              <p className="pp-plan-price">
                {currencySymbol} {Number(price).toLocaleString("en-US")}
              </p>
              <div className="pp-plan-actions">
                {isActive || (hasWeeklyOrMonthly && (detail.planTypeId === 58 || detail.planTypeId === 59)) ? (
                  <button
                    type="button"
                    className="pp-pay-btn ghost"
                    onClick={() => handleViewPremiumVip(detail.planType)}
                  >
                    View tips
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
