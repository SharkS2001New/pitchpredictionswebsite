function FilterLiveOverallDoubleChanceUnderOverHTFTPred1x2(props){
    return(
      <div className="tabs" style={{margin: "auto",}}>
        <div className="tabs__group">
              <a
                href={"/live-football-predictions"} className="tabs__tab"
                id={props.url_filter == "live-football-predictions" ? "activeElement1" : ""}
              >
                Predictions 1X2
              </a>            
        </div>
      </div>
    )
}

export default FilterLiveOverallDoubleChanceUnderOverHTFTPred1x2;