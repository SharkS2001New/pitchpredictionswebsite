import { useEffect } from 'react';

const AdsterraAd = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '//pl25562030.profitablecpmrate.com/23/c6/99/23c6999750507ae026e9a271af24ea8d.js'; 
    script.type = 'text/javascript';
    script.async = true;

    // Append the script to the ad container
    document.getElementById('ad-container')?.appendChild(script);

    return () => {
      // Cleanup the script if the component unmounts
      document.getElementById('ad-container')?.removeChild(script);
    };
  }, []);

  return <div id="ad-container" style={{ minHeight: '100%', width: '100%' }} />;
};

export default AdsterraAd;
