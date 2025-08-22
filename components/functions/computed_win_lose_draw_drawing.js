function ComputedWinDrawings(teamId,homeTeamId,awayTeamId,home,away,key){
    var computedWins = [];
    if(teamId == homeTeamId){
        if(home > away){
            computedWins.push(<span className="number-circle rounded-square fixturesTextSize" style={{backgroundColor:"green"}} key={key}>W</span>)
        }else if(home===away){
            computedWins.push(<span className="number-circle rounded-square fixturesTextSize" style={{backgroundColor:"#ffb400"}} key={key}>D</span>)
    
        }else if(home < away){
            computedWins.push(<span className="number-circle rounded-square fixturesTextSize" style={{backgroundColor:"red"}} key={key}>L</span>)
        }
    }else if(teamId == awayTeamId) {
        if(away > home){
            computedWins.push(<span className="number-circle rounded-square fixturesTextSize" style={{backgroundColor:"green"}} key={key}>W</span>)
        }else if(away==home){
            computedWins.push(<span className="number-circle rounded-square fixturesTextSize" style={{backgroundColor:"#ffb400"}} key={key}>D</span>)
    
        }else if(away < home){
            computedWins.push(<span className="number-circle rounded-square fixturesTextSize" style={{backgroundColor:"red"}} key={key}>L</span>)
        }
    }
   
    return computedWins; 
}

export default ComputedWinDrawings;