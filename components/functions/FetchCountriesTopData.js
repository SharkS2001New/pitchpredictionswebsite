async function getCountriesTopData(country_name) {
    const headers = { "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2" }; // This is the authorization header from the backend.sokapedia.com

    const url_for_filters = "https://api.pitchpredictions.com/api/fetch_countries_top_data?country_name="+country_name;

    //Fetch fixtures 
    const response = await fetch(url_for_filters,{
        headers: headers
    });

    var data = await response.json();  

    // var processing_data = data.data;
    return data;
}

export default getCountriesTopData;