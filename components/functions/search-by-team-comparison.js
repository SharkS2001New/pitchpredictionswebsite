async function FetchSearchResultsForTeamComparison(search_query) {
    const headers =  {
        "Content-type": "application/json; charset=UTF-8",
        "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2"
    }

    const search_url = "https://api.pitchpredictions.com/api/search-by-team-name-team-comparison";

    const response = await fetch(search_url,{
        method: 'POST',
        body: JSON.stringify({search_query: search_query}),
        headers:headers,
    });

    var results = await response.json();  

    var search_res_data = results.data;

    return search_res_data;
    
}

export default FetchSearchResultsForTeamComparison;