import React, {useState} from 'react';

//  This code groups the props_data(leagues) by country in the uniqueCountries object, and then maps over the uniqueCountries object to render the accordion display
//  for each country. The list of leagues for each country is stored in the leagues variable. The leagues array is filtered to find the data for each league,
//   and that data is rendered in the accordion display.

const LeagusByCountryCollapsible = (props) => {
    const openSidemenu = () =>{
        document.body.classList.toggle('sb-sidenav-toggled');
        localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
    }

    let props_data = props.other_leagues;
    const [numCountries, setNumCountries] = useState(25);
    const [collapseStates, setCollapseStates] = useState({});

    const toggleCollapse = (countryName) => {
      setCollapseStates(prevStates => ({
        ...prevStates,
        [countryName]: !prevStates[countryName]
      }));
    };

    const uniqueCountries = {};
    
    try {
      if (props_data) {
        props_data.forEach(league => {
          const countryName = league.country_name;
          const countryLogo = league.downloaded_country_flag;
          const leagueName = league.league_name;
          const leagueId = league.league_id;
    
          let country = uniqueCountries[countryName];
    
          if (country) {
            country.data.push({ leagueName, leagueId, countryLogo }); // add countryLogo to the data object
            if (!country.leagues.includes(leagueName)) {
              country.leagues.push(leagueName);
            }
          } else {
            country = {
              data: [{ leagueName, leagueId, countryLogo }], // add countryLogo to the data object
              leagues: [leagueName]
            };
            uniqueCountries[countryName] = country;
          }
        });
      }
    } catch (error) {
      console.error("Error occurred while processing league data:", error);
    }

    const otherCompetionsCountries = {};
    let props_competions = props.other_competions;

    try {
      if (props_competions) {
        props_competions.forEach(league => {
          const countryName = league.country_name;
          const countryLogo = league.downloaded_country_flag;
          const leagueName = league.league_name;
          const leagueId = league.league_id;
    
          let country = otherCompetionsCountries[countryName];
    
          if (country) {
            country.data.push({ leagueName, leagueId, countryLogo }); // add countryLogo to the data object
            if (!country.leagues.includes(leagueName)) {
              country.leagues.push(leagueName);
            }
          } else {
            country = {
              data: [{ leagueName, leagueId, countryLogo }], // add countryLogo to the data object
              leagues: [leagueName]
            };
            otherCompetionsCountries[countryName] = country;
          }
        });
      }
    } catch (error) {
      console.error("Error occurred while processing league data:", error);
    }

    const combinedData = { ...uniqueCountries, ...otherCompetionsCountries };

    const popularLeaguesDisplay = Object.keys(combinedData).slice(0, numCountries).map((countryName, index) => {
    const leagues = combinedData[countryName].data;
    const isLastRow = index === numCountries - 1 && numCountries < Object.keys(combinedData).length;
    const isActiveCountry = countryName.toLowerCase() === props.countryName.toLowerCase();
    const isActiveLeague = leagues.some(league => league.leagueId === props.leagueId);

      return (
        <React.Fragment key={index}>
          {/**Create Other Competions title */}
          {countryName === "Africa" && (
            <div className="border-bottom" id="otherCompetitionsMenu"><br/>
              <div className="d-flex align-items-center">
                <span className="list-group-item list-group-item-action p-1" type="button" style={{ display: "flex", justifyContent: "space-between", alignItems: "left", color: "white", fontWeight: "bold", backgroundColor: "#202c3c" }}>
                  Other Competitions
                </span>
              </div>
            </div>
          )}
          <div className="list-group list-group-flush collapsibleNav" id={countryName + "Menu"} >
            <div className="d-flex align-items-center">
              <a
                href={encodeURI("/country/football-predictions-for-" + countryName.replace(/[&\s]+/g, "-").toLowerCase() + "/fixtures")}
                className={`list-group-item list-group-item-action sideNavCustom1 countryNameLink p-1 ${countryName.toLowerCase() === props.countryName.toLowerCase() && "activeElement"}`}
                type="button"
                style={{ display: "flex", justifyContent: "space-between", alignItems: "left" }}
                onClick={openSidemenu}
                title={countryName}>
                {countryName}
              </a>
              <span
                data-bs-toggle="collapse"
                data-bs-target={"#" + countryName.replace(/[&\s]+/g, "-") + "Collapse"}
                role="button"
                aria-expanded={collapseStates[countryName] ? "true" : "false"}
                aria-controls={countryName.replace(/[&\s]+/g, "-") + "Collapse"}
                style={{ marginLeft: "auto", cursor: "pointer", color: "white" }}
                onClick={() => toggleCollapse(countryName)}>
                {collapseStates[countryName] ? (
                  <i className="bi bi-node-minus-fill" role="button" aria-label="Name" aria-labelledby="labeldiv" style={{fontSize: "15px"}}></i>
                ) : (
                  <i className="bi bi-node-plus-fill" role="button" aria-label="Name" aria-labelledby="labeldiv" style={{fontSize: "15px"}}></i>
                )}
              </span>
            </div>
          </div>
          
          <div id={countryName.replace(/[&\s]+/g, "-") + "Collapse"} className={`collapse ${isActiveCountry || isActiveLeague ? "show" : ""}`} aria-labelledby={countryName + "Menu"} data-bs-parent="#accordionMenu">
          <div className="card-body">
            {leagues.map((league, index) => (
              <div key={league.leagueId} style={{ display: 'flex', alignItems: 'center' }} className="d-flex align-items-left leagueNameWrapper">
                <a
                  href={"/league/football-predictions-for-"+countryName.toLowerCase()+"/"+encodeURIComponent(league.leagueName.toLowerCase().replace(/[&\s]+/g, "-"))+'-'+league.leagueId+"/fixtures"}
                  className={`list-group-item ml-2 list-group-item-action sideNavCustom1 countryNameLink  ${"others"+league.leagueId === "others"+props.leagueId ? 'activeElement' : ''}  ${league.leagueId === props.leagueId ? "active" : ""}`}
                  onClick={openSidemenu}
                  title={league.leagueName}
                >
                  {league.leagueName}
                </a>
              </div>
            ))}
          </div>
        </div>
    
          {isLastRow && (
            <button
              className="list-group-item p-1 btn btn-link"
              onClick={() => setNumCountries(Object.keys(combinedData).length)}
              style={{ color: "#ff0046", textDecoration: "underline", fontWeight: "bold",border: "none", textAlign: "left" }}
            >
              Show More &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <i className="bi bi-arrow-down-short"></i>
            </button>
          )}
        </React.Fragment>
      );
    });
    
    return popularLeaguesDisplay;
       
};
  
export default LeagusByCountryCollapsible;
  