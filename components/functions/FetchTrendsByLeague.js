async function FetchTrendsByLeague(league_id) {
    const headers =  {
        "Content-type": "application/json; charset=UTF-8",
        Origin: "https://www.pitchpredictions.com", Authorization: `Bearer ${process.env.ACCESS_TOKEN || "UJlhuDILIR1Lc2IEwZDIKOln9d"}`
    }

    try {
        const response = await fetch("https://develop.pitchpredictions.com/api/fetch_trends_data_by_league_id?league_id="+league_id, {
            headers: headers
        });
        
        const data = await response.json();

        return data;

    } catch (error) {
        console.error(error);

        // setEndPointStatus("error");
    }
}

export default FetchTrendsByLeague;