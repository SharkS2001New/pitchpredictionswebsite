function FilterByDateOverallDoubleChanceUnderOverHTFTPred1x2(props){
    return(
      <div className="tabs" style={{margin: "auto",}}>
        <div className="tabs__group">
              <a
                href={"/football-predictions-for-" + props.filter_date+"?filter_date="+ props.filter_date} className="tabs__tab"
                id={props.url_filter == "[football-prediction-for-date]" ? "activeElement1" : ""}
              >
                Predictions 1X2
              </a>             
              <a
                href={"/football-predictions/double-chance-predictions?filter_date="+ props.filter_date} className="tabs__tab"
                id={props.url_filter == "football-predictions/double-chance-predictions" ? "activeElement1" : ""}
              >
               &nbsp;Double chance
              </a>
              <a
                href={"/football-predictions/predictions-halftime-fulltime?filter_date="+ props.filter_date} className="tabs__tab"
                id={props.url_filter == "football-predictions/predictions-halftime-fulltime" ? "activeElement1" : ""}
              >
                &nbsp; HT/FT
              </a>
              <a
                href={"/football-predictions/predictions-under-over?filter_date="+ props.filter_date} className="tabs__tab"
                id={props.url_filter == "football-predictions/predictions-under-over" ? "activeElement1" : ""}>
                &nbsp; Over/Under(2.5)
              </a>   
              <a
                href={"/football-predictions/predictions-both-to-score?filter_date="+ props.filter_date} className="tabs__tab"
                id={props.url_filter == "football-predictions/predictions-both-to-score" ? "activeElement1" : ""}>
                &nbsp; Both To Score
              </a>            
        </div>
      </div>
    )
}

export default FilterByDateOverallDoubleChanceUnderOverHTFTPred1x2;