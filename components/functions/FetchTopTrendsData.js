async function FetchTopTrendsData() {
    const headers =  {
        "Content-type": "application/json; charset=UTF-8",
        "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2"
    }

    try {
        const response = await fetch("https://api.pitchpredictions.com/api/fetch_teams_stats_by_fixture?fixture_date="+new Date().toISOString().slice(0, 10), {
            headers: headers
        });

        
        const data = await response.json();

        return data;

    } catch (error) {
        console.error(error);

        // setEndPointStatus("error");
    }
}

export default FetchTopTrendsData;