import React, { useState } from "react";
import getPaymentsData from "../../../components/auth/fetch_payments_data";
import AuthPreloader from "../includes/auth_preLoader";
import { userHasPlan, userHasWeeklyOrMonthly } from "../../../components/auth/plan_entitlements";

const JACKPOTS = [
  { duration: "Sportpesa Mega Jackpot", amount: 110, planType: "jackpot", id: 61 },
  { duration: "Sportpesa Midweek Jackpot", amount: 105, planType: "jackpot2", id: 62 },
  { duration: "Betika Midweek Jackpot", amount: 105, planType: "jackpot3", id: 63 },
  { duration: "Shabiki Midweek Jackpot", amount: 90, planType: "jackpot5", id: 65 },
];

const JackpotPlans = (props) => {
  const [loadingOnclick, setLoadingOnClick] = useState({});
  const cartEnabled = props.countryCode === "KE" && typeof props.onToggleCart === "function";
  const selectedIds = props.selectedIds || [];

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
    <section className="pp-plan-section">
      <div className="pp-section-head">
        <h2 className="pp-section-title">Premium jackpots</h2>
        <p className="pp-section-copy">Add a jackpot ticket with your multibet in one checkout.</p>
      </div>
      <div className="pp-plans-grid">
        {JACKPOTS.map((detail) => {
          const active = userHasPlan(props.user, detail.id) || userHasWeeklyOrMonthly(props.user);
          const selected = selectedIds.includes(detail.id);
          return (
            <article
              className={`pp-plan-card${selected ? " is-selected" : ""}${active ? " is-active" : ""}`}
              key={detail.id}
            >
              <div className="pp-plan-card-top">
                <span className="pp-plan-badge jackpot">Jackpot</span>
                {selected ? <span className="pp-plan-check" aria-hidden="true">✓</span> : null}
              </div>
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
                ) : cartEnabled ? (
                  <button
                    type="button"
                    className={`pp-pay-btn${selected ? " selected" : ""}`}
                    onClick={() =>
                      props.onToggleCart({
                        id: detail.id,
                        label: detail.duration,
                        amount: Number(detail.amount),
                        kind: "jackpot",
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

export default JackpotPlans;
