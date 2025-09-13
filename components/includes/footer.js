import Script from "next/script";

function Footer(){
    return (
    <footer className="py-2 text-lg-start text-white footer" style={{backgroundColor:"#202c3c", fontSize: "13px"}}>
       <div className="container-mob desktop-container-resize p-3 pb-0">
        <div className="row">
          <div className="col-md-4 mb-4">
              <span className="mb-2 font-weight-bold footerLinks">
                What Is Pitch Predictions ?
              </span><br/><br/>
              <p className="fixturesTextSize">
                Pitch Predictions is your ultimate destination for accurate and data-driven football predictions, 
                fixtures, standings, live scores, and results from major leagues worldwide. Our expert analysis and
                insights help you make informed betting decisions and stay ahead of the game. Join us now to elevate your football betting experience.
              </p>
              {/* <!-- Facebook --> */}
              <a
                  className="btn btn-outline-light btn-floating m-1"
                  href="https://www.facebook.com/profile.php?id=100094600476269"
                  target="_blank"
                  role="button" aria-label="Action 1"
                  ><i className="bi bi-facebook"></i></a>

              {/* <!-- Twitter --> */}
              <a
                className="btn btn-outline-light btn-floating m-1"
                role="button" aria-label="Action 2"
                target="_blank"
              ><i className="bi bi-twitter"></i></a>

              {/* <!-- Instagram --> */}
              <a
                  className="btn btn-outline-light btn-floating m-1"
                  role="button" aria-label="Action 3"
                  ><i className="bi bi-instagram"></i></a>
              {/* <!-- Telegram --> */}
              <br/><br/>
              <div className="card">
                <div className="container text-center mb-2">
                  <p style={{color: "black"}}>For free tips and Free Jackpot tips, Join our Telegram Channel.</p>
                  <a href="https://t.me/s/betsassuredkenya" style={{color: "white", fontWeight: "bold"}} className="btn btn-info" rel="noopener noreferrer" target="_blank">&nbsp;&nbsp;<i className="bi bi-telegram"></i>&nbsp;&nbsp;VIEW CHANNEL</a>
                </div>
              </div>
          </div>
          <div className="col-4 col-md-2">
            <span className="mb-4 font-weight-bold footerLinks">Support Links</span><br/><br/>
            <ul className="nav flex-column fixturesTextSize"> 
              <li className="nav-item mb-2"><a href="/terms-and-conditions" className="nav-a p-0 text-light">Terms and Conditions</a></li>
              <li className="nav-item mb-2"><a href="/privacy-policy" className="nav-a p-0 text-light">Privacy Policy</a></li>
              <li className="nav-item mb-2"><a href="/contactus" className="nav-a p-0 text-light">Contact us</a></li>
              <li className="nav-item mb-2"><a href="/our-partners" className="nav-a p-0 text-light">Our Partners</a></li>
              <li className="nav-item mb-2"><a href="/blog" className="nav-a p-0 text-light">Blogs</a></li>
            </ul>
          </div>

          <div className="col-8 col-md-3"> 
            <span className="mb-4 font-weight-bold footerLinks">Quick links</span><br/><br/>
            <ul className="nav flex-column fixturesTextSize footerPart3">
              <li className="nav-item mb-2"><a href="/football-predictions-today" className="nav-a p-0 text-light">Football Predictions for Today</a></li>
              <li className="nav-item mb-2"><a href="/football-predictions-tomorrow" className="nav-a p-0 text-light">Football Predictions for tomorrow</a></li>
              <li className="nav-item mb-2"><a href="/football-predictions-weekend" className="nav-a p-0 text-light">Football Predictions for the Weekend</a></li>
              <li className="nav-item mb-2"><a href="/jackpot-predictions" className="nav-a p-0 text-light">Jackpot Predictions</a></li>
              <li className="nav-item mb-2"><a href="/sitemaps" className="nav-a p-0 text-light">Sitemaps</a></li> 
              <li className="nav-item mb-2"><a href="https://www.bettingtips.co.ke" target="_blank" className="nav-a p-0 text-light">Betting tips</a></li> 
              <li className="nav-item mb-2"><a href="https://www.feedinco.com" target="_blank" className="nav-a p-0 text-light">Feedinco Betting tips</a></li> 
              <li className="nav-item mb-2"><a href="https://www.betrekatips.com" target="_blank" className="nav-a p-0 text-light">Betrekatips</a></li>
              <li className="nav-item mb-2"><a href="https://todayspredict.com" target="_blank" className="nav-a p-0 text-light">Today's Football Prediction</a></li>
              <li className="nav-item mb-2"><a href="https://tips100.com" target="_blank" className="nav-a p-0 text-light">100 Sure Straight Wins</a></li>
              <li className="nav-item mb-2"><a href="https://tipsxtra.com" target="_blank" className="nav-a p-0 text-light">Tipsxtra</a></li>
            </ul>
          </div>

          <div className="col-md-3">
            <span className="font-weight-bold footerLinks mb-5">Popular Leagues</span><br/><br/>
            <ul className="nav flex-column fixturesTextSize footerPart3">
              <li className="nav-item mb-2"><a href="/league/football-predictions-for-england/premier-league-39/fixtures" className="nav-a p-0 text-light">Football Predictions for England Premier League</a></li>
                <li className="nav-item mb-2"><a href="/league/football-predictions-for-spain/la-liga-140/fixtures" className="nav-a p-0 text-light">Football Predictions for Spain La Liga</a></li>
                <li className="nav-item mb-2"><a href="/league/football-predictions-for-germany/bundesliga-78/fixtures" className="nav-a p-0 text-light">Football Predictions for Germany Bundesliga</a></li>
                <li className="nav-item mb-2"><a href="/league/football-predictions-for-italy/serie-a-135/fixtures" className="nav-a p-0 text-light">Football Predictions for Italy Serie A</a></li>
                <li className="nav-item mb-2"><a href="/league/football-predictions-for-france/ligue-1-61/fixtures" className="nav-a p-0 text-light">Football Predictions for France Ligue 1</a></li>
            </ul>
          </div>
        </div>
        <hr className="my-3"/>

        <div className="row">
            <div className="col-12 mb-0">
                <h5 className="text-center mb-3">Sponsors</h5>
                <ul className="sponsors-list">
                    <li className="mb-0"><a target="_blank" href="https://urbanedleadership.org/">Xoilac xem bong da</a></li>
                    <li className="mb-0"><a target="_blank" href="https://bsmsummit.com/">Socolive truc tiep bong da</a></li>
                </ul>
            </div>
        </div>
        
        <hr className="my-3"/>

        {/* <!-- Section: Copyright --> */}
        <section className="p-3 pt-0 fixturesTextSize">
            <div className="row">
              <div className="text-center">
                      Copyright ©<span id="year"></span> pitchpredictions.com  All rights reserved.
                </div>
                <div className="text-center text-md-end">
                  <button type="button"  className="btn btn-danger btn-floating btn-lg" id="btn-back-to-top">
                        <i className="bi bi-arrow-up-circle-fill" role="button" aria-label="Back To Top"></i>
                  </button>
                </div>
            </div>              
        </section>
      </div>
      <Script src="../../../../js/scripts.js" />     
    </footer>
  )
}

export default Footer;
