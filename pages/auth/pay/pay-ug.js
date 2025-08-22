import React, { useEffect, useState } from "react";
import withAuth from "../checkAuth";
import { useRouter } from "next/router";
import nookies from "nookies";
import getAutoUpdatesData from "../../../components/auth/get_auto_updates_data";
import SendEmail from "../../../components/auth/send_notification_email";

function PayUg() {
  const [user, setUser] = useState(null);
  const [autoUpdatesData, setAutoUpdatesData] = useState([]);
  const [ugxAmount, setUgxAmount] = useState(null);
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
    if (autoUpdatesData.amount !== undefined) {
      fetch("https://api.exchangerate-api.com/v4/latest/KES")
        .then((res) => res.json())
        .then((data) => {
          const rate = data.rates.UGX;
          setUgxAmount((autoUpdatesData.amount + 20) * rate);
        })
        .catch((error) => console.error("Error fetching exchange rate:", error));
    }
  }, [autoUpdatesData.amount]);

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
          <div className="col-lg-8 col-12">
            <div className="card border-width-3 border-radius-0 border-color-hover-dark">
              <div className="card-body">
                <p style={{ fontWeight: "bold", borderBottom: "1px solid #ccc", paddingBottom: "1rem", marginBottom: "1rem" }}>
                  You can follow these steps to pay for our package:
                </p>
                <ol className="space-y-4">
                  <li>Dial *165# on your MTN Uganda phone.</li>
                  <li>Select Send Money.</li>
                  <li>Select International Transfer.</li>
                  <li>Select Safaricom M-Pesa.</li>
                  <li>Enter the recipient's M-Pesa phone number in the format: 254748956677.</li>
                  <li>
                    Enter the amount:{" "}
                    <strong style={{ fontWeight: "bold", color: "#012970" }}>
                      {ugxAmount !== null ? `UGX ${Number(ugxAmount).toLocaleString("en-US")}` : "Loading..."}
                    </strong>
                  </li>
                  <li>Enter your MTN Mobile Money PIN.</li>
                  <li>Check and confirm your payment.</li>
                </ol>
                <p>We will receive the money in our M-Pesa account within a few minutes.</p>

                <p>
                  Forward the payment to our support via:
                  <a
                    href={`https://api.whatsapp.com/send/?phone=254111509962&text=${encodeURIComponent(
                      `Hello support, my name is ${user?.full_name}, email: ${user?.email}, tel: ${user?.phone_number}. I just paid UGX ${ugxAmount !== null ? 
                        Number(ugxAmount).toLocaleString("en-US") 
                        : "Loading..."} for ${autoUpdatesData.subject_include}, Kindly confirm the payment and send me the games via WhatsApp.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-success btn-sm"
                    style={{
                      whiteSpace: "nowrap",
                      marginLeft: "10px",
                      fontWeight: "bold",
                    }}>
                    WhatsApp&nbsp;
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

export default withAuth(PayUg);
