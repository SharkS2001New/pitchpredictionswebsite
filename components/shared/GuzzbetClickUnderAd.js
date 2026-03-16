"use client";
import { useEffect, useRef } from "react";

export default function GuzzbetClickUnderAd() {
  const clicked = useRef(false);

  useEffect(() => {
    const handleClick = () => {
      if (clicked.current) return;

      clicked.current = true;

      window.open(
        "https://guzzbet.com",
        "_blank",
        "noopener,noreferrer"
      );
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return null;
}