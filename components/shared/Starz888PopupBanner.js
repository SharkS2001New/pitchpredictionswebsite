'use client';
import { useEffect, useState } from 'react';

export default function Starz888PopupBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const pageKey = `popupClosed:${window.location.pathname}`;
    const storedData = localStorage.getItem(pageKey);

    const now = new Date().getTime();
    const twentyFourHours = 24 * 60 * 60 * 1000;

    if (!storedData || now - parseInt(storedData) > twentyFourHours) {
      setShowBanner(true);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleClose = () => {
    const pageKey = `popupClosed:${window.location.pathname}`;
    localStorage.setItem(pageKey, new Date().getTime().toString());
    setShowBanner(false);
    document.body.style.overflow = 'auto';
  };

  if (!showBanner) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <button style={styles.closeButton} onClick={handleClose}>
          <i className="bi bi-x-lg" style={{fontSize: "20px", fontWeight: "bold", color: "black"}}></i>
        </button>
        <a
          href="https://aff888toertsa.com/8DyJFmHT?domain_id=4579345&aff_id=3516951&site_type=seo&campaign_id=85381&type=betting&possition=%7Bposition%7D&site=pitchpredictions_com&pb=7b34ad611e224f64b007a115ab14b627"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/starz-banner.png"
            alt="Starz Bonus Banner"
            style={{ width: '100%', height: 'auto', borderRadius: '10px' }}
          />
        </a>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    // backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 9999,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    position: 'relative',
    width: '390px',
    maxWidth: '90%',
    padding: '0',
    borderRadius: '10px',
    boxShadow: '0 0 30px rgba(0,0,0,0.5)',
  },
  closeButton: {
    position: 'absolute',
    top: '-10px',
    right: '-10px',
    background: '#fff',
    border: 'none',
    borderRadius: '50%',
    width: '30px',
    height: '30px',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    zIndex: 10000,
  },
};
