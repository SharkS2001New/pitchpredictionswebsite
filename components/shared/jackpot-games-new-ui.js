import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function JackpotGamesBootstrap({ gamesData = [], voteStats = {}, selectedVotes = {}, onVote }) {

  return (
    <div className="container my-4">
      {gamesData.map((game, index) => {
        const [openAnalysis, setOpenAnalysis] = useState(false);
        const stats = voteStats[game.fixture_id] || {};
        const hasVoted = !!selectedVotes[game.fixture_id];

        // Prediction percentages
        const system = [
          { label: 'Home', value: Number(game.percent_pred_home.replace('%', '')), code: '1', key:'home' },
          { label: 'Draw', value: Number(game.percent_pred_draw.replace('%', '')), code: 'X', key:'draw' },
          { label: 'Away', value: Number(game.percent_pred_away.replace('%', '')), code: '2', key:'away' }
        ];
        const topSystem = system.reduce((a,b) => b.value > a.value ? b : a);

        return (
          <div className="card mb-4 shadow-sm rounded-4" key={game.fixture_id}>
            
            {/* HEADER + ODDS + SYSTEM */}
            <div className="card-header d-flex flex-column flex-md-row justify-content-between gap-3 bg-light">
              <div>
                <h5 className="mb-2">
                  <span>{game.jackpot_position}. </span><strong>{game.home_team_name}</strong> vs <strong>{game.away_team_name}</strong>
                </h5>
                <small className="text-muted">{game.date} | {game.status_long}</small>
              </div>

              <div className="d-flex align-items-center gap-3 mt-md-0">
                {/* Odds */}
                <div className="d-flex gap-2 text-center">
                  <div className="border rounded px-3 py-2 bg-white shadow-sm">
                    <strong>1</strong><br/>
                    <span className="text-success fw-bold">{game.bets_home}</span>
                  </div>
                  <div className="border rounded px-3 py-2 bg-white shadow-sm">
                    <strong>X</strong><br/>
                    <span className="text-warning fw-bold">{game.bets_draw}</span>
                  </div>
                  <div className="border rounded px-3 py-2 bg-white shadow-sm">
                    <strong>2</strong><br/>
                    <span className="text-info fw-bold">{game.bets_away}</span>
                  </div>
                </div>

                {/* System prediction */}
                <div className="text-end">
                  <small className="text-dark fw-bold">Our Prediction</small>
                  <div className={`fw-bold ${topSystem.key==='home'?'text-success':topSystem.key==='draw'?'text-warning':'text-info'}`}>
                    {topSystem.label} - {topSystem.value}%
                  </div>
                </div>
              </div>
            </div>

            <div className="card-body">
              {/* VOTING */}
              <div className="mb-1">
                <div className="d-flex justify-content-between mb-2">
                  <strong>Who will win? (Cast Vote)</strong>
                  <small>Total votes: {stats?.stats?.total_votes || 0}</small>
                </div>

                {!hasVoted ? (
                  <div className="d-flex gap-2">
                    {system.map((item, i) => (
                      <button 
                        key={i} 
                        className={`btn flex-fill py-1 rounded-3 shadow-sm ${
                          item.key==='home'?'btn-outline-success': item.key==='draw'?'btn-outline-warning':'btn-outline-info'
                        }`}
                        onClick={()=>onVote(game.fixture_id, item.code)}
                      >
                        {item.label}
                        {/* <small className="d-block text-muted">{item.value}% predicted</small> */}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="d-flex gap-2">
                    {system.map((item, i) => (
                      <div className="flex-fill text-center" key={i}>
                        <div className="small text-muted">{item.label}</div>
                        <div className="progress mb-1" style={{height:'12px'}}>
                          <div 
                            className={`progress-bar ${item.key==='home'?'bg-success':item.key==='draw'?'bg-warning':'bg-info'}`} 
                            style={{width: `${stats?.percentages?.[item.key] || 0}%`}}
                          ></div>
                        </div>
                        <small>{stats?.percentages?.[item.key] || 0}%</small>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* EXPERT ANALYSIS */}
              {/* <div className="card mt-3 shadow-sm">
                <div className="card-header d-flex justify-content-between align-items-center" style={{cursor:'pointer'}} onClick={()=>setOpenAnalysis(!openAnalysis)}>
                  <strong>Expert Analysis</strong>
                  <span>{openAnalysis ? '⌄' : '>'}</span>
                </div>
                {openAnalysis && (
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-2">
                      <div className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center me-2" style={{width:'36px', height:'36px'}}>M</div>
                      <div>
                        <strong>Mark Thompson</strong><br/>
                        <small>Sports Analyst</small>
                      </div>
                    </div>
                    <p>{game.home_team_name} is in good form and expected to dominate this match. {game.away_team_name} has shown defensive weakness recently.</p>
                  </div>
                )}
              </div> */}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default JackpotGamesBootstrap;
