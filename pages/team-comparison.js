import React, { useState, useEffect } from "react";
import FetchSearchResultsForTeamComparison from "../components/functions/search-by-team-comparison";
import fetchTeamsLast6Matches from "../components/teamdetails/functions/fetch_last_6_matches";
import getFormattedCurrentDate from "../components/functions/GetTodaysDate";
import TeamComparisonDataPage from "../components/team-comparisons/team-comparison-page";
import H2HTeamComparisons from "../components/team-comparisons/head-to-head-team-comparison";
import { Adsense } from "@ctrl/react-adsense";
import InPagePreLoader from "../components/includes/inpagepreloader";

function TeamComparison() {
    const [homeSearchResults, setHomeSearchResults] = useState([]);
    const [awaySearchResults, setAwaySearchResults] = useState([]);
    const [team_last6_matches_when_home, setTeamLast6MatchesHome] = useState([]);
    const [team_last6_matches_when_away, setTeamLast6MatchesAway] = useState([]);

    const [homeSearchQuery, setHomeSearchQuery] = useState("");
    const [awaySearchQuery, setAwaySearchQuery] = useState("");

    const [homeTeamSelectedName, setHomeTeamSelectedName] = useState("");
    const [awayTeamSelectedName, setAwayTeamSelectedName] = useState("");

    const [homeTeamId, setHomeTeamId] = useState(0);
    const [awayTeamId, setAwayTeamId] = useState(0);
  
    const [h2h_match_details, setH2HMatchDetails] = useState([]);
    const [loading, setLoading] = useState([]);

    const closeHomeForm = () => {
      setHomeSearchResults([]);
    };
  
    const closeAwayForm = () => {
      setAwaySearchResults([]);
    };
  
    const searchHomeTeamOnChange = (inputed_search_query) => {
      if (inputed_search_query.length >= 3) {
        setHomeSearchQuery(inputed_search_query);

        FetchSearchResultsForTeamComparison(inputed_search_query).then((response) => {
          setHomeSearchResults([]);

          setHomeSearchResults(response);
        });
      }else{
        setHomeSearchResults([]);
      }
    };
  
    const searchAwayTeamOnChange = (inputed_search_query) => {
      if (inputed_search_query.length >= 3) {
        setAwaySearchQuery(inputed_search_query);

        FetchSearchResultsForTeamComparison(inputed_search_query).then((response) => {
          setAwaySearchResults([]);

          setAwaySearchResults(response);
        });
      }else{
        setAwaySearchResults([]);
      }
    };

    const homeTeamClick = (home_team_name_selected,home_team_id) => {
      // Set the value of the input text element with id 'txtHomeTeamId'
      const txtHomeTeamNameElement = document.getElementById('homeSearchInput');
      const txtHomeTeamIdElement = document.getElementById('txtHomeTeamId');

      if (txtHomeTeamIdElement) {
        txtHomeTeamNameElement.value = home_team_name_selected;

        txtHomeTeamIdElement.value = home_team_id;

        setHomeTeamSelectedName(home_team_name_selected);
        setHomeTeamId(home_team_id);

        closeHomeForm();
      }
    }

    const awayTeamClick = (away_team_name_selected,away_team_id) => {
      const txtAwayTeamNameElement = document.getElementById('awaySearchInput');
      const txtAwayTeamIdElement = document.getElementById('txtAwayTeamId');

      if (txtAwayTeamIdElement) {
        txtAwayTeamNameElement.value = away_team_name_selected;

        txtAwayTeamIdElement.value = away_team_id;

        setAwayTeamSelectedName(away_team_name_selected);
        setAwayTeamId(away_team_id);

        closeAwayForm();
      }
    }

    const btnCompareTeams = ()=> {      
      const h2h_url = "https://api.pitchpredictions.com/api/fetch_h2h_fixtures";

      const team_matches_url = "https://api.pitchpredictions.com/api/fetch_teams_matches_both_sides";
      const txtHomeTeamIdElement = document.getElementById('txtHomeTeamId');
      const txtAwayTeamIdElement = document.getElementById('txtAwayTeamId');
      const currentDate = getFormattedCurrentDate();

      if(document.getElementById('homeSearchInput').value != "" && document.getElementById('awaySearchInput').value !="")
      {
        getH2HData(h2h_url,txtHomeTeamIdElement.value,txtAwayTeamIdElement.value,currentDate);
    
        fetchTeamsLast6Matches(team_matches_url,txtHomeTeamIdElement.value,currentDate).then(data => {  
          if(data.status == true){
              var matches_data = data.data;
                              
              setTeamLast6MatchesHome(matches_data);
          }
        });

        fetchTeamsLast6Matches(team_matches_url,txtAwayTeamIdElement.value,currentDate).then(data => {  
          if(data.status == true){
              var matches_data = data.data;
                
              setTeamLast6MatchesAway(matches_data);  
          }
        });
       
      } else if(document.getElementById('homeSearchInput').value == "") {
        alert("Team A is required");
      }else if(document.getElementById('awaySearchInput').value ==""){
        alert("Team B is required");
      }
    }

    async function getH2HData(url1,pHometeamId,pAwayteamId,pDate) {
      // Show preloader
      setLoading(true);

      const headers =  {
          "Content-type": "application/json; charset=UTF-8",
          "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2"
      }

     try {
          // Fetch fixtures 
          const response1 = await fetch(url1,{
              method: 'POST',
              body: JSON.stringify({home_team_id: pHometeamId, away_team_id: pAwayteamId, fixture_date: pDate}),
              headers: headers,
          });

          var data1 = await response1.json();  

          if(data1.status == true){
              var h2h_data = data1.data;
            
              setH2HMatchDetails(h2h_data);

          } else {
            setH2HMatchDetails([]);
          }
      } catch (error) {
          console.error(error);
      } finally {
        // Hide preloader
        setLoading(false);
      }   
    }

  
    return (
      <div className="sites-card">
        {team_last6_matches_when_away.length >0 || team_last6_matches_when_home.length >0 || h2h_match_details.length >0 ? 
        <><br/></> 
        :
        <React.Fragment>
          <div className="row container">
            <h2 className="sectionTitle text-center">How To compare Teams Perfomances.</h2>
            <div>
              <ol>
                <li>Type the team name in the "Team A" input field, ensuring it is at least 3 letters long. As you type, suggestions will appear, and you should select the desired team from the suggestions.</li>
                <li>Type a keyword in the "Team B" input field. Again, suggestions will appear as you type, and you should select the desired team from the suggestions.</li>
                <li>After selecting teams for both "Team A" and "Team B," click on the "Compare Teams" button.</li>
                <li>Wait for the results to appear below.</li>
              </ol>
            </div>
          </div>
          <hr/>
        </React.Fragment>
      }
        <div className="row container">
          <div className="col-md-6 mb-2">
              <HomeSearchForm
                label="Team A"
                onChange={searchHomeTeamOnChange}
                searchResults={homeSearchResults}
                closeForm={closeHomeForm}
                searchQuery={homeSearchQuery}
                onClick={homeTeamClick}
              />
          </div>
          <div className="col-md-6 mb-2">
              <AwaySearchForm
                label="Team B"
                onChange={searchAwayTeamOnChange}
                searchResults={awaySearchResults}
                closeForm={closeAwayForm}
                searchQuery={awaySearchQuery}
                onClick={awayTeamClick}
              />
          </div>
        </div>
        <div className="row container">
          <div className="col-md-3"></div>
          <div className="col-md-6 text-center">
            <button type="button" className="btn btn-danger" onClick={btnCompareTeams}>Compare Teams</button>
          </div>
          <div className="col-md-3"></div>
        </div>
        <br/>
        {loading == false ?
          h2h_match_details.length >0 ?
          <div className="center container-fluid">
            <H2HTeamComparisons  props={h2h_match_details} home_team_id= {homeTeamId} away_team_id={awayTeamId}/>
          </div>
        : <></>:
        <React.Fragment>
          <div className="row">
              <div className="text-center fw-bold sectionTitle">HEAD-TO-HEAD MATCHES</div>
          </div> 
          <div className="responsive-row header matchdetailsheader" style={{cursor : "auto"}}>
              <div className="responsive-cell team-link-probability">Date</div>
              <div className="responsive-cell team-link-probability" style={{textAlign: "left"}}>League</div>
              <div className="responsive-cell team-link" style={{textAlign: "left"}}>Match</div>
              <div className="responsive-cell">Score</div>
          </div>
          <InPagePreLoader/>
        </React.Fragment>
         }
      <br/>
      <div className="row text-center">
          <div className="col-md-6 col-12">
            {/* Matches played home and away */}
            {team_last6_matches_when_home.length >0 ?
            <TeamComparisonDataPage
              props={team_last6_matches_when_home}
              team_id={homeTeamId} // Replace 'teamId' with the actual team ID you want to pass as a prop
              filter_date={getFormattedCurrentDate()}
              title={"Games Played By - " + homeTeamSelectedName}
              team_name={homeTeamSelectedName}
            />
            : homeTeamSelectedName != "" }
          </div>
          <div className="col-md-6 col-12">
            {/* Matches played home and away */}
            {team_last6_matches_when_away.length >0 ?
            <TeamComparisonDataPage
              props={team_last6_matches_when_away}
              team_id={awayTeamId} // Replace 'teamId' with the actual team ID you want to pass as a prop
              filter_date={getFormattedCurrentDate()}
              title={"Games Played By - " + awayTeamSelectedName}
              team_name={awayTeamSelectedName}
            />
            : awayTeamSelectedName != ""  }
          </div>
      </div>
        <br/> 
        <Adsense
          client="ca-pub-5665711413000284"
          slot="3850951453"
          style={{ display: "block" }}
          layout="display"
          format="auto"
        /> 
        <br/>         
        <br/>
      </div>
    );
}
  
export default TeamComparison;
  
const HomeSearchForm = ({ label, onChange, searchResults, onClick}) => {
  return (
      <form onSubmit={e => { e.preventDefault(); }}>
        <div className="mb-3">
            <label className="form-label" style={{fontWeight: "bold"}}>{label}</label>
            <input
              className="form-control h-100"
              type="text"
              onChange={(e) => onChange(e.target.value)}
              placeholder="Type Min. 3 characters to search..."
              id="homeSearchInput"
              style={{borderColor: "black"}}
            />
            <input type="hidden" className="form-control" id="txtHomeTeamId" />
        </div>
        {searchResults.length > 0 && (
            <div id="homeSearchResultsForm">
            {searchResults.slice(0, 10).map((result, index) => (
                <div key={index}>
                  <div className="responsive-row searchboxTxt2 fixturesTextSize m-2">
                      <div className="col-10" onClick={(e) => onClick(result.search_team_name, result.search_team_id)}>
                          {result.search_team_name}
                      </div>
                  </div>
                </div>
            ))}
            </div>
        )} 
      </form>
  );
};

const AwaySearchForm = ({ label, onChange, searchResults, onClick }) => {
  return (
      <form onSubmit={e => { e.preventDefault(); }}>
        <div className="mb-3">
            <label className="form-label" style={{fontWeight: "bold"}}>{label}</label>
            <input
              className="form-control h-100"
              type="text"
              onChange={(e) => onChange(e.target.value)}
              placeholder="Type Min. 3 characters to search..."
              id="awaySearchInput"
              style={{borderColor: "black"}}
            />
            <input type="hidden" className="form-control" id="txtAwayTeamId" /> 
        </div>
        {searchResults.length > 0 && (
            <div id="awaySearchResultsForm">
            {searchResults.slice(0, 10).map((result, index) => (
                <div key={index}>
                  <div className="responsive-row searchboxTxt2 fixturesTextSize m-2">
                      <div className="col-10" onClick={(e) => onClick(result.search_team_name,result.search_team_id)}>
                          {result.search_team_name}
                      </div>
                  </div>
                </div>
            ))}
            </div>
        )}
      </form>
  );
};
  