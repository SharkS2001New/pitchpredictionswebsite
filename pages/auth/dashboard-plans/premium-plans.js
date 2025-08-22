import React, { useState, useEffect } from "react";
import withAuth from "../checkAuth";
import getPaymentsData from "../../../components/auth/fetch_payments_data";
import AuthPreloader from "../includes/auth_preLoader";
import axios from "axios";

const PremiumPlan = (props) => {
  const [loadingOnclick, setLoadingOnClick] = useState({});
  const [convertedAmounts, setConvertedAmounts] = useState({});
  const [currencySymbol, setCurrencySymbol] = useState("Ksh");

  const plans = [
    {
      name: "Premium Package Plans",
      details: [
        { duration: "1 Day (3.5 - 5.0+ Odds)", amount: 80, planType: "multibet", planTypeId: 56, borderColor: "black" },
        { duration: "1 Day (10+ Odds)", amount: 150, planType: "multibet2", planTypeId: 57, borderColor: "black" },
        { duration: "7 Days (One Week)", amount: 500, planType: "multibet3", planTypeId: 58, borderColor: "black" },
        { duration: "1 Month (One Month)", amount: 1500, planType: "multibet4", planTypeId: 59, borderColor: "black" },
      ],
    },
  ];

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

        const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/KES`);
        const rate = response.data.rates[targetCurrency] || 1;

        const newAmounts = {};
        plans[0].details.forEach((detail) => {
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

  const handleButtonClick = async (planType, key) => {
    setLoadingOnClick((prev) => ({ ...prev, [key]: true }));
    try {
      const response = await getPaymentsData(planType);
      const planId = response.data[0]?.id || "";
      if (planId) {
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

  const handleViewPremiumVip = (planType) => {
    if (planType === "multibet2") {
      window.location.href = "/auth/vip/10-Odds";
    } else if (planType === "multibet") {
      window.location.href = "/auth/vip/premium_multibets";
    } else if (planType === "multibet3") {
      window.location.href = "/auth/vip/weekly-monthly?plan=weekly";
    } else if (planType === "multibet4") {
      window.location.href = "/auth/vip/weekly-monthly?plan=monthly";
    }
  };

  const checkIfExpired = () => {
    if (props.user?.subscription_end_date) {
      const today = new Date();
      const endDate = new Date(props.user.subscription_end_date);
      
      // Remove time from both dates to compare only the date part
      today.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
  
      return today > endDate; // Expired only if today is past endDate
    }
    return true; // Assume expired if no subscription data
  };  

  const renderPlanTable = (plan) => {
    const activePlanId = props.user?.active_plan_id;
    const isExpired = checkIfExpired();

    // Check if the Weekly Plan (58) is active and not expired
    const isWeeklyActive = activePlanId === 58 && !isExpired;

    // Check if the Monthly Plan (59) is the current selection
    const hasLongerPlanActive = !isExpired && (activePlanId === 58 || activePlanId === 59);
  
    // If the user has an active monthly plan (59) and it's not expired, hide all other plans
    if (activePlanId === 59 && !isExpired) {
      return (
        <div key="active-monthly-plan">
          <h3 className="font-weight-bold text-color-dark line-height-1">
            Premium Package Plans
          </h3>
          <div className="row">
            {plan.details
              .filter((detail) => detail.planTypeId === 59) // Only show the monthly plan
              .map((detail, index) => (
                <div key={index} className="col-md-3 col-12 mb-1">
                  <div className="card-auth plan-box" style={{ borderColor: detail.borderColor }}>
                    <h4 className="plan-title">{detail.duration}</h4>
                    <button
                      className="btn btn-3d btn-success rounded-0"
                      onClick={() => handleViewPremiumVip(detail.planType)}
                    >
                      &nbsp;View Games&nbsp;
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      );
    }

    return (
      <React.Fragment key={plan.name}>
        <h3 className="font-weight-bold text-color-dark line-height-1">{plan.name}</h3>
        <div className="row">
          {plan.details
            .filter((detail) => !(activePlanId === 59 && !isExpired)) // Hide all other plans if 59 is active
            .map((detail, index) => {
              const isActive = activePlanId === detail.planTypeId && !isExpired;
              const isExpiredPlan = activePlanId === detail.planTypeId && isExpired;
              const isUpgradePlan = isWeeklyActive && detail.planTypeId === 59;
  
            // Hide 1-Day Plans if a Weekly/Monthly Plan is active
            if (hasLongerPlanActive && (detail.planTypeId === 56 || detail.planTypeId === 57)) {
              return null;
            }

              return (
                <div key={index} className="col-md-3 col-12 mb-1">
                  <div className="card-auth plan-box" style={{ borderColor: detail.borderColor }}>
                    <h4 className="plan-title">{detail.duration}</h4>
  
                    {isActive ? (
                      <button
                        className="btn btn-3d btn-danger rounded-0"
                        onClick={() => handleViewPremiumVip(detail.planType)}
                      >
                        &nbsp;View Games&nbsp;
                      </button>
                    ) : (
                      <>
                        <p className="plan-price">
                          Payment Amount: {currencySymbol} {convertedAmounts[detail.planType] || "..."}
                        </p>
                        <ul className="plan-details">
                          <li className="mb-2">Premium Jackpots Tips Access</li>
                          <li>Receive Tips via SMS/Email</li>
                        </ul>
                        {loadingOnclick[index] ? (
                          <AuthPreloader />
                        ) : (
                          <button
                            className={`btn btn-3d rounded-0 ${
                              isExpiredPlan ? "btn-danger" : isUpgradePlan ? "btn-warning" : "btn-primary"
                            }`}
                            onClick={() => handleButtonClick(detail.planType, index)}>
                            &nbsp;
                            {isExpiredPlan ? (
                              <span style={{ color: "white" }}>Renew Plan</span>
                            ) : isUpgradePlan ? (
                              <span style={{ color: "black" }}>Upgrade Plan</span>
                            ) : (
                              "Subscribe Now"
                            )}
                            &nbsp;
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </React.Fragment>
    );
  };  

  return <React.Fragment>{plans.map(renderPlanTable)}</React.Fragment>;
};

export default withAuth(PremiumPlan);
