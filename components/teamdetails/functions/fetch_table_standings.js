//Fetch standings data  by league id
const headers =  {
    "Content-type": "application/json; charset=UTF-8",
    Origin: "https://www.pitchpredictions.com", Authorization: `Bearer ${process.env.ACCESS_TOKEN || "UJlhuDILIR1Lc2IEwZDIKOln9d"}`
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