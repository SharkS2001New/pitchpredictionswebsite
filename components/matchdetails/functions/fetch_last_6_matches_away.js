 // Fetch last 6 matches away
 async function fetchLast6MatchesAway(away_team_matches_url,away_team_id, unformated_date) {
    const headers =  {
        "Content-type": "application/json; charset=UTF-8",
        "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2"
    }

    // Fetch fixtures 
    const response2 = await fetch(away_team_matches_url,{
        method: 'POST',
        body: JSON.stringify({away_team_id: away_team_id,fixture_date: unformated_date}),
        headers:headers,
    });

    var data = await response2.json();  

    return data;
}

export default fetchLast6MatchesAway;