async function FetchTrendsByCountry(country_name) {
    const headers =  {
        "Content-type": "application/json; charset=UTF-8",
        Origin: "https://www.pitchpredictions.com", Authorization: `Bearer ${process.env.ACCESS_TOKEN || "UJlhuDILIR1Lc2IEwZDIKOln9d"}`
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