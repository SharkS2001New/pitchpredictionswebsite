"use client";

export default function GuzzBetHomepageBanner({ onClose }) {
  return (
    <div style={styles.bannerContainer}>
      <div style={styles.bannerWrapper}>
        {/* <button style={styles.closeBtn} onClick={onClose}>
          ✕
        </button> */}

        <a
          href="https://guzzbet.com"
          target="_blank"
          rel="sponsored nofollow noopener noreferrer"
          style={styles.link}
        >
          <picture>
            <source
              srcSet="/guzzer-mobile.png"
              media="(max-width: 768px)"
            />
            <img
              src="/guzzbet.png"
              alt="Special Betting Offer"
              style={styles.image}
            />
          </picture>
        </a>
      </div>
    </div>
  );
}

const styles = {
  bannerContainer: {
    width: "100%",
    margin: "10px 0",
    padding: "0",
    position: "relative",
  },
  bannerWrapper: {
    position: "relative",
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  link: {
    display: "block",
    lineHeight: 0,
    textDecoration: "none",
  },
  image: {
    width: "100%",
    height: "auto",
    display: "block",
  },
};