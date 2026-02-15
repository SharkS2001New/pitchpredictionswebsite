"use client";
import { useState } from "react";

export default function GuzBetCatfishBanner() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div style={styles.overlay}>
      <button style={styles.closeBtn} onClick={() => setVisible(false)}>
        ✕
      </button>

      <a
        href="https://guzzbet.com"
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: "block", lineHeight: 0 }}
      >
        <picture>
          {/* Mobile version */}
          <source
            srcSet="/guzzer-mobile.png"
            media="(max-width: 768px)"
          />

          {/* Desktop fallback */}
          <img
            src="/guzzbet.png"
            alt="Advertisement"
            style={styles.image}
          />
        </picture>
      </a>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    bottom: 0,
    left: 0,
    width: "100%",
    zIndex: 9999,
    margin: 0,
    padding: 0,
    fontSize: 0, // removes inline gap
  },
  image: {
    width: "100%",
    height: "auto",
    display: "block",
  },
  closeBtn: {
    position: "absolute",
    right: "10px",
    top: "-14px",
    background: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: "28px",
    height: "28px",
    cursor: "pointer",
    fontSize: "14px",
    zIndex: 10000,
  },
};
