function MatchOutcomesHome(props){
    let home_team_matches = props.props;

    var computedWins = [];
 
    if(home_team_matches && home_team_matches.length>5){
         for(let y =0;y<5;y++){
            var tooltipTitle = home_team_matches[y].home_team_name +'  ('+ home_team_matches[y].goals_home +'-'+home_team_matches[y].goals_away +')  '+ home_team_matches[y].away_team_name+ "\n"
            +home_team_matches[y].date;
 
            let url_name = encodeURIComponent(home_team_matches[y].home_team_name.replace(/\s+/g, '-').toLowerCase()+'-vs-'+home_team_matches[y].away_team_name.replace(/\s+/g, '-').toLowerCase()+'-'+home_team_matches[y].fixture_id);

            if(props.home_team_id == home_team_matches[y].home_team_id){
                if(home_team_matches[y].goals_home > home_team_matches[y].goals_away){
                    computedWins.push(
                    <a href={'/match/football-predictions-' + url_name+"/matches"} title="Click to View Match details" key={y}>       
                        <span className="number-circle rounded-square" data-toggle="tooltip" style={{backgroundColor:"green",margin:"0.5px",cursor:'pointer'}} title={tooltipTitle}>
                            W
                        </span>
                    </a>
                    )
                }else if(home_team_matches[y].goals_home===home_team_matches[y].goals_away){
                    computedWins.push(
                    <a href={'/match/football-predictions-' + url_name+"/matches"} title="Click to View Match details" key={y}>       
                        <span className="number-circle rounded-square" data-toggle="tooltip" style={{backgroundColor:"#ffb400",margin:"0.5px",cursor:'pointer'}} title={tooltipTitle}>
                            D
                        </span>
                    </a>
                    )        
                }else if(home_team_matches[y].goals_home < home_team_matches[y].goals_away){
                    computedWins.push(
                    <a href={'/match/football-predictions-' + url_name+"/matches"} title="Click to View Match details" key={y}>       
                        <span className="number-circle rounded-square" data-toggle="tooltip" style={{backgroundColor:"red",margin:"0.5px",cursor:'pointer'}} title={tooltipTitle}>
                            L
                        </span>
                    </a>
                    )
                }
            }else if(props.home_team_id == home_team_matches[y].away_team_id){
                if(home_team_matches[y].goals_away > home_team_matches[y].goals_home){
                    computedWins.push(
                    <a href={'/match/football-predictions-' + url_name+"/matches"} title="Click to View Match details" key={y}>       
                        <span className="number-circle rounded-square" data-toggle="tooltip" style={{backgroundColor:"green",margin:"0.5px",cursor:'pointer'}} title={tooltipTitle}>
                            W
                        </span>
                    </a>
                    )
                }else if(home_team_matches[y].goals_away===home_team_matches[y].goals_home){
                    computedWins.push(
                    <a href={'/match/football-predictions-' + url_name+"/matches"} title="Click to View Match details" key={y}>       
                        <span className="number-circle rounded-square" data-toggle="tooltip" style={{backgroundColor:"#ffb400",margin:"0.5px",cursor:'pointer'}} title={tooltipTitle}>
                            D
                        </span>
                    </a>
                    )
        
                }else if(home_team_matches[y].goals_away < home_team_matches[y].goals_home){
                    computedWins.push(
                    <a href={'/match/football-predictions-' + url_name+"/matches"} title="Click to View Match details" key={y}>       
                        <span className="number-circle rounded-square" data-toggle="tooltip" style={{backgroundColor:"red",margin:"0.5px",cursor:'pointer'}} title={tooltipTitle}>
                            L
                        </span>
                    </a>
                    )
                }
            }
         }
    }
 
    return computedWins;

}

export default MatchOutcomesHome;