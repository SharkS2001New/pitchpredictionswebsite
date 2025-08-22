import { useEffect, useState } from "react";
import api from "./api";
import { useRouter } from "next/router";
import getUserIp from "./get_user_ip";

const SendEmail = (props) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSendEmail = async () => {
    setLoading(true);

    // Generate unique item number
    const itemNumber = `Supa${new Date().toLocaleTimeString("en-US", { hour12: false })}tips`;

    // Prepare email data
    const emailData = {
      email: props.user.email,
      name: props.user.full_name,
      subjectInclude: props.autoUpdatesData.subject_include,
      itemNumber,
      amount: props.autoUpdatesData.amount,
      sign: props.autoUpdatesData.sign,
      dateTime: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    };

    // Get user IP
    let ip_address = "";
    try {
      ip_address = await getUserIp();
    } catch (error) {
      console.error("Error fetching user IP:", error);
    }

    // Prepare transaction data
    const transactionData = {
      user_id: props.user.id,
      email: props.user.email,
      item_number: itemNumber,
      plan: props.plan,
      item_name: props.autoUpdatesData.subject_include,
      amount: props.autoUpdatesData.amount,
      date_time: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      country_ip: ip_address || "0.0.0.0", // Fallback IP
      actual_link: `https://www.pitchpredictions.com${router.asPath}`,
    };

    try {
      // Log transaction
      await api.post("/store-transaction", transactionData);

      // Send notification email
      const response = await fetch(
        "https://api.pitchpredictions.com/api/send-notification-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
          },
          body: JSON.stringify(emailData),
        }
      );

      const result = await response.json();
      
      if (result.success) {
        setMessage("Email sent successfully!");
      } else {
        setMessage("Failed to send email.");
      }
    } catch (error) {
      console.error("Error occurred during email or transaction:", error);
      setMessage("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (props.user && props.autoUpdatesData) {
      handleSendEmail();
    }
  }, [props.user, props.autoUpdatesData]); // Trigger only when user or updates change
};

export default SendEmail;
