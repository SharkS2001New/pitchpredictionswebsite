import React, { useEffect, useState } from "react";
import withAuth from "../checkAuth";
import { useRouter } from "next/router";
import nookies from "nookies";
import axios from "axios"; // Import axios for fetching exchange rates
import getAutoUpdatesData from "../../../components/auth/get_auto_updates_data";
import PayViaPaypal from "./paypal-payment";
import SendEmail from "../../../components/auth/send_notification_email";

function PayUSD() {
  const [user, setUser] = useState(null);
  const [autoUpdatesData, setAutoUpdatesData] = useState([]);
  const [convertedAmount, setConvertedAmount] = useState(null);
  const router = useRouter();
  const { plan } = router.query;

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
    if (plan) {
      getAutoUpdatesData(plan)
        .then((response) => setAutoUpdatesData(response.data[0]))
        .catch((error) => console.error("Error fetching transaction logs:", error));
    }
  }, [plan]);

  useEffect(() => {
    const fetchExchangeRate = async () => {
      if (autoUpdatesData.amount !== undefined) {
        try {
          const response = await axios.get("https://api.exchangerate-api.com/v4/latest/KES");
          const usdRate = response.data.rates.USD || 1; // Default to 1 if rate is missing
          const converted = ((autoUpdatesData.amount + 20) * usdRate).toFixed(2);
          setConvertedAmount(converted);
        } catch (error) {
          console.error("Error fetching exchange rate:", error);
        }
      }
    };

    fetchExchangeRate();
  }, [autoUpdatesData.amount]);

  return (
    <React.Fragment>
      <div className="container mb-5">
        <div className="row mb-1">
          <div className="col">
            <ul className="breadcrumb breadcrumb-dividers-no-opacity font-weight-bold text-6 justify-content-center my-5">
              <li className="text-transform-none me-2 vipPages" style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                <a href="/auth/plan" className="text-decoration-none text-color-primary text-color-hover-dark">
                  Change Package Plan
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6 col-12">
            <div className="card border-width-3 border-radius-0 border-color-hover-dark">
              <div className="card-body">
                <h5 className="font-weight-bold text-uppercase text-4 mb-3" style={{ textAlign: "left", fontWeight: "bold" }}>
                  Pay Via PayPal
                </h5>
                <div className="shop_table cart-totals mb-3">
                  <div className="shop_table cart-totals mb-3" style={{ textAlign: "left" }}>
                    <div className="row" style={{ borderBottom: "1px solid #ccc", paddingBottom: "1rem", marginBottom: "1rem" }}>
                      <div className="col-12">
                        <strong className="text-color-dark">Details</strong>
                      </div>
                    </div>
                    <div className="row" style={{ borderBottom: "1px solid #ccc", paddingBottom: "1rem", marginBottom: "1rem" }}>
                      <div className="col-12">
                        <strong className="d-block text-color-dark line-height-1 font-weight-semibold mb-2">
                          {autoUpdatesData.subject_include || "1 Week Basic"}
                        </strong>
                      </div>
                    </div>
                    <div className="row total" style={{ borderBottom: "1px solid #ccc", paddingBottom: "1rem", marginBottom: "1rem" }}>
                      <div className="col-6">
                        <strong className="text-color-dark text-3-5">Amount</strong>
                      </div>
                      <div className="col-6 text-end">
                        <strong className="text-color-dark">
                          {convertedAmount !== null ? (
                            <span className="amount text-color-dark text-5">
                              ${convertedAmount} USD
                            </span>
                          ) : (
                            "Loading..."
                          )}
                        </strong>
                      </div>
                    </div>
                    <div className="row" style={{ marginTop: "1rem" }}>
                      <div className="col-12">
                        <PayViaPaypal amount={convertedAmount} />
                      </div>
                    </div>
                    <div className="row" style={{ marginTop: "1rem" }}>
                      <div className="col-12">
                        <p>
                          Your account will be upgraded within a few minutes. Forward the payment to our support via:
                          <a
                            href={`https://api.whatsapp.com/send/?phone=254111509962&text=${encodeURIComponent(
                              `Hello support, my name is ${user?.full_name}, email: ${user?.email}, tel: ${user?.phone_number}. I just paid ${convertedAmount !== null ? 
                                `$${convertedAmount} USD` 
                                : "Loading..."} for ${autoUpdatesData.subject_include}, Kindly confirm the payment and send me the games via WhatsApp.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-success btn-sm"
                            style={{
                              whiteSpace: "nowrap",
                              marginLeft: "10px",
                              fontWeight: "bold",
                            }}
                          >
                            WhatsApp&nbsp;
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default withAuth(PayUSD);
