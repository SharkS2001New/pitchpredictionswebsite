function FiltersMatchDetails(props){
    return(
      <div className="tabs">
        <div className="tabs__group">             
              <a
                href={"/match/football-predictions-" + props.match_url + "/matches"} className="tabs__tab"
                id={props.url_filter == "match/[match-details]/matches" ? "activeElement1" : ""}
              >
                Matches
              </a>
              {/* <a
                href={"/match/football-predictions-" + props.match_url+"/overall-statistics"} className="tabs__tab"
                id={props.url_filter == "match/[match-details]/overall-statistics" ? "activeElement1" : ""}
              >
                Overall Stats
              </a> */}
              {props.league_type === "League" ?
                <a
                  href={"/match/football-predictions-" + props.match_url + "/standings"} className="tabs__tab"
                  id={props.url_filter == "match/[match-details]/standings" ? "activeElement1" : ""}>
                  Standings
                </a>
              : "" }
              <a
                href={"/match/football-predictions-" + props.match_url + "/upcoming-matches"} className="tabs__tab"
                id={props.url_filter == "match/[match-details]/upcoming-matches" ? "activeElement1" : ""}
              >
                Next Matches
              </a>
        </div>
      </div>
    )
}

export default FiltersMatchDetails;