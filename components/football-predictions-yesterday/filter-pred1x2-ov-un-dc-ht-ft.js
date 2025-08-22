function FilterYesterdayOverallDoubleChanceUnderOverHTFTPred1x2(props){
    return(
      <div className="tabs" style={{margin: "auto",}}>
        <div className="tabs__group">
              <a
                href={"/football-predictions-yesterday"} className="tabs__tab"
                id={props.url_filter == "football-predictions-yesterday" ? "activeElement1" : ""}
              >
                Predictions 1X2
              </a>             
              <a
                href={"/football-predictions-yesterday/double-chance-predictions"} className="tabs__tab"
                id={props.url_filter == "football-predictions-yesterday/double-chance-predictions" ? "activeElement1" : ""}
              >
               &nbsp;Double chance
              </a>
              <a
                href={"/football-predictions-yesterday/predictions-halftime-fulltime"} className="tabs__tab"
                id={props.url_filter == "football-predictions-yesterday/predictions-halftime-fulltime" ? "activeElement1" : ""}
              >
                &nbsp; HT/FT
              </a>
              <a
                href={"/football-predictions-yesterday/predictions-under-over"} className="tabs__tab"
                id={props.url_filter == "football-predictions-yesterday/predictions-under-over" ? "activeElement1" : ""}>
                &nbsp; Over/Under(2.5)
              </a>   
              <a
                href={"/football-predictions-yesterday/predictions-both-to-score"} className="tabs__tab"
                id={props.url_filter == "football-predictions-yesterday/predictions-both-to-score" ? "activeElement1" : ""}>
                &nbsp; Both To Score
              </a>            
        </div>
      </div>
    )
}

export default FilterYesterdayOverallDoubleChanceUnderOverHTFTPred1x2;