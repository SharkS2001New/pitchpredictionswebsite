function FilterWeekendOverallDoubleChanceUnderOverHTFTPred1x2(props){
    return(
      <div className="tabs" style={{margin: "auto",}}>
        <div className="tabs__group">
              <a
                href={"/football-predictions-weekend"} className="tabs__tab"
                id={props.url_filter == "football-predictions-weekend" ? "activeElement1" : ""}
              >
                Predictions 1X2
              </a>             
              <a
                href={"/football-predictions-weekend/double-chance-predictions"} className="tabs__tab"
                id={props.url_filter == "football-predictions-weekend/double-chance-predictions" ? "activeElement1" : ""}
              >
               &nbsp;Double chance
              </a>
              <a
                href={"/football-predictions-weekend/predictions-halftime-fulltime"} className="tabs__tab"
                id={props.url_filter == "football-predictions-weekend/predictions-halftime-fulltime" ? "activeElement1" : ""}
              >
                &nbsp; HT/FT
              </a>
              <a
                href={"/football-predictions-weekend/predictions-under-over"} className="tabs__tab"
                id={props.url_filter == "football-predictions-weekend/predictions-under-over" ? "activeElement1" : ""}>
                &nbsp; Over/Under(2.5)
              </a>   
              <a
                href={"/football-predictions-weekend/predictions-both-to-score"} className="tabs__tab"
                id={props.url_filter == "football-predictions-weekend/predictions-both-to-score" ? "activeElement1" : ""}>
                &nbsp; Both To Score
              </a>            
        </div>
      </div>
    )
}

export default FilterWeekendOverallDoubleChanceUnderOverHTFTPred1x2;