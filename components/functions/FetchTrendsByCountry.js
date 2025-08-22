async function FetchTrendsByCountry(country_name) {
    const headers =  {
        "Content-type": "application/json; charset=UTF-8",
        "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2"
    }

    try {
        const response = await fetch("https://api.pitchpredictions.com/api/fetch_trends_data_by_country?country_name="+country_name, {
            headers: headers
        });
        
        const data = await response.json();

        return data;

    } catch (error) {
        console.error(error);

        // setEndPointStatus("error");
    }
}

export default FetchTrendsByCountry;