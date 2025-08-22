import { useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from 'next/router';

export default function CookieBanner() {
  const router = useRouter(); //fetch page link data

  if(router.isReady){
    const [showBanner, setShowBanner] = useState(
        localStorage.getItem("cookie_consent") !== "true"
      );
    
      const handleAccept = () => {
        Cookies.set("cookie_consent", "true");
        localStorage.setItem("cookie_consent", "true");
        setShowBanner(false);
      };

      return (
        showBanner && (
          <div className="row cookie-banner text-center">
            <div className="col-md-10 col-12">
              <p>
                By using this site, you acknowledge that we use cookies to improve your browsing experience. Please review our Cookie Policy for more information.
              </p>
            </div>
            <div className="col-md-2 col-12">
              <button className="btn btn-danger" onClick={handleAccept}>Accept</button>
            </div>
          </div>
        )
      );
  }

}
