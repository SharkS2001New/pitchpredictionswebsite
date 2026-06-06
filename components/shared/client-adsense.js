'use client';

import { useEffect, useState } from 'react';
import { Adsense as GoogleAdsense } from '@ctrl/react-adsense';

/**
 * AdSense must only mount in the browser. Google's script injects iframes and
 * data-adsbygoogle-status into the <ins> after load, which causes hydration
 * mismatches when the component is server-rendered.
 */
export function Adsense(props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    const { style = {} } = props;
    return (
      <div
        style={{ display: 'block', minHeight: 90, ...style }}
        aria-hidden="true"
      />
    );
  }

  return <GoogleAdsense {...props} />;
}

export default Adsense;
