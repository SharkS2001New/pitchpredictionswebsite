import React, { useEffect, useState } from "react";
import withAuth from "../checkAuth";
import { useRouter } from "next/router";
import nookies from "nookies";
import getAutoUpdatesData from "../../../components/auth/get_auto_updates_data";
import api from "../../../components/auth/api";

function PayKe() {
  const [user, setUser] = useState(null);
  const [autoUpdatesData, setAutoUpdatesData] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  const { plan } = router.query;
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    const cookies = nookies.get(null);
    if (cookies.user) {
      const userData = JSON.parse(cookies.user);
      setUser(userData);
    } else {
      router.push("/auth/login");
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      if (autoUpdatesData?.amount !== undefined && !isNaN(Number(autoUpdatesData?.amount))) {
        setAmount(Number(autoUpdatesData?.amount));
      } else {
        setAmount(0);
      }
    };
  
    loadData();
  }, [autoUpdatesData]);

  useEffect(() => {
    if (plan) {
      // Fetch auto updates data
      getAutoUpdatesData(plan)
        .then((response) => {
          setAutoUpdatesData(response.data[0]);
        })
        .catch((error) => console.error("Error fetching auto updates data:", error));
    }
  }, [plan]);
  
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isProcessing) {
        event.preventDefault();
        event.returnValue = "Payment is in progress. Are you sure you want to leave?";
      }
    };
  
    window.addEventListener("beforeunload", handleBeforeUnload);
  
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isProcessing]);
  

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Validate phone number
    if (!phoneNumber || !/^7\d{8}$/.test(phoneNumber)) {
      setError("Please input phone number in the format 7*******.");
      setIsProcessing(false);
      return;
    }

    try {
      // Call the STK Push API
      const stkPushResponse = await fetch("https://www.betsassured.com/api/payment/stk-push", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone_number: `0${phoneNumber}`,
          amount: autoUpdatesData?.amount,
          bet_type: "pitch",
          betslip_unique_id: "", 
          betslip_group: "", 
          tipster_mst_id: "", 
        }),
      });

      const stkPushResult = await stkPushResponse.json();

      if (stkPushResult.error) {
        setError(stkPushResult.error.errorMessage);
        setIsProcessing(false);
      } else if (stkPushResult.success) {
        setSuccess(stkPushResult.success.CustomerMessage);

        setSuccess(`Kindly check your phone on 0${phoneNumber} and enter your PIN to complete the transaction.`);

        setTimeout(() => {
          confirmPayment(`0${phoneNumber}`, autoUpdatesData?.amount);
        }, 25000);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Payment error:", err);
      setIsProcessing(false);
    }
  };

  const confirmPayment = async (custMpesaNumber, betAmount) => {
    setSuccess("Please wait while we confirm your payment.");
  
    try {
      const confirmationResponse = await fetch("https://www.betsassured.com/api/payment/confirmation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cust_mpesa_number: custMpesaNumber,
          bet_amount: betAmount,
          bet_type: "pitch",
          betslip_unique_id: "",
          bet_group: "",
          tipster_id: "",
        }),
      });
  
      const confirmationResult = await confirmationResponse.json();
  
      if (confirmationResult.message === "success") {
        setSuccess("Payment received. Tips have been sent via SMS.");
  
        const startDate = new Date(); // Today
        const endDate = new Date();

        if(parseInt(autoUpdatesData?.period) !=1){
          endDate.setDate(startDate.getDate() + parseInt(autoUpdatesData?.period));
        } 

        updateSubscription(
          user?.email,
          custMpesaNumber,
          autoUpdatesData?.id,
          autoUpdatesData?.plan_type,
          startDate.toISOString().split("T")[0], // Format YYYY-MM-DD
          endDate.toISOString().split("T")[0], // Format YYYY-MM-DD
          betAmount,
        );
      } else {
        setError("Ooops!!! No payment record found. Retry Payment.");
        setSuccess("");
      }
    } catch (err) {
      setError("An error occurred while confirming your payment.");
      console.error("Confirmation error:", err);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleUserDataRefresh = async () => {  
      // Perform the GET request to fetch updated user data
      const response = await api.get('/user');
  
      if (response.data) {
        // Store the updated user data in cookies
        nookies.set(null, 'user', JSON.stringify(response.data), { path: '/' });
      }
  };

  const updateSubscription = async (
    custEmail,
    custMpesaNumber,
    packageId,
    packageType,
    startDate,
    endDate,
    amountPaid
  ) => {
    setSuccess("Please wait while we update your subscription.");
    
    try {
      const updatedResponse = await fetch(
        "https://www.betsassured.com/api/pitch-prediction-subscription",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer_email: custEmail,
            phone_number: custMpesaNumber,
            package_id: packageId,
            package_type: packageType,
            start_date: startDate,
            end_date: endDate,
            amount_paid: amountPaid,
          }),
        }
      );
  
      await updatedResponse.json();
  
      setSuccess("New subscription created successfully.");
  
      // Ensure user data is refreshed before redirecting
      await handleUserDataRefresh();
  
      // Retrieve the updated user data from cookies after refresh
      const updatedUser = JSON.parse(nookies.get(null)?.user || "{}");
  
      // Perform redirection based on the updated active_plan_id
      switch (updatedUser?.active_plan_id) {
        case 56:
          window.location.href = "/auth/vip/premium_multibets";
          break;
        case 57:
          window.location.href = "/auth/vip/10-Odds";
          break;
        case 58:
          window.location.href = "/auth/vip/weekly-monthly?plan=weekly";
          break;
        case 59:
          window.location.href = "/auth/vip/weekly-monthly?plan=monthly";
          break;
        case 61:
          window.location.href =
            "/auth/vip/premium-jackpot-predictions?jackpot_name=Sportpesa Mega Jackpot";
          break;
        case 62:
          window.location.href =
            "/auth/vip/premium-jackpot-predictions?jackpot_name=Sportpesa Midweek Jackpot";
          break;
        case 63:
          window.location.href =
            "/auth/vip/premium-jackpot-predictions?jackpot_name=Betika Midweek Jackpot";
          break;
        case 64:
          window.location.href =
            "/auth/vip/premium-jackpot-predictions?jackpot_name=Mozart Super Daily Jackpot";
          break;
        case 65:
          window.location.href =
            "/auth/vip/premium-jackpot-predictions?jackpot_name=Shabiki Midweek Jackpot";
          break;
        default:
          // Redirect to dashboard
          window.location.replace("/auth/dashboard");
      }
    } catch (err) {
      setError("An error occurred while confirming your payment.");
      console.error("Confirmation error:", err);
    } finally {
      setIsProcessing(false);
    }
  };  

  return (
    <React.Fragment>
      <div className="container mb-5">
        <div className="row">
          <div className="col">
            <ul className="breadcrumb breadcrumb-dividers-no-opacity font-weight-bold text-6 justify-content-center my-4">
              <li className="text-transform-none me-2 vipPages" style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                <a href="/auth/plan" className="text-decoration-none text-color-primary text-color-hover-dark">
                  Change Package Plan
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6 col-12 mb-3">
            <div className="card border-width-3 border-radius-0 border-color-hover-dark">
              <div className="card-body">
                <p style={{ fontWeight: "bold", borderBottom: "1px solid #ccc", paddingBottom: "1rem", marginBottom: "1rem" }}>
                  Pay Via MPESA (Automatically View Games in 3 Seconds)
                </p>
                <div className="row mb-3 border-bottom text-start">
                  <span style={{ color: "#012970", fontWeight: "bold", fontSize: "large" }}>M-Pesa Payment</span>
                </div>
                <form className="needs-validation mb-3" noValidate onSubmit={handlePayment}>
                  <div className="mb-2">
                    <p style={{ color: "#012970", fontWeight: "bold", fontSize: "small" }}>
                      Enter your M-Pesa phone number and click on Buy button.
                    </p>
                  </div>
                  {success && (
                    <div className="alert alert-success mb-2" role="alert">
                      {success}
                    </div>
                  )}
                  {error && (
                    <div className="alert alert-danger mb-2" role="alert">
                      {error}
                    </div>
                  )}
                  <label className="form-label" style={{ fontWeight: "bold" }}>
                    Mpesa Number (Format: 7********)
                  </label>
                  <div className="input-group mb-3">
                    <span className="input-group-text" id="phone-prefix" style={{ fontWeight: "bold" }}>
                      +254
                    </span>
                    <input
                      id="txtMultibetMpesaNumber"
                      type="text"
                      className="form-control"
                      name="phone_number"
                      required
                      maxLength="9"
                      autoComplete="off"
                      pattern="7\d{8}"
                      title="Please enter a valid M-Pesa number starting with 7 and 9 digits long."
                      value={phoneNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, "");
                        setPhoneNumber(value);
                      }}
                    />
                    <div className="invalid-feedback">Please enter your M-Pesa phone number.</div>
                  </div>
                  <div className="input-group mb-3">
                    <div className="row">
                      <div className="col-11">                      
                      <button
                          type="submit"
                          className="btn btn-primary"
                          id="btnMultibetPayment"
                          disabled={isProcessing}>
                          {isProcessing ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Please wait
                            </>
                          ) : (
                            `Buy @ KES ${Number(amount)}`
                          )}
                        </button>
                      </div>
                      <div className="col-1">
                        <input type="hidden" id="txtMultibetBetslipCost" value={amount} />
                      </div>
                    </div>
                  </div>
                  {/* <div className="input-group" id="paymentInstructions" style={{ display: success ? "block" : "none" }}>
                    <p style={{ fontWeight: "bold", color: "red" }}>Please check your phone for payment notification.</p>
                  </div> */}
                </form>
              </div>
              <div className="border-bottom mb-3"></div>
                <div className="row container">
                    <div className="col-8">
                        <p style={{color:"#012970",fontWeight:"bold",fontSize:"small"}}>Have you paid and did not receive your tips via SMS?</p>
                    </div>
                    <div className="col-4">
                        {/* <a type="button" href="/find-my-tips" className="btn btn-outline-danger btn-sm" style={{fontSize:"smaller"}}>Click Here</a> */}
                        <a
                          href={`https://api.whatsapp.com/send/?phone=254111509962&text=${encodeURIComponent(
                            `Hello support, my name is ${user?.full_name || "N/A"} from Kenya, email: ${user?.email || "N/A"}, tel: ${user?.phone_number || "N/A"}. I just paid ${autoUpdatesData?.amount !== undefined ? 
                              `${autoUpdatesData?.sign} ${Number(autoUpdatesData?.amount).toLocaleString("en-US")}` 
                              : "Loading..."} for ${autoUpdatesData?.subject_include || "your service"}. Kindly confirm the payment and send me the games via WhatsApp.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-success btn-sm"
                          style={{
                            whiteSpace: "nowrap",
                            marginLeft: "10px",
                            fontWeight: "bold",
                          }}>
                            <i className="bi bi-whatsapp"></i>&nbsp;WhatsApp
                        </a>
                    </div>
                </div>
            </div>
          </div>
          <div className="col-lg-6 col-12">
            <div className="card border-width-3 border-radius-0 border-color-hover-dark">
              <div className="card-body">
                <p style={{ fontWeight: "bold", borderBottom: "1px solid #ccc", paddingBottom: "1rem", marginBottom: "1rem" }}>
                  Pay Via Mpesa Manually: (Support will confirm your payment and approve you)
                </p>
                <ol className="space-y-4">
                  <li>To Get Premium Winning Tips: @ <strong>KES {Number(autoUpdatesData?.amount).toLocaleString("en-US")}</strong></li>
                  <li>Go to LIPA NA MPESA</li>
                  <li>Select BUY GOODS AND SERVICES</li>
                  <li> Enter MPESA Till No:  <strong>8881950</strong></li>
                  <li>Enter the amount <strong>{amount !== null ? `KSH ${Number(amount).toLocaleString("en-US")}` : "Loading..."}</strong> and confirm (ALPAC SOFTWARE SOLUTIONS)</li>
                </ol>
                <br/>
                <p>
                  For more information contact support via SMS/WhatsApp: <strong>+254111509962</strong> or Click here:
                  <a
                    href={`https://api.whatsapp.com/send/?phone=254111509962&text=${encodeURIComponent(
                      `Hello support, my name is ${user?.full_name || "N/A"} from Kenya, email: ${user?.email || "N/A"}, tel: ${user?.phone_number || "N/A"}. I just paid ${autoUpdatesData?.amount !== undefined ? 
                        `${autoUpdatesData?.sign} ${Number(autoUpdatesData?.amount).toLocaleString("en-US")}` 
                        : "Loading..."} for ${autoUpdatesData?.subject_include || "your service"}. Kindly confirm the payment and send me the games via WhatsApp.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-success btn-sm"
                    style={{
                      whiteSpace: "nowrap",
                      marginLeft: "10px",
                      fontWeight: "bold",
                    }}>
                      <i className="bi bi-whatsapp"></i>&nbsp;WhatsApp
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default withAuth(PayKe);