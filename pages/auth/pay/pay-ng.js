import React, { useEffect, useState } from "react";
import withAuth from "../checkAuth";
import { useRouter } from "next/router";
import nookies from "nookies";
import axios from "axios"; // ✅ Import Axios
import getAutoUpdatesData from "../../../components/auth/get_auto_updates_data";
import SendEmail from "../../../components/auth/send_notification_email";

function PayNG() {
  const [user, setUser] = useState(null);
  const [autoUpdatesData, setAutoUpdatesData] = useState({}); // ✅ Initialize as an object
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
      if (autoUpdatesData.amount !== undefined && autoUpdatesData.sign) {
        try {
          const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${autoUpdatesData.sign}`);
          const ngnRate = response.data.rates.NGN || 1; // ✅ Default to 1 if rate is missing
          const converted = ((autoUpdatesData.amount + 20) * ngnRate).toFixed(2);
          setConvertedAmount(converted);
        } catch (error) {
          console.error("Error fetching exchange rate:", error);
        }
      }
    };

    fetchExchangeRate();
  }, [autoUpdatesData]);

  return (
    <React.Fragment>
      <div className="container mb-5">
        <div className="row">
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
                <h6 className="font-weight-bold text-uppercase text-4 mb-3" style={{ textAlign: "left", fontWeight: "bold" }}>
                  You can follow these steps to pay for our package:
                </h6>
                <div className="shop_table cart-totals mb-3">
                  <div style={{ textAlign: "left" }}>
                    <div style={{ marginBottom: "1rem" }}>
                      <strong className="text-color-dark">ACCOUNT DETAILS</strong>
                    </div>
                    <div style={{ borderBottom: "1px solid #ccc", marginBottom: "1rem" }}></div>
                    <div className="row" style={{ marginBottom: "1rem" }}>
                      <div className="col-6">
                        <strong className="d-block text-color-dark line-height-1 font-weight-semibold">Bank Name:</strong>
                      </div>
                      <div className="col-6 text-end">KudaBank</div>
                    </div>
                    <div style={{ borderBottom: "1px solid #ccc", marginBottom: "1rem" }}></div>
                    <div className="row" style={{ marginBottom: "1rem" }}>
                      <div className="col-8">
                        <strong className="d-block text-color-dark line-height-1 font-weight-semibold">ACCOUNT NUMBER:</strong>
                      </div>
                      <div className="col-4 text-end">3000857049</div>
                    </div>
                    <div style={{ borderBottom: "1px solid #ccc", marginBottom: "1rem" }}></div>
                    <div className="row" style={{ marginBottom: "1rem" }}>
                      <div className="col-4">
                        <strong className="d-block text-color-dark line-height-1 font-weight-semibold">Account Name:</strong>
                      </div>
                      <div className="col-8 text-end">Presh-Amazingstakes Concept</div>
                    </div>
                    <div className="row" style={{ marginBottom: "1rem" }}>
                      <div className="col-8">
                        <strong className="d-block text-color-dark line-height-1 font-weight-semibold">Amount:</strong>
                      </div>
                      <div className="col-4 text-end">
                        <strong style={{ fontWeight: "bold", color: "#012970" }}>
                          {convertedAmount !== null ? (
                            <span className="amount text-color-dark text-5">
                              ₦{Number(convertedAmount).toLocaleString("en-US")}
                            </span>
                          ) : (
                            "Loading..."
                          )}
                        </strong>
                      </div>
                    </div>
                    <div style={{ borderBottom: "1px solid #ccc", marginBottom: "1rem" }}></div>
                    <div>
                      <div colSpan="2">
                        <p>
                          Forward the payment to our support via:
                          <a
                            href={`https://api.whatsapp.com/send/?phone=254111509962&text=${encodeURIComponent(
                              `Hello support, my name is ${user?.full_name}, email: ${user?.email}, tel: ${user?.phone_number}. I just paid ${
                                convertedAmount !== null
                                  ? `Naira ${Number(convertedAmount).toLocaleString("en-US")}`
                                  : "Loading..."
                              } for ${autoUpdatesData.subject_include}. Kindly confirm the payment and send me the games via WhatsApp.`
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

export default withAuth(PayNG);
