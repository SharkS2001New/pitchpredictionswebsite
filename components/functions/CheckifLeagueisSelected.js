function CheckifLeagueisSelected(leagueId) {
    let leaguesarray  = JSON.parse(localStorage.getItem("favoriteleagues"));

    if(leaguesarray !== null){

        const containsLeague = leaguesarray.leaguesarray.some(obj => obj.league_id === leagueId);
        
        return containsLeague;
    }  
}

export default CheckifLeagueisSelected;