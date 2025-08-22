function FiltersTopFootballPredictions(props){
    return(
      <div className="tabs" style={{margin: "auto"}}>
        <div className="tabs__group">             
              <a
                href={"/top-football-tips-and-predictions/yesterday"} className="tabs__tab"
                id={props.url_filter == "top-football-tips-and-predictions/yesterday" ||
                props.url_filter =="top-football-tips-and-predictions/yesterday/double-chance-predictions" ||
                props.url_filter =="top-football-tips-and-predictions/yesterday/predictions-halftime-fulltime" ||
                props.url_filter =="top-football-tips-and-predictions/yesterday/predictions-under-over" ||
                props.url_filter =="top-football-tips-and-predictions/yesterday/predictions-both-to-score"
                 ? "activeElement1" : ""}
              >
                Yesterday
              </a>
              <a
                href={"/top-football-tips-and-predictions/today"} className="tabs__tab"
                id={props.url_filter == "top-football-tips-and-predictions/today" ||
                props.url_filter =="top-football-tips-and-predictions/today/double-chance-predictions" ||
                props.url_filter =="top-football-tips-and-predictions/today/predictions-halftime-fulltime" ||
                props.url_filter =="top-football-tips-and-predictions/today/predictions-under-over" ||
                props.url_filter =="top-football-tips-and-predictions/today/predictions-both-to-score"
                  ? "activeElement1" : ""}>
                Today
              </a>
              <a
                href={"/top-football-tips-and-predictions/tomorrow"} className="tabs__tab"
                id={props.url_filter == "top-football-tips-and-predictions/tomorrow" ||
                props.url_filter =="top-football-tips-and-predictions/tomorrow/double-chance-predictions" ||
                props.url_filter =="top-football-tips-and-predictions/tomorrow/predictions-halftime-fulltime" ||
                props.url_filter =="top-football-tips-and-predictions/tomorrow/predictions-under-over" ||
                props.url_filter =="top-football-tips-and-predictions/tomorrow/predictions-both-to-score"
                 ? "activeElement1" : ""}
              >
                Tomorrow
              </a>
        </div>
      </div>
    )
}

export default FiltersTopFootballPredictions;