//fetch last matches of the team when home
const headers =  {
    "Content-type": "application/json; charset=UTF-8",
    Origin: "https://www.pitchpredictions.com", Authorization: `Bearer ${process.env.ACCESS_TOKEN || "UJlhuDILIR1Lc2IEwZDIKOln9d"}`
}
async function fetchTeamsMatchesWhenHome(teamIdInteger, unformatedDate) {
    // Fetch fixtures 
    const response1 = await fetch("https://api.pitchpredictions.com/api/fetch_teams_matches_when_home",{
        method: 'POST',
        body: JSON.stringify({team_id: teamIdInteger,fixture_date: unformatedDate}),
        headers: headers,
    });            

    var data = await response1.json();        

    return data;
}

export default fetchTeamsMatchesWhenHome;