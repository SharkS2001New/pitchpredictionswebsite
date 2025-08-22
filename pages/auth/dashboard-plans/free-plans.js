import React from 'react';
import { useRouter } from 'next/router';

const FreePlan = () => {
  const router = useRouter();
  
  return (
    <div className="row">
      <div className="col-md-12 inn-title">
          <h4 className="mb-3" style={{fontWeight: "bold"}}>Our Best Free Plan</h4>
          <div className="vip-btn"> 
              <ul>
                <li><a href="/auth/free/accumulator-tips"><i className="bi bi-cookie fb1"></i>Accumulator Tips</a></li>

                <li><a href="/auth/free/double-chance"><i className="bi bi-cookie fb1"></i>Double Chance</a></li>

                <li><a href="/auth/free/over-2.5"><i className="bi bi-cookie fb1"></i>Over 2.5</a></li>

                <li><a href="/auth/free/bts"><i className="bi bi-cookie fb1"></i>BTTS</a></li>

                <li><a href="/auth/free/under-2.5"><i className="bi bi-cookie fb1"></i>Under 2.5</a></li>

                <li><a href="/auth/free/weekend-specials"><i className="bi bi-cookie fb1"></i>Weekend Specials</a></li>
              </ul>
          </div>   
        </div>
    </div>
  );
}

export default FreePlan;
