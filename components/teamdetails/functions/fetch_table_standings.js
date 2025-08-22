//Fetch standings data  by league id
const headers =  {
    "Content-type": "application/json; charset=UTF-8",
    "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2"
}
    
async function fetchTableStandings(leagueId) {
    // Fetch fixtures 
    const response1 = await fetch("https://api.pitchpredictions.com/api/fetch_team_standings",{
        method: 'POST',
        body: JSON.stringify({league_id: leagueId}),
        headers: headers,
    });

    var data = await response1.json();  

    return data;
}

export default fetchTableStandings;