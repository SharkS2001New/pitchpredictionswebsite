import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Adsense } from "@ctrl/react-adsense";

function JackpotGamesBootstrap({ gamesData = [], voteStats = {}, selectedVotes = {}, onVote, votingInProgress = {} }) {

  const TeamIcon = ({ name, logo, size = 18 }) => {
    if (logo) {
      return <img src={logo} alt={name} width={size} height={size} style={{objectFit:'contain'}} />;
    }
    return (
      <div
        className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center"
        style={{ width: size, height: size, fontSize: size * 0.6 }}
      >
        {name?.charAt(0) || '?'}
      </div>
    );
  };

  // Helper function to get vote label text
  const getVoteLabel = (prediction) => {
    switch(prediction) {
      case '1': return 'Home (1)';
      case 'X': return 'Draw (X)';
      case '2': return 'Away (2)';
      default: return prediction;
    }
  };

  return (
    <div className="container my-4">
      {gamesData.map((game, index) => {
        const stats = voteStats[game.fixture_id] || {};
        const hasVoted = !!selectedVotes[game.fixture_id];
        const userVote = selectedVotes[game.fixture_id]?.prediction;
        const voteLabel = getVoteLabel(userVote);
        
        const isCompleted = ['FT', 'AET', 'PEN', 'PST', 'CANC', 'ABD', 'SUSP'].includes(game.status_short);
        
        const getStatusColor = (status) => {
          const statusColors = {
            FT: 'danger',
            AET: 'danger',
            PST: 'warning',
            PEN: 'danger',
            CANC: 'secondary',
            ABD: 'secondary',
            SUSP: 'warning',
            NS: 'success'
          };
          return statusColors[status] || 'secondary';
        };

        const system = [
          { label: 'Home', value: Number(game.percent_pred_home.replace('%', '')), code: '1', key:'home' },
          { label: 'Draw', value: Number(game.percent_pred_draw.replace('%', '')), code: 'X', key:'draw' },
          { label: 'Away', value: Number(game.percent_pred_away.replace('%', '')), code: '2', key:'away' }
        ];
        const topSystem = system.reduce((a,b) => b.value > a.value ? b : a);

        const votes = stats?.stats || {};
        const totalVotes = votes.total_votes || 0;

        const homePct = totalVotes ? Math.round((votes.home_votes / totalVotes) * 100) : 0;
        const drawPct = totalVotes ? Math.round((votes.draw_votes / totalVotes) * 100) : 0;
        const awayPct = totalVotes ? Math.round((votes.away_votes / totalVotes) * 100) : 0;
        const maxPct = Math.max(homePct, drawPct, awayPct);

        const renderVoteButton = (label, prediction, teamName, teamLogo) => {
            const isVoting = votingInProgress?.[game.fixture_id];
            
            return (
                <button
                    className="btn btn-sm flex-fill rounded-pill border border-primary bg-white d-flex align-items-center justify-content-center gap-2"
                    style={{ height: 28 }}
                    onClick={() => onVote(game.fixture_id, prediction)}
                    disabled={isVoting || hasVoted || isCompleted} 
                >
                    {isVoting ? (
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    ) : (
                        <>
                            {teamName || teamLogo ? <TeamIcon name={teamName} logo={teamLogo} size={18} /> : null}
                            <strong>{label}</strong>
                        </>
                    )}
                </button>
            );
        };

        return (
          <div key={index}>
            <div className="fixturesWholeRow1 fixturesTextSize mb-2 py-2" key={game.fixture_id} style={{borderBottom: "1px solid #ddd"}}>
              {/* HEADER + ODDS + SYSTEM */}
              <div className="card-header d-flex flex-column flex-md-row justify-content-between mb-3 gap-3">
                <div className="text-nowrap">
                  <div className="mb-2 d-flex align-items-center gap-2">
                    <strong>{game.jackpot_position}.</strong>
                    <TeamIcon name={game.home_team_name} logo={game.home_team_logo} size={20} />
                    <strong>{game.home_team_name}</strong>
                    <span>vs</span>
                    <TeamIcon name={game.away_team_name} logo={game.away_team_logo} size={20} />
                    <strong>{game.away_team_name}</strong>                 
                  </div>
                  <small className="text-muted fw-bold">{game.date} |  
                    {game.status_short && (
                      <span className={`badge bg-${getStatusColor(game.status_short)} ms-1`}>
                        {game.status_long || game.status_short}
                      </span>
                    )}</small>
                </div>

                <div className="d-flex align-items-center gap-2 mt-md-0 w-100">
                  <div className="d-flex gap-2 text-center flex-fill justify-content-md-center">
                    <div className="border rounded px-2 py-1 bg-white shadow-sm">
                      <strong>1</strong><br/>
                      <span className="text-success fw-bold">{game.bets_home}</span>
                    </div>
                    <div className="border rounded px-2 py-1 bg-white shadow-sm">
                      <strong>X</strong><br/>
                      <span className="text-success fw-bold">{game.bets_draw}</span>
                    </div>
                    <div className="border rounded px-2 py-1 bg-white shadow-sm">
                      <strong>2</strong><br/>
                      <span className="text-success fw-bold">{game.bets_away}</span>
                    </div>
                  </div>

                  <div className="text-end ms-auto">
                    <small className="text-dark fw-bold">Our Prediction</small>
                    <div className="fw-bold text-success">
                      {topSystem.label} - {topSystem.value}%
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-body">
                <div className="mb-1">
                  <div className="d-flex justify-content-between mb-2">
                    <strong>
                      {isCompleted ? 'Voting Results' : hasVoted ? `Thank you for voting!` : 'Who will win? (Cast Vote)'}
                    </strong>
                    <small style={{fontWeight: "bold", fontSize: "small"}}>Total Votes: {totalVotes}</small>
                  </div>

                  {isCompleted || hasVoted ? (
                    <div className="d-flex gap-2 bg-light rounded-pill p-2">
                      {[
                        { label: '1', pct: homePct, logo: game.home_team_logo, name: game.home_team_name },
                        { label: 'X', pct: drawPct },
                        { label: '2', pct: awayPct, logo: game.away_team_logo, name: game.away_team_name }
                      ].map((item, i) => {
                        const isUserVote = hasVoted && userVote === item.label;
                        return (
                          <div key={i} className={`flex-fill d-flex align-items-center justify-content-between px-2 py-1 rounded-pill border bg-white ${item.pct === maxPct ? 'border-primary fw-bold shadow-sm' : 'border-light'} ${isUserVote ? 'border-success border-2' : ''}`}>
                            <div className="d-flex align-items-center gap-1">
                              {item.logo || item.name ? <TeamIcon name={item.name} logo={item.logo} size={16} /> : null}
                              <strong>{item.label}</strong>
                              {isUserVote && (
                                <span className="badge bg-success ms-1">Your Vote</span>
                              )}
                            </div>
                            <span>{item.pct}%</span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="d-flex gap-2">
                      {renderVoteButton('1', '1', game.home_team_name, game.home_team_logo)}
                      {renderVoteButton('X', 'X')}
                      {renderVoteButton('2', '2', game.away_team_name, game.away_team_logo)}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Ad insertion logic */}
            {(index === 2 && index !== gamesData.length - 1) && (
                <div className="desktop-container-resize">
                  <div className="text-center">
                    <Adsense
                      client="ca-pub-5665711413000284"
                      slot="7303713943"
                      style={{ display: "block" }}
                      layout="in-article"
                      format="fluid"
                    />
                  </div>
                </div>
            )}
            {index !== 2 && (index - 2) % 8 === 0 && index !== gamesData.length - 1 && (
               <div className="desktop-container-resize">
                  <div className="text-center">
                    <Adsense
                      client="ca-pub-5665711413000284"
                      slot="4141567825"
                      style={{ display: "block" }}
                      layout="in-article"
                      format="fluid"
                    />
                  </div>
                </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default JackpotGamesBootstrap;