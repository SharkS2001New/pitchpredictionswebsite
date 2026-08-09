import React, { useEffect, useMemo, useRef, useState } from "react";
import withAuth from "../checkAuth";
import { useRouter } from "next/router";
import nookies from "nookies";
import getAutoUpdatesData from "../../../components/auth/get_auto_updates_data";
import {
  getMpesaPayConfig,
  pollMpesaUntilSettled,
  startMpesaStkPush,
} from "../../../components/auth/mpesa";

const SITE = "pitch";
const BRAND = "Pitch Predictions";

function PayKe() {
  const router = useRouter();
  const { plan } = router.query;
  const pollAbort = useRef(false);

  const [user, setUser] = useState(null);
  const [planRow, setPlanRow] = useState(null);
  const [payConfig, setPayConfig] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const cookies = nookies.get(null);
    if (cookies.user) {
      const userData = JSON.parse(cookies.user);
      setUser(userData);
      const raw = String(userData.phone_number || "").replace(/\D/g, "");
      if (raw.startsWith("254") && raw.length === 12) setPhoneNumber(raw.slice(3));
      else if (raw.startsWith("0") && raw.length === 10) setPhoneNumber(raw.slice(1));
      else if (raw.length === 9) setPhoneNumber(raw);
    } else {
      router.push("/auth/login");
    }

    getMpesaPayConfig(SITE)
      .then((res) => setPayConfig(res?.data || null))
      .catch(() => {});

    return () => {
      pollAbort.current = true;
    };
  }, [router]);

  useEffect(() => {
    if (!plan) return;
    getAutoUpdatesData(plan)
      .then((response) => {
        const row = Array.isArray(response?.data) ? response.data[0] : null;
        setPlanRow(row || null);
      })
      .catch((err) => console.error("Error fetching plan:", err));
  }, [plan]);

  useEffect(() => {
    const onBeforeUnload = (event) => {
      if (!isProcessing) return;
      event.preventDefault();
      event.returnValue = "Payment is in progress. Are you sure you want to leave?";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [isProcessing]);

  const amount = useMemo(() => Number(planRow?.amount || 0), [planRow]);
  const planLabel = planRow?.description || planRow?.plan || "Premium tips";
  const till = payConfig?.till_number || "8881950";
  const wa = payConfig?.support_whatsapp || "254111509962";

  const whatsappHref = useMemo(() => {
    const text = `Hello support, my name is ${user?.full_name || "N/A"} on ${BRAND}, email: ${user?.email || "N/A"}. I paid KES ${amount || "?"} for ${planLabel}. Kindly confirm.`;
    return `https://api.whatsapp.com/send/?phone=${wa}&text=${encodeURIComponent(text)}`;
  }, [user, amount, planLabel, wa]);

  const refreshUserCookie = (freshUser) => {
    if (!freshUser) return;
    nookies.set(null, "user", JSON.stringify(freshUser), { path: "/" });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setStatusNote("");

    if (!planRow?.id) {
      setError("Plan is still loading. Please wait a moment.");
      return;
    }
    if (!/^7\d{8}$/.test(phoneNumber) && !/^1\d{8}$/.test(phoneNumber)) {
      setError("Enter a valid M-Pesa number like 7XXXXXXXX.");
      return;
    }

    setIsProcessing(true);
    pollAbort.current = false;

    try {
      const stk = await startMpesaStkPush({
        planId: planRow.id,
        phoneNumber: `0${phoneNumber}`,
        site: SITE,
      });

      if (!stk?.success) {
        setError(stk?.message || "Could not start M-Pesa payment.");
        setIsProcessing(false);
        return;
      }

      const checkoutRequestId = stk.data?.checkout_request_id;
      const paymentId = stk.data?.payment_id;
      setSuccess(
        stk.data?.customer_message ||
          `Check your phone on 0${phoneNumber} and enter your M-Pesa PIN.`
      );
      setStatusNote("Waiting for M-Pesa confirmation…");

      const settled = await pollMpesaUntilSettled({
        checkoutRequestId,
        paymentId,
        onTick: (tick) => {
          if (pollAbort.current) return;
          const label = tick?.data?.status_label;
          if (label === "pending") {
            setStatusNote("Still waiting for your M-Pesa PIN confirmation…");
          }
        },
      });

      if (pollAbort.current) return;

      const status = settled?.data?.status_label;
      if (status === "paid") {
        refreshUserCookie(settled.data?.user);
        setSuccess("Payment confirmed. Unlocking your tips…");
        setStatusNote("");
        const redirect = settled.data?.redirect_path || "/auth/dashboard";
        window.setTimeout(() => {
          window.location.href = redirect;
        }, 700);
        return;
      }

      if (status === "failed") {
        setError(settled?.data?.result_desc || "Payment was cancelled or failed. Try again.");
        setSuccess("");
        setStatusNote("");
      } else {
        setError("We could not confirm payment yet. If you paid, tap WhatsApp support below.");
        setSuccess("");
        setStatusNote("");
      }
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Payment failed. Please try again.");
      setSuccess("");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="pp-pay" data-site={SITE}>
      <div className="pp-pay-shell">
        <a className="pp-pay-back" href="/auth/plan">
          ← Change plan
        </a>
        <div className="pp-pay-hero">
          <div className="pp-pay-kicker">{BRAND}</div>
          <h1 className="pp-pay-title">Pay with M-Pesa</h1>
          <p className="pp-pay-subtitle">
            STK push goes straight to your phone. After you enter your PIN, tips unlock automatically.
          </p>
        </div>

        <div className="pp-pay-grid">
          <section className="pp-pay-card">
            <h2>Express checkout</h2>
            <div className="pp-pay-plan-chip">
              <div>
                <strong>{planLabel}</strong>
                <div>
                  <span>{planRow ? `${planRow.period || 1} day access` : "Loading plan…"}</span>
                </div>
              </div>
              <strong>KES {amount ? amount.toLocaleString("en-US") : "—"}</strong>
            </div>

            <form onSubmit={handlePayment} noValidate>
              <label className="pp-pay-label" htmlFor="mpesaPhone">
                M-Pesa number
              </label>
              <div className="pp-pay-phone">
                <span>+254</span>
                <input
                  id="mpesaPhone"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  maxLength={9}
                  placeholder="7XXXXXXXX"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 9))}
                  disabled={isProcessing}
                />
              </div>

              {success ? <p className="pp-pay-alert ok">{success}</p> : null}
              {error ? <p className="pp-pay-alert err">{error}</p> : null}
              {statusNote ? <div className="pp-pay-status">{statusNote}</div> : null}

              <button className="pp-pay-btn" type="submit" disabled={isProcessing || !amount}>
                {isProcessing ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                    Processing…
                  </>
                ) : (
                  `Pay KES ${amount ? amount.toLocaleString("en-US") : "…"}`
                )}
              </button>
            </form>
          </section>

          <aside className="pp-pay-card">
            <h2>Or pay manually</h2>
            <ol className="pp-pay-steps">
              <li>Open Lipa na M-Pesa → Buy Goods</li>
              <li>
                Till number: <strong>{till}</strong>
              </li>
              <li>
                Amount: <strong>KES {amount ? amount.toLocaleString("en-US") : "—"}</strong>
              </li>
              <li>Complete payment, then message support if tips don’t unlock</li>
            </ol>
            <a className="pp-pay-wa" href={whatsappHref} target="_blank" rel="noopener noreferrer">
              WhatsApp support
            </a>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default withAuth(PayKe);
