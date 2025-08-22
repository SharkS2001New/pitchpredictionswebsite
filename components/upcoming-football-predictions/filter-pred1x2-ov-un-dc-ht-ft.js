function FilterUpcomingOverallDoubleChanceUnderOverHTFTPred1x2(props){
    return(
      <div className="tabs" style={{margin: "auto",}}>
        <div className="tabs__group">
              <a
                href={"/upcoming-football-predictions"} className="tabs__tab"
                id={props.url_filter == "upcoming-football-predictions" ? "activeElement1" : ""}
              >
                Predictions 1X2
              </a>             
              <a
                href={"/upcoming-football-predictions/double-chance-predictions"} className="tabs__tab"
                id={props.url_filter == "upcoming-football-predictions/double-chance-predictions" ? "activeElement1" : ""}
              >
               &nbsp;Double chance
              </a>
              <a
                href={"/upcoming-football-predictions/predictions-halftime-fulltime"} className="tabs__tab"
                id={props.url_filter == "upcoming-football-predictions/predictions-halftime-fulltime" ? "activeElement1" : ""}
              >
                &nbsp; HT/FT
              </a>
              <a
                href={"/upcoming-football-predictions/predictions-under-over"} className="tabs__tab"
                id={props.url_filter == "upcoming-football-predictions/predictions-under-over" ? "activeElement1" : ""}>
                &nbsp; Over/Under(2.5)
              </a>   
              <a
                href={"/upcoming-football-predictions/predictions-both-to-score"} className="tabs__tab"
                id={props.url_filter == "upcoming-football-predictions/predictions-both-to-score" ? "activeElement1" : ""}>
                &nbsp; Both To Score
              </a>            
        </div>
      </div>
    )
}

export default FilterUpcomingOverallDoubleChanceUnderOverHTFTPred1x2;