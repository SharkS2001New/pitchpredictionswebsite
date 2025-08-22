async function getTeamsStatsByFixture(fixtureIdInteger) {
    const headers =  {
        "Content-type": "application/json; charset=UTF-8",
        "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2"
    }

    try {
        const response = await fetch("https://api.pitchpredictions.com/api/fetch_trends_data_by_fixture_id?fixture_id="+fixtureIdInteger, {
            headers: headers
        });

        const data = await response.json();
        
        return data;

    } catch (error) {
        console.error(error);

        // setEndPointStatus("error");
    }
}

export default getTeamsStatsByFixture;