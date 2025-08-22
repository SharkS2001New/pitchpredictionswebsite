import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AuthPreloader from './includes/auth_preLoader';
import getUserIp from '../../components/auth/get_user_ip';
import getCountryByIp from '../../components/auth/get_country_by_ip';
import PremiumPlans from './dashboard-plans/premium-plans';
import JackpotPlans from './dashboard-plans/jackpot-plans';
import nookies from 'nookies';

export default function handler(req, res) {
  const [countryCode, setCountryCode] = useState(null);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const cookies = nookies.get(null);
    if (cookies.user) {
      setUser(JSON.parse(cookies.user));
    } else {
      router.push('/auth/login');
    }
  }, []);
  
  useEffect(() => {
    async function fetchData() {
      const ip = await getUserIp();

      if (ip) {
        const code = await getCountryByIp(ip);
        
        setCountryCode(code);
      } else {
        res.status(400).json({ error: "Unable to determine the country" });
      }
    }

    fetchData();
  }, [router]);

  if (countryCode) {
    return (
      <div className="container">
        <div className="row"> 
          <div className="col-md-12 mb-5">
          <nav aria-label="breadcrumb" className="mb-3 border-bottom">
              <ol className="breadcrumb justify-content-center">
                  <li className="breadcrumb-item vipPages"><a href="/auth/dashboard">Home</a></li>
                  <li className="bi bi-chevron-compact-right active" aria-current="page">Pages</li>
              </ol>
              <div className="col-md-12 text-center">
                  <h3 className="font-weight-bold text-dark">V.I.P Plans</h3>
              </div>
            </nav>
            {(countryCode === "KE") && (
              <><br/>
              <JackpotPlans countryCode={countryCode} user = {user} />
              <br/>
              </>
            )}
            <PremiumPlans countryCode={countryCode} user = {user}/>
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div className="row justify-content-center" style={{height: "500px"}}>
        <AuthPreloader /> 
      </div>
    );
  }
}
