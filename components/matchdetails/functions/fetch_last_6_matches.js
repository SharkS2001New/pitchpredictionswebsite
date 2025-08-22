//fetch last 6 matches home
async function fetchLast6MatchesHome(home_team_matches_url,home_team_id,unformated_date) {
    const headers =  {
        "Content-type": "application/json; charset=UTF-8",
        "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2"
    }

    // Fetch fixtures 
    const response1 = await fetch(home_team_matches_url,{
        method: 'POST',
        body: JSON.stringify({home_team_id: home_team_id,
            fixture_date: unformated_date}),
        headers:headers,
    });            

    var data = await response1.json();  

    return data;
}

export default fetchLast6MatchesHome;