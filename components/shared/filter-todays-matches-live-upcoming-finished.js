function FilterTodaysMatchesLiveUpcomingFinished(props){
    return(
      <div className="tabs" style={{margin: "auto"}}>
        <div className="tabs__group">
              <a
                href={"/football-predictions-today"} className="tabs__tab"
                id={props.url_filter == "football-predictions-today" || props.url_filter =="football-predictions-today/double-chance-predictions" ||
                 props.url_filter =="football-predictions-today/predictions-halftime-fulltime" ||
                 props.url_filter =="football-predictions-today/predictions-under-over" ||
                 props.url_filter =="football-predictions-today/predictions-both-to-score" ? "activeElement1" : ""}
              >
                All Matches
              </a>             
              <a
                href={"/upcoming-football-predictions"} className="tabs__tab"
                id={props.url_filter == "upcoming-football-predictions" ||
                props.url_filter =="upcoming-football-predictions/double-chance-predictions" ||
                props.url_filter =="upcoming-football-predictions/predictions-halftime-fulltime" ||
                props.url_filter =="upcoming-football-predictions/predictions-under-over" ||
                props.url_filter =="upcoming-football-predictions/predictions-both-to-score" ? "activeElement1" : ""}
              >
                <i className="bi bi-clock-fill" style={{fontWeight: "bold"}}></i> &nbsp;Upcoming
              </a>
              <a
                href={"/live-football-predictions"} className="tabs__tab"
                id={props.url_filter == "live-football-predictions" ||
                props.url_filter =="live-football-predictions/double-chance-predictions" ||
                props.url_filter =="live-football-predictions/predictions-halftime-fulltime" ||
                props.url_filter =="live-football-predictions/predictions-under-over" ||
                props.url_filter =="live-football-predictions/predictions-both-to-score" ? "activeElement1" : ""}
              >
                 <i className="bi bi-hourglass-split" style={{fontWeight: "bold"}}></i>&nbsp; Live
              </a>
              <a
                href={"/football-predictions-today/finished"} className="tabs__tab"
                id={props.url_filter == "football-predictions-today/finished" ||
                props.url_filter =="football-predictions-today/finished/double-chance-predictions" ||
                props.url_filter =="football-predictions-today/finished/predictions-halftime-fulltime" ||
                props.url_filter =="football-predictions-today/finished/predictions-under-over" ||
                props.url_filter =="football-predictions-today/finished/predictions-both-to-score"  ? "activeElement1" : ""}>
                <i className="bi bi-clock-history" style={{fontWeight: "bold"}}></i>&nbsp; Finished
              </a>            
        </div>
      </div>
    )
}

export default FilterTodaysMatchesLiveUpcomingFinished;