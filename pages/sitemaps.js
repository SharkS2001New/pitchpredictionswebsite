import React, { useState, useEffect } from 'react';
import jsonPopularLeagues from "../public/jsonfiles/popular-leagues.json";
import jsonOtherCompetitions from "../public/jsonfiles/other-competitions.json";
import jsonAllCountriesandLeagues from "../public/jsonfiles/other-leagues.json";

function SitemapsPage() {
  const [popularLeagues, setPopularLeagues] = useState([]);
  const [allCountries, setallCountries] = useState([]);
  const [otherCompetitions, setOtherCompetitions] = useState([]);

  useEffect(() => {
    //Fetch popular leagues from the database
    getPopularLeagues().then(data => {
      setPopularLeagues(data);
    })

    //Fetch other fixtures from the database
    getallCountries().then(data => {
      setallCountries(data);
    })

    getOtherCompetitions().then(data => {
      setOtherCompetitions(data);
    })
  }, [])

  //Fetch other leagues
  async function getPopularLeagues() {
    try {
      const data = jsonPopularLeagues.data;
      return data;

    } catch (error) {
      console.error(error);
      // Handle error here, e.g. show a message to the user
    }
  }

   //Fetch other competitions
   async function getOtherCompetitions() {
    try {
      const data = jsonOtherCompetitions.data;
      return data;

    } catch (error) {
      console.error(error);
      // Handle error here, e.g. show a message to the user
    }
  }

  async function getallCountries() {
    try {
      const data = jsonAllCountriesandLeagues.data;
      return data;

    } catch (error) {
      console.error(error);
      // Handle error here, e.g. show a message to the user
    }
  }

  //Popular leagues display
  var displayPopularLeagues = [];
  if(popularLeagues.length>0){
      for(var x = 0; x< popularLeagues.length;x++){
          displayPopularLeagues.push( 
            <div className="d-flex align-items-center"  key={x}>
              <li className="sitemapsFontSize">
                <a href={encodeURI("/league/football-predictions-for-"+popularLeagues[x].country_name.toLowerCase()+"/"+popularLeagues[x].league_name.replace(/\s+/g, '-').toLowerCase()+"-"+popularLeagues[x].league_id)+"/fixtures"} className="ml-2 aTxt"><h3 className="sitemapsFontSize">{popularLeagues[x].league_name}</h3></a>
              </li>
            </div>
        )
      }
  }

  const uniqueCountries = {};

  try {
    if (allCountries) {
      allCountries.forEach(league => {
        const countryName = league.country_name;
        const leagueName = league.league_name;
        const leagueId = league.league_id;

        let country = uniqueCountries[countryName];

        if (country) {
          country.data.push({ leagueName, leagueId });
          if (!country.leagues.includes(leagueName)) {
            country.leagues.push(leagueName);
          }
        } else {
          country = {
            data: [{ leagueName, leagueId }],
            leagues: [leagueName]
          };
          uniqueCountries[countryName] = country;
        }
      });
    }
  } catch (error) {
    console.error("Error occurred while processing league data:", error);
  }


  // other competitions
  const uniqueCompetitions = {};

  try {
    if (otherCompetitions) {
      otherCompetitions.forEach(league => {
        const countryName = league.country_name;
        const leagueName = league.league_name;
        const leagueId = league.league_id;

        let country = uniqueCompetitions[countryName];

        if (country) {
          country.data.push({ leagueName, leagueId });
          if (!country.leagues.includes(leagueName)) {
            country.leagues.push(leagueName);
          }
        } else {
          country = {
            data: [{ leagueName, leagueId }],
            leagues: [leagueName]
          };
          uniqueCompetitions[countryName] = country;
        }
      });
    }
  } catch (error) {
    console.error("Error occurred while processing league data:", error);
  }

  return (
  <div className="sites-card">
  <div className="container m-2">
    {/** Quick Links */}
    <div style={{ fontWeight: "bold" }} className="row">
      <div className="col">
        <h2 className="footerLinks">Quick Links</h2>
      </div>
    </div>
    <div className="d-flex align-items-center sitemapsFontSize">
      <ul>
        <li><a href="/football-predictions-today">Football Predictions Today</a></li>
        <li><a href="/live-football-predictions">Live Football Predictions</a></li>
        <li><a href="/upcoming-football-predictions"> Upcoming Football Predictions</a></li>
        <li><a href="/football-predictions-tomorrow">Football Predictions Tomorrows</a></li>
        <li><a href="/football-predictions-weekend">Football Predictions Weekend</a></li>
        <li><a href="/football-predictions-yesterday">Football Predictions Yesterday</a></li> 
        <li><a href="/top-football-tips-and-predictions/today">Top Predictions Today</a></li>
        <li><a href="/top-football-tips-and-predictions/tomorrow">Top Predictions Tomorrow</a></li>
        <li><a href="/top-football-tips-and-predictions/yesterday">Top Predictions Yesterday</a></li>
      </ul>
    </div>

      {/** Popular Leagues */}
    <div style={{ fontWeight: "bold" }} className="row">
      <div className="col">
        <h2 className="footerLinks">Popular Leagues</h2>
      </div>
    </div>
    <div className="d-flex align-items-center">
      <ul>
      {displayPopularLeagues}  
      </ul>
    </div>

    {/** All Countries and Leagues */}
    <div  className="row">
      <div className="col">
        <h2 className="footerLinks">All Countries and Leagues</h2>
      </div>
    </div>
    {Object.keys(uniqueCountries).map((countryName, index) => {
      const leagues = uniqueCountries[countryName].data;
      const numCols = 4;
      const numRows = Math.ceil(leagues.length / numCols);
      const rows = [];
      for (let i = 0; i < numRows; i++) {
        const cols = [];
        for (let j = 0; j < numCols; j++) {
          const leagueIndex = i * numCols + j;
          if (leagueIndex < leagues.length) {
            const league = leagues[leagueIndex];
            cols.push(
              <div key={league.leagueId} className="col-md-3 col-6 sitemapsFontSize">
                <a href={encodeURI(`/league/football-predictions-for-${countryName.toLowerCase()}/${league.leagueName.replace(/\s+/g, '-').toLowerCase()}-${league.leagueId}`)+"/fixtures"} className="ml-2 aTxt">
                  <h3>{league.leagueName}</h3>&nbsp;
                </a>
              </div>
            );
          }
        }
        rows.push(<div key={i} className="row">{cols}</div>);
      }
      return (
        <div key={index}>
          <div className="row sitemapsFontSize">
            <a href={encodeURI(`/country/football-predictions-for-${countryName.toLowerCase()}`)+"/fixtures"}>
              <h2 style={{ fontWeight: "bold", marginTop: "10px" }} className="sitemapsFontSize">{countryName}</h2>
            </a>
          </div>
          <ul>
            {leagues.map((league) => (
              <li key={league.leagueId} className="sitemapsFontSize">
                <a href={encodeURI("/league/football-predictions-for-"+countryName.toLowerCase()+"/"+league.leagueName.replace(/\s+/g, '-').toLowerCase()+"-"+league.leagueId)+"/fixtures"} className="ml-2 aTxt"><h3 className="sitemapsFontSize">{league.leagueName}</h3></a>
              </li>
            ))}
          </ul>
        </div>
      );
    })}

    {/** Other competitions display */}
    <br/>
    <div style={{ fontWeight: "bold" }} className="table-row">
      <div className="col">
        <h2 className="footerLinks">International Competitions</h2>
      </div>
    </div>
    {Object.keys(uniqueCompetitions).map((countryName, index) => {
      const leagues = uniqueCompetitions[countryName].data;
      const numCols = 4;
      const numRows = Math.ceil(leagues.length / numCols);
      const rows = [];
      for (let i = 0; i < numRows; i++) {
        const cols = [];
        for (let j = 0; j < numCols; j++) {
          const leagueIndex = i * numCols + j;
          if (leagueIndex < leagues.length) {
            const league = leagues[leagueIndex];
            cols.push(
              <div key={league.leagueId} className="col-md-3 col-6 sitemapsFontSize">
                <a href={encodeURI(`/league/football-predictions-for-${countryName.toLowerCase()}/${league.leagueName.replace(/\s+/g, '-').toLowerCase()}-${league.leagueId}`)+"/fixtures"} className="ml-2 aTxt">
                  <h3>{league.leagueName}</h3>&nbsp;
                </a>
              </div>
            );
          }
        }
        rows.push(<div key={i} className="row">{cols}</div>);
      }
      return (
        <div key={index} className="sitemapsFontSize">
          <div className="row">
            <a href={encodeURI(`/country/football-predictions-for-${countryName.toLowerCase()}`)+"/fixtures"}>
              <h2 style={{ fontWeight: "bold", marginTop: "10px" }} className="sitemapsFontSize">{countryName}</h2>
            </a>
          </div>
          <ul>
            {leagues.map((league) => (
              <li key={league.leagueId}>
                <a href={encodeURI("/league/football-predictions-for-"+countryName.toLowerCase()+"/"+league.leagueName.replace(/\s+/g, '-').toLowerCase()+"-"+league.leagueId)+"/fixtures"} className="ml-2 aTxt"><h3 className="sitemapsFontSize">{league.leagueName}</h3></a>
              </li>
            ))}
          </ul>
        </div>
      );
    })}
    {/** Other Links */}
    <div style={{ fontWeight: "bold" }} className="table-row">
      <div className="col">
        <h2 className="footerLinks">Other Links</h2>
      </div>
    </div>
    <div className="d-flex align-items-center sitemapsFontSize">
      <ul>
        <li><a href="/tips/sunpel">Sunpel</a></li>
        <li><a href="/tips/sokafans">Sokafans</a></li>
        <li><a href="/tips/betensured-predictions">Betensured</a></li>
        <li><a href="/tips/cheerplex">Cheerplex</a></li>
        <li><a href="/tips/mwanasoka">Mwanasoka</a></li>
        <li><a href="/tips/betnumbers-predictions">BetNumbers</a></li>
        <li><a href="/tips/1960tips">1960 tips</a></li>
        <li><a href="/tips/amazingstakes">Amazing Stakes</a></li>
        <li><a href="/tips/bet-of-the-day-tips">Bet of the day tips</a></li>
        <li><a href="/tips/betarazi">Betarazi</a></li>
        <li><a href="/tips/betwinner360">Betwinner360</a></li>
        <li><a href="/tips/correct-predict">Correct Predict</a></li>
        <li><a href="/tips/correct-score">Correct Score</a></li>
        <li><a href="/tips/direct-win-prediction">Direct Win Prediction</a></li>
        <li><a href="/tips/free-vip-tips-today">Free Vip Tips Today</a></li>
        <li><a href="/tips/liobet">Liobet</a></li>
        <li><a href="/tips/must-win-teams-today">Must win teams today</a></li>
        <li><a href="/tips/passion-predict">Passion Predict</a></li>
        <li><a href="/tips/prediction-vitibet-adibet">Prediction Vitibet Adibet</a></li>
        <li><a href="/tips/soccervista-prediction">Soccervista Prediction</a></li>
        <li><a href="/tips/sokapedia">Sokapedia</a></li>
        <li><a href="/1x2-betting-tips">1x2 betting tips</a></li>
        <li><a href="/tips/24-prediction-today">24 prediction today</a></li>
        <li><a href="/tips/55-sure-winning-tips-today">55 sure winning tips today</a></li>
        <li><a href="/tips/90-accurate-football-predictions">90 accurate football predictions</a></li>
        <li><a href="/tips/99-accurate-prediction-site">99 accurate prediction site</a></li>
        <li><a href="/tips/100-sure-wins-only">100 sure wins only</a></li>
        <li><a href="/tips/accumulator-tips">Accumulator tips</a></li>
        <li><a href="/tips/banker-of-the-day">Banker of the day</a></li>
        <li><a href="/tips/best-prediction-site">Best Prediction Site</a></li>
        <li><a href="/tips/fizzley-tips">Fizzley tips</a></li>
        <li><a href="/tips/king-prediction">King Prediction</a></li>
        <li><a href="/tips/odd-4-sure-wins">Odd 4 sure wins</a></li>
        <li><a href="/tips/solo-prediction">Solo Prediction</a></li>
        <li><a href="/tips/sure-tips">Sure Tips</a></li>
        <li><a href="/tips/take-the-risk">Take the risk</a></li>
        <li><a href="/tips/tips-spotika">Tips spotika</a></li>
        <li><a href="/tips/tips180">tips180</a></li>
        <li><a href="/tips/victor-predict">Victor predict</a></li>
        <li><a href="/tips/10-teams-to-win-today">10 teams to win today</a></li>
        <li><a href="/tips/100-percent-winning-tips">100 percent winning tips</a></li>
        <li><a href="/tips/feedinco">Feedinco</a></li>
        <li><a href="/tips/one-million-prediction">One million prediction</a></li>
        <li><a href="/jackpot-predictions">Jackpots</a></li>
        <li><a href="/jackpot-predictions/forebet-midweek-jackpot-predictions">Forebet midweek jackpot predictions</a></li>
      </ul>
    </div>

    {/** Footer Links */}
      <div style={{ fontWeight: "bold" }} className="table-row">
        <div className="col">
          <h2 className="footerLinks">Footer Links</h2>
        </div>
      </div>
      <div className="d-flex align-items-center sitemapsFontSize">
        <ul>
          <li><a href="/terms-and-conditions">Terms and Conditions</a></li>
          <li><a href="/privacy-policy">Privacy Policy</a></li>
          <li><a href="/contactus">Contact us</a></li>
          <li><a href="/sitemaps">Sitemaps</a></li>
        </ul>
      </div>
    </div>
  </div>
  );
}

export default SitemapsPage;
