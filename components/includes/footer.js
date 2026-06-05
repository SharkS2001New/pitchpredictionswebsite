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
                <h3 className="h5 text-center mb-3">Our Partners & Sponsors</h3>
                <ul className="sponsors-list">
                  <li className="mb-0"><a target="_blank" href="https://www.ericbauman.com/">Socolive TV</a></li>  {/**Renewed every three months, first added 16-05-2026 */}
                  <li className="mb-0"><a target="_blank" href="https://bsidefilm.com/">Jalalive Tv</a></li>  {/**Renewed every three months, first added 24-05-2026 */}

                  {/**Renewed every month on 06, first added 06-04-2026 */}
                  <li className="mb-0"><a target="_blank" href="https://colatvttbd.net/">trực tiếp bóng đá hôm nay</a></li>
                  <li className="mb-0"><a target="_blank" href="https://xoilactvttbd.com/">xoilac</a></li>
                  <li className="mb-0"><a target="_blank" href="https://xoilac-tv.icu">trực tiếp bóng đá hôm nay</a></li>
                  <li className="mb-0"><a target="_blank" href="https://cakhiatvttbd.com/">cakhia tv</a></li>
                  <li className="mb-0"><a target="_blank" href="https://trangcadobongda.lat/">https://trangcadobongda.lat/</a></li>
                  <li className="mb-0"><a target="_blank" href="https://1agame.io/">1Agame</a></li>

                  {/**Renewed every month on 05, first added 05-06-2026 */} {/**Vietnamese partner */}
                  <li className="mb-0"><a target="_blank" href="https://vsbet.co/">https://vsbet.co/</a></li>
                  <li className="mb-0"><a target="_blank" href="https://vsbet.cc/">nhà cái vsbet</a></li>
                  <li className="mb-0"><a target="_blank" href="https://vsbet.br.com/">https://vsbet.br.com/</a></li>
                  <li className="mb-0"><a target="_blank" href="https://vsbets.co.com/">vsbet</a></li>
                  <li className="mb-0"><a target="_blank" href="https://vaboose.cn.com/">vs bet</a></li>

                  <li className="mb-0"><a target="_blank" href="https://socolivettbd.net/">socolive</a></li>
                  <li className="mb-0"><a target="_blank" href="https://90phutttbd.org/">90phut</a></li>
                  <li className="mb-0"><a target="_blank" href="https://lytuong.net/">xoilac</a></li>
                  <li className="mb-0"><a target="_blank" href="https://colatv48.live/">https://colatv48.live/</a></li>
                  <li className="mb-0"><a target="_blank" href="https://nhacaiuytin.guru/">https://nhacaiuytin.guru/</a></li>

                  <li className="mb-0"><a target="_blank" href="https://xoilactvv.com/">xoilac</a></li>
                  <li className="mb-0"><a target="_blank" href="https://xoilactvv.org/">xem bong da xoilac</a></li>
                  <li className="mb-0"><a target="_blank" href="https://xoilactvv.online/">xem bong da xoilac</a></li>
                  <li className="mb-0"><a target="_blank" href="https://xoilactvv.co/">xoilac tv</a></li>
                  <li className="mb-0"><a target="_blank" href="https://xoilactvv.football/">xem bóng đá xoilac</a></li>

                  <li className="mb-0"><a target="_blank" href="https://cakhiatvv.live/">cà khịa tv</a></li>
                  <li className="mb-0"><a target="_blank" href="https://cakhiatvv.online/">trực tiếp bóng đá hôm nay</a></li>
                  <li className="mb-0"><a target="_blank" href="https://cakhiatvv.ink/">cakhiatv trực tiếp bóng đá</a></li>
                  <li className="mb-0"><a target="_blank" href="https://90phuttv.in.net/">https://90phuttv.in.net/</a></li>
                  <li className="mb-0"><a target="_blank" href="https://90phuttv.futbol/">bóng đá trực tiếp</a></li>
                  <li className="mb-0"><a target="_blank" href="https://90phuttv.bid/">90phut tv</a></li>
                  <li className="mb-0"><a target="_blank" href="https://xembongda.ai/">xem bóng đá trực tiếp</a></li>
                  <li className="mb-0"><a target="_blank" href="https://xembongda.co.com/">xem trực tiếp bóng đá</a></li>
                  <li className="mb-0"><a target="_blank" href="https://xembongda.com.co/">xem bóng đá trực tuyến</a></li>
                  <li className="mb-0"><a target="_blank" href="https://tructiepbongda.fans/">xem bóng đá trực tiếp</a></li>
                  <li className="mb-0"><a target="_blank" href="https://tructiepbongda.fyi/">trực tiếp bóng đá</a></li>
                  <li className="mb-0"><a target="_blank" href="https://tructiepbongda.mobile/">xem trực tiếp bóng đá</a></li>
                  <li className="mb-0"><a target="_blank" href="https://xemcakhia.net/">cakhiatv</a></li>
                  <li className="mb-0"><a target="_blank" href="https://xoilac7.cc/">xoilac bóng đá</a></li>
                  <li className="mb-0"><a target="_blank" href="https://xoilactvv-live.com/">xoilac tv</a></li>

                  {/**Partners links */}
                  <li className="mb-0"><a target="_blank" href="https://www.bettingtips.co.ke">Betting tips</a></li>
                  <li className="mb-0"><a target="_blank" href="https://www.feedinco.com">Feedinco Betting tips</a></li>
                  <li className="mb-0"><a target="_blank" href="https://www.betrekatips.com">Betrekatips</a></li>
                  <li className="mb-0"><a target="_blank" href="https://todayspredict.com">Today's Football Prediction</a></li>
                  <li className="mb-0"><a target="_blank" href="https://tips100.com">100 Sure Straight Wins</a></li>
                  <li className="mb-0"><a target="_blank" href="https://tipsxtra.com">Tipsxtra</a></li>
                  <li className="mb-0"><a target="_blank" href="https://sportiya.com/raja-win678-com">Raja Win678.com</a></li>
                  <li className="mb-0"><a target="_blank" href="https://forebetpredict.com/soccervista">Soccervista</a></li>
                  <li className="mb-0"><a target="_blank" href="https://thisweekpoolresult.com">This Week Pool Result</a></li>
                  <li className="mb-0"><a target="_blank" href="http://100percentwinnings.com">100 Percent Winning Tips</a></li>
                  <li className="mb-0"><a target="_blank" href="https://www.fulltimepredict.com">fulltimepredict</a></li>
                </ul>
            </div>
        </div>
        
        <hr className="my-3"/>

        <div className="responsible-gambling text-center fixturesTextSize" style={{fontSize: "12px", lineHeight: "1.6"}}>
          <strong>⚠️ Responsible Gambling:</strong> Pitch Predictions provides predictions and analysis 
          for informational and entertainment purposes only. Betting involves financial risk — 
          never bet more than you can afford to lose. Gambling can be addictive. 
          If gambling is affecting you or someone you know, seek help at{" "}
          <a 
            href="https://www.begambleaware.org" 
            target="_blank" 
            rel="nofollow noopener noreferrer"
            className="text-warning"
          >
            BeGambleAware.org
          </a>{" "}
          or contact your national gambling helpline. You must be 18 years or older to use betting services. 
          Pitch Predictions does not guarantee any prediction outcomes.
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
