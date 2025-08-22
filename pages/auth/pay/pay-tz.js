import React, { useEffect, useState } from "react";
import withAuth from "../checkAuth";
import { useRouter } from "next/router";
import nookies from "nookies";
import getAutoUpdatesData from "../../../components/auth/get_auto_updates_data";
import SendEmail from "../../../components/auth/send_notification_email";

function PayTz() {
  const [user, setUser] = useState(null);
  const [autoUpdatesData, setAutoUpdatesData] = useState([]);
  const [tzsAmount, setTzsAmount] = useState(null);
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
          const rate = data.rates.TZS; // Get exchange rate for TZS
          setTzsAmount((autoUpdatesData.amount + 20) * rate);
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
          <div className="col-lg-6 col-12">
            <div className="card border-width-3 border-radius-0 border-color-hover-dark">
              <div className="card-body">
                <p style={{ fontWeight: "bold" }}>Unaweza kutumia njia zifuatazo kulipia:</p>
                <ol className="space-y-4">
                  {["Vodacom M-Pesa", "Airtel Money", "Tigo Pesa"].map((method, index) => (
                    <li key={index}>
                      {method}: Pigia {index === 0 ? "*150*00#" : index === 1 ? "*150*55#" : "*150*66#"} kwenye simu yako ya {method.split(" ")[0]} na uchague "Tuma pesa kwa MPESA Kenya".  
                      Ingiza nambari ya simu ya M-Pesa ya mpokeaji katika umbizo la <strong>254748956677</strong>, pesa:  
                      <strong style={{ fontWeight: "bold", color: "#012970" }}>
                        {tzsAmount !== null ? `TZS ${Number(tzsAmount).toLocaleString("en-US")}` : "Loading..."}
                      </strong>, na PIN yako ya {method}.
                    </li>
                  ))}
                </ol>
                <p>
                  Peleka malipo kwa msaada wetu kupitia:
                  <a
                    href={`https://api.whatsapp.com/send/?phone=254111509962&text=${encodeURIComponent(
                      `Hello support, my name is ${user?.full_name || "N/A"}, email: ${user?.email || "N/A"}, tel: ${user?.phone_number || "N/A"}. I just paid TZS ${tzsAmount !== null ? 
                        Number(tzsAmount).toLocaleString("en-US") 
                        : "Loading..."} for ${autoUpdatesData.subject_include || "your service"}. Kindly confirm the payment and send me the games via WhatsApp.`
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
    </React.Fragment>
  );
}

export default withAuth(PayTz);
