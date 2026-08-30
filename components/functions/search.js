async function FetchSearchResults(search_query) {
    const headers =  {
        "Content-type": "application/json; charset=UTF-8",
        Origin: "https://www.pitchpredictions.com", Authorization: `Bearer ${process.env.ACCESS_TOKEN || "UJlhuDILIR1Lc2IEwZDIKOln9d"}`
    }

    const search_url = "https://api.pitchpredictions.com/api/search_request_by_keyword";

    const response = await fetch(search_url,{
        method: 'POST',
        body: JSON.stringify({search_query: search_query}),
        headers:headers,
    });

    var results = await response.json();  

    var search_res_data = results.data;

    return search_res_data;
    
}

export default FetchSearchResults;