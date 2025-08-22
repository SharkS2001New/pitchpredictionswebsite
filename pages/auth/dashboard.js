import React,{ useEffect, useState, useRef } from 'react';
import nookies from 'nookies';
import { useRouter } from 'next/router';
import withAuth from './checkAuth';
import FreePlan from './dashboard-plans/free-plans';
import PremiumPlan from './dashboard-plans/premium-plans';
import JackpotPlans from './dashboard-plans/jackpot-plans';
import getUserIp from '../../components/auth/get_user_ip';
import getCountryByIp from '../../components/auth/get_country_by_ip';
import AuthPreloader from './includes/auth_preLoader';

function Dashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [countryCode, setCountryCode] = useState(null);
  const premiumPlanRef = useRef(null);

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

  const handleScrollToPremiumPlan = () => {
    if (premiumPlanRef.current) {
      premiumPlanRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const isExpired = () => {
    if (user.subscription_end_date) {
      const today = new Date();
      const endDate = new Date(user.subscription_end_date);

      // Remove time part to compare only the date
      today.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
  
      return today > endDate; 
    }
    return false; 
  };  

  if(user && countryCode ) {
    return (
      <div className="container">
      <div className="row">
       {/* Profile Header */}
        <div className="profile-header mb-3">
          <div className="cover-image">
            <img src="../../auth_dashboard_image.jpg" alt="Stadium" className="cover-img" />
          </div>        
        </div>
      </div>
      {/* Account Overview & Subscription */}
      <div className="row">
        <div className="col-md-3 col-12 mb-3">
          <div className="card-auth profile-info">            
            <div className="user-details">
              <h4 className="mb-3"><span>{user.full_name}</span></h4>
              <p className="mb-3" style={{fontSize: "small"}}><i className="bi bi-calendar-check-fill"></i>&nbsp;&nbsp;Joined <strong>{new Date(user.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</strong></p>
              <p style={{fontSize: "small"}}><i className="bi bi-person"></i>&nbsp;&nbsp;User ID: <strong>{user.id}</strong></p>
              <p className="verified">✔ Account Verified</p>
            </div>
          </div>
        </div>
  
        {/* Wallet Section */}
        <div className="col-md-4 col-12 mb-3">
          <div className="card-auth">
            <h6 className="mb-4"><strong>Wallet</strong></h6>
            <p className="mb-4">Last Amount Paid: <strong>{user.last_payment_amount} </strong></p>
            <div className="row mb-2 text-left">
              <div className="col-12">
                <button className="btn btn-primary btn-sm" onClick={handleScrollToPremiumPlan}>
                  Upgrade To Premium Plan
                </button>
              </div>
            </div>
            <br/>
          </div>
        </div>
  
        {/* Plan Section */}
        <div className="col-md-3 col-12 mb-3">
          <div className="card-auth">
            <h6 className="mb-4"><strong>Plan</strong></h6>
            <p className="mb-4">Active Plan</p>
              <h4 style={{ color: user.active_plan === "premium" && isExpired() ? "red" : "#11f519", fontSize: "medium", fontWeight: "bold" }}>
                {user.active_plan === "free" ? (
                  <span className="mb-2"><i className="bi bi-gem"></i> Free Plan</span>
                ) : isExpired() ? (
                  <b className="mb-2">Expired Premium Plan</b>
                ) : (
                  <b className="mb-2">Premium</b>
                )}
              </h4>
            <br />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12 mb-5">
            <FreePlan countryCode={countryCode}/>
            {(countryCode === "KE") && ( 
              <JackpotPlans countryCode={countryCode} user={user} />
            )}
            <div ref={premiumPlanRef}>
              <PremiumPlan countryCode={countryCode} user={user} />
            </div>
            {/* <br/> */}
            {/* <InvestmentPlan countryCode={countryCode}/> */}
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

export default withAuth(Dashboard);