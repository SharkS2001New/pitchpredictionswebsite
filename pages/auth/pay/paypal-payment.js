import React, { useState } from "react";
import withAuth from "../checkAuth";
import nookies from "nookies";

function PayViaPaypal(props) {
  const [loading, setLoading] = useState(false);
  
  const handlePayWithPaypal = async () => {
    setLoading(true);

    // Function to include token in request headers
    const setAuthToken = () => {
      const cookies = nookies.get();
      return cookies.token ? { Authorization: `Bearer ${cookies.token}` } : {};
    };

    try {
      // Use the token for authentication
      const headers = setAuthToken();

      // Call Laravel backend to create the PayPal order
      const response = await fetch("https://api.pitchpredictions.com/api/pay_via_paypal_method", {
        method: "POST",
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: props.amount }), // Send payment amount
      });

      const data = await response.json();

      if (data.error) {
        alert("Error creating PayPal order");
        setLoading(false);
        return;
      }

      // Redirect the user to PayPal approval page
      const approvalLink = data.links.find((link) => link.rel === "approve");

      if (approvalLink) {
        window.location.href = approvalLink.href;
      } else {
        alert("Approval link not found");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handlePayWithPaypal}
        disabled={loading}
        className="btn btn-dark btn-modern w-100 text-uppercase bg-color-hover-primary border-color-hover-primary border-radius-0 text-3 py-3">
        {loading ? "Processing..." : "Pay with PayPal"}
      </button>
    </div>
  );
};

export default withAuth(PayViaPaypal);
