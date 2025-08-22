function FiltersCountriesDetails(props){
    return(
    <div className="tabs">
        <div className="tabs__group">
            <a
                href={"/country/football-predictions-for-" + props.country_name+"/fixtures"} className="tabs__tab"
                id={props.url_filter == "country/[football-prediction-for-country]/fixtures" ? "activeElement1" : ""}
            >
                Fixtures
            </a>
            <a
                href={"/country/football-predictions-for-" + props.country_name + "/results"} className="tabs__tab"
                id={props.url_filter == "country/[football-prediction-for-country]/results" ? "activeElement1" : ""}
            >
                Results
            </a>
        </div>
    </div>
    )
}

export default FiltersCountriesDetails;