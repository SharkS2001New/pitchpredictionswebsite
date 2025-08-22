import React from 'react';

const InvestmentPlan = (props) => {    
  return (
    <div className="row">
      <h4 className="text-left" style={{fontWeight: "bold"}}>Investment Plan</h4>

        <div className="col-12 inn-title">
          <div className="investment-btn">
            <ul>
              <li><a href="/auth/vip/super-tips"><i className="bi bi-cookie"></i> Super Tips (1.70 - 2.10 odd)</a></li>

              <li><a href="/auth/vip/extra-super-picks"><i className="bi bi-cookie"></i> Extra Picks (2 - 5 odd)</a></li>

              <li><a href="/auth/vip/10-Odds"><i className="bi bi-cookie"></i> 10 Odds Predictions</a></li>
            </ul>
          </div>    
        </div>
    </div>
  );
}

export default InvestmentPlan;
