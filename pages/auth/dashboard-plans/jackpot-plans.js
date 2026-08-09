import React, { useState } from "react";
import getPaymentsData from "../../../components/auth/fetch_payments_data";
import AuthPreloader from "../includes/auth_preLoader";

const JACKPOTS = [
  { duration: "Sportpesa Mega Jackpot", amount: 110, planType: "jackpot", id: 61 },
  { duration: "Sportpesa Midweek Jackpot", amount: 105, planType: "jackpot2", id: 62 },
  { duration: "Betika Midweek Jackpot", amount: 105, planType: "jackpot3", id: 63 },
  { duration: "Shabiki Midweek Jackpot", amount: 90, planType: "jackpot5", id: 65 },
];

const JackpotPlans = (props) => {
  const [loadingOnclick, setLoadingOnClick] = useState({});

  const isJackpotActive = (planId) => {
    if (!props.user) return false;
    const { active_plan_id, subscription_start_date, subscription_end_date } = props.user;
    const today = new Date().toLocaleDateString("en-CA");
    return (
      active_plan_id === planId &&
      subscription_start_date <= today &&
      subscription_end_date >= today
    );
  };

  const isPremiumPlanActive = () => {
    if (!props.user) return false;
    const { active_plan_id, subscription_start_date, subscription_end_date } = props.user;
    const today = new Date().toISOString().split("T")[0];
    return (
      (active_plan_id === 58 || active_plan_id === 59) &&
      subscription_start_date <= today &&
      subscription_end_date >= today
    );
  };

  const handleButtonClick = async (planType, key) => {
    setLoadingOnClick((prev) => ({ ...prev, [key]: true }));
    try {
      const response = await getPaymentsData(planType);
      const planId = response.data[0]?.id || "";
      if (!planId) {
        alert("Plan data not available.");
        return;
      }
      window.location.href = `/auth/pay/pay-ke?plan=${planId}`;
    } catch (error) {
      console.error(error);
      alert("Failed to fetch payment data. Please try again.");
    } finally {
      setLoadingOnClick((prev) => ({ ...prev, [key]: false }));
    }
  };

  return (
    <section>
      <h2 className="pp-section-title">Premium jackpot plans</h2>
      <div className="pp-plans-grid">
        {JACKPOTS.map((detail) => {
          const active = isPremiumPlanActive() || isJackpotActive(detail.id);
          return (
            <article className="pp-plan-card" key={detail.id}>
              <h4>{detail.duration}</h4>
              <p className="pp-plan-meta">Kenya jackpot ticket access</p>
              <p className="pp-plan-price">Ksh {detail.amount.toLocaleString("en-US")}</p>
              <div className="pp-plan-actions">
                {active ? (
                  <button
                    type="button"
                    className="pp-pay-btn ghost"
                    onClick={() => {
                      window.location.href = `/auth/vip/premium-jackpot-predictions?jackpot_name=${encodeURIComponent(detail.duration)}`;
                    }}
                  >
                    View jackpot
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

export default JackpotPlans;
