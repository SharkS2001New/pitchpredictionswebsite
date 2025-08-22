//Fetch filters
const headers =  {
    "Content-type": "application/json; charset=UTF-8",
    "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2"
}

//fetch last 6 matches home
async function fetchTeamsLast6Matches(team_matches_url, teamId, unformatedDate) {
    // Fetch fixtures 
    const response1 = await fetch(team_matches_url,{
        method: 'POST',
        body: JSON.stringify({team_id: teamId,
            fixture_date: unformatedDate}),
        headers: headers,
    });            

    var data = await response1.json();  
    
    return data;     
}

export default  fetchTeamsLast6Matches;