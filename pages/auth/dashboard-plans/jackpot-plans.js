import React, { useState, useEffect } from "react";
import withAuth from "../checkAuth";
import getPaymentsData from "../../../components/auth/fetch_payments_data";
import AuthPreloader from "../includes/auth_preLoader";

const JackpotPlans = (props) => {
  const [loadingOnclick, setLoadingOnClick] = useState({});

  const plans = [
    {
      name: "Premium Jackpot Plans",
      details: [
        { duration: "Sportpesa Mega Jackpot", amount: 110, planType: "jackpot", borderColor: "black", id: 61 },
        { duration: "Sportpesa Midweek Jackpot", amount: 105, planType: "jackpot2", borderColor: "black", id: 62 },
        { duration: "Betika Midweek Jackpot", amount: 105, planType: "jackpot3", borderColor: "black", id: 63 },
        { duration: "Shabiki Midweek Jackpot", amount: 90, planType: "jackpot5", borderColor: "black", id: 65 },
      ],
    },
  ];

  const isJackpotActive = (planId) => {
    if (!props.user) return false;
    const { active_plan_id, subscription_start_date, subscription_end_date } = props.user;
  
    // Get today's date in YYYY-MM-DD format (in local timezone)
    const today = new Date().toLocaleDateString("en-CA"); // "en-CA" ensures YYYY-MM-DD format
  
    return (
      active_plan_id === planId &&
      subscription_start_date <= today &&
      subscription_end_date >= today
    );
  };  

  const isPremiumPlanActive = () => {
    if (!props.user) return false;
    const { active_plan_id, subscription_start_date, subscription_end_date } = props.user;
    const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
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
      if (planId) {
        window.location.href = `/auth/pay/pay-ke?plan=${planId}`;
      } else {
        alert("Plan data not available.");
      }
    } catch (error) {
      console.error("Error fetching payment data:", error);
      alert("Failed to fetch payment data. Please try again.");
    } finally {
      setLoadingOnClick((prev) => ({ ...prev, [key]: false }));
    }
  };

  const handleViewPremiumJackpot = (jackpotName) => {
    window.location.href = `/auth/vip/premium-jackpot-predictions?jackpot_name=${jackpotName}`;
  };
  
  const renderPlanTable = (plan) => (
    <React.Fragment key={plan.name}>
      <h3 className="font-weight-bold text-color-dark line-height-1">
        {plan.name}
      </h3>
      <div className="row d-flex flex-wrap justify-content-center">
        {plan.details.map((detail, index) => (
          <div key={index} className="col-md-3 col-12 mb-3">
            <div className="card-auth jackpot-box text-center" style={{ borderColor: detail.borderColor }}>
              <h5 className="jackpot-title">{detail.duration}</h5>
              {isPremiumPlanActive() || isJackpotActive(detail.id) ? (
                  <button
                    className="btn btn-3d btn-success rounded-0"
                    onClick={() => handleViewPremiumJackpot(detail.duration)}>
                    &nbsp;View Games&nbsp;
                  </button>
                ) : (
                  <>
                    <p className="jackpot-price">Price: Ksh {detail.amount}/-</p>
                    {loadingOnclick[index] ? (
                      <AuthPreloader />
                    ) : (
                      <button
                        className="btn btn-3d btn-danger rounded-0"
                        onClick={() => handleButtonClick(detail.planType, index)}>
                        &nbsp;Pay Now&nbsp;
                      </button>
                    )}
                  </>
                )}
            </div>
          </div>
        ))}
      </div>
    </React.Fragment>
  );
  
  return <>{plans.map(renderPlanTable)}</>;
};

export default withAuth(JackpotPlans);
