function FiltersTeamDetails(props){
    return(
    <div className="tabs">
        <div className="tabs__group">
              <a
                href={"/team/" + props.match_url+"/results"} className="tabs__tab"
                id={props.url_filter == "team/[team-details]/results" ? "activeElement1" : ""}
              >
                Results
              </a>
              {props.league_type ==="League" ? 
                <a
                  href={"/team/" + props.match_url + "/standings"} className="tabs__tab"
                  id={props.url_filter == "team/[team-details]/standings" ? "activeElement1" : ""}>
                  Standings
                </a>
              : "" }
              <a
                href={"/team/" + props.match_url + "/upcoming-matches"} className="tabs__tab"
                id={props.url_filter == "team/[team-details]/upcoming-matches" ? "activeElement1" : ""}
              >
                Next Matches
              </a>
              <a
                href={"/team/" + props.match_url + "/players"} className="tabs__tab"
                id={props.url_filter == "team/[team-details]/players" ? "activeElement1" : ""}
              >
                Players
              </a>
        </div>
      </div>
    )
}
export default FiltersTeamDetails;