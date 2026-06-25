import React from 'react';
import { Adsense } from "@/components/shared/client-adsense";
import DateTimeToUsersTimezone, {
  resolveFixtureDateTime,
} from '../functions/DatetimeToUsersTimezone';
import { buildMatchUrlSlug } from '../functions/match_details_helpers';
import dedupeFixturesById from '../functions/dedupe_fixtures_by_id';

function JackpotGamesBootstrap({ gamesData = [], voteStats = {}, selectedVotes = {}, onVote, votingInProgress = {} }) {
  const uniqueGamesData = dedupeFixturesById(gamesData);

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

  // Helper function to safely parse percentage values
  const safeParsePercentage = (value) => {
    if (!value || typeof value !== 'string') return 0;
    return Number(value.replace('%', ''));
  };

  // Parse scores from JSON
  const parseScores = (scoresJson) => {
    try {
      return JSON.parse(scoresJson) || {};
    } catch (e) {
      return {};
    }
  };

  // Determine match winner
  const getMatchWinner = (game) => {
    if (!game.goals_home || !game.goals_away) return null;
    
    const homeGoals = parseInt(game.goals_home);
    const awayGoals = parseInt(game.goals_away);
    
    if (homeGoals > awayGoals) return '1';
    if (awayGoals > homeGoals) return '2';
    if (homeGoals === awayGoals) return 'X';
    return null;
  };

  // Get system prediction based on highest percentage
  const getSystemPrediction = (game) => {
    const homePct = safeParsePercentage(game.percent_pred_home);
    const drawPct = safeParsePercentage(game.percent_pred_draw);
    const awayPct = safeParsePercentage(game.percent_pred_away);
    
    if (homePct >= drawPct && homePct >= awayPct) return '1';
    if (drawPct >= homePct && drawPct >= awayPct) return 'X';
    if (awayPct >= homePct && awayPct >= drawPct) return '2';
    
    return null;
  };

  // Check if tip was correct using percentage-based prediction
  const isTipCorrect = (game) => {
    const winner = getMatchWinner(game);
    const prediction = getSystemPrediction(game);
    return winner && prediction && winner === prediction;
  };

  // Get status badge with score
  const getStatusBadge = (game) => {
    const scores = parseScores(game.scores);
    const isFinished = ['FT', 'AET', 'PEN'].includes(game.status_short);
    const isLive = ['1H', '2H', 'HT', 'LIVE', 'ET', 'P'].includes(game.status_short);
    
    if (isFinished) {
      let scoreText = `${game.goals_home} - ${game.goals_away}`;
      if (scores?.halftime) {
        scoreText += ` (HT: ${scores.halftime.home}-${scores.halftime.away})`;
      }
      return (
        <span className="badge bg-danger ms-1" title={scoreText}>
          {game.status_long}: {game.goals_home}-{game.goals_away}
        </span>
      );
    } else if (isLive) {
      let statusText = game.status_long || game.status_short;
      let scoreText = `${game.goals_home || 0} - ${game.goals_away || 0}`;
      if (game.status_elapased) {
        statusText += ` ${game.status_elapased}'`;
      }
      return (
        <span className="badge bg-warning text-dark ms-1" title={`Live: ${scoreText}`}>
          {statusText} {game.goals_home || 0}-{game.goals_away || 0}
        </span>
      );
    } else {
      return (
        <span className={`badge bg-${getStatusColor(game.status_short)} ms-1`}>
          {game.status_long || game.status_short}
        </span>
      );
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      FT: 'danger',
      AET: 'danger',
      PST: 'warning',
      PEN: 'danger',
      CANC: 'secondary',
      ABD: 'secondary',
      SUSP: 'warning',
      NS: 'success',
      '1H': 'warning',
      '2H': 'warning',
      HT: 'warning',
      LIVE: 'warning',
      ET: 'warning',
      P: 'warning'
    };
    return statusColors[status] || 'secondary';
  };

  // Helper to get user vote label
  const getUserVoteLabel = (userVote) => {
    if (userVote === '1') return 'Home';
    if (userVote === 'X') return 'Draw';
    if (userVote === '2') return 'Away';
    return '';
  };

  return (
    <div className="container my-4">
      {uniqueGamesData.map((game, index) => {
        const stats = voteStats[game.fixture_id] || {};
        const hasVoted = !!selectedVotes[game.fixture_id];
        const userVote = selectedVotes[game.fixture_id]?.prediction;
        
        const isCompleted = ['FT', 'AET', 'PEN', 'PST', 'CANC', 'ABD', 'SUSP'].includes(game.status_short);
        const isLive = ['1H', '2H', 'HT', 'LIVE', 'ET', 'P'].includes(game.status_short);
        const matchWinner = getMatchWinner(game);
        const tipCorrect = isTipCorrect(game);

        // Fixed: Safe parsing of percentage values
        const system = [
          { label: 'Home', value: safeParsePercentage(game.percent_pred_home), code: '1', key:'home' },
          { label: 'Draw', value: safeParsePercentage(game.percent_pred_draw), code: 'X', key:'draw' },
          { label: 'Away', value: safeParsePercentage(game.percent_pred_away), code: '2', key:'away' }
        ];
        const topSystem = system.reduce((a,b) => b.value > a.value ? b : a);

        const votes = stats?.stats || {};
        const totalVotes = votes.total_votes || 0;

        const homePct = totalVotes ? Math.round((votes.home_votes / totalVotes) * 100) : 0;
        const drawPct = totalVotes ? Math.round((votes.draw_votes / totalVotes) * 100) : 0;
        const awayPct = totalVotes ? Math.round((votes.away_votes / totalVotes) * 100) : 0;
        const maxPct = Math.max(homePct, drawPct, awayPct);

        const matchUrl = `/match/football-predictions-${buildMatchUrlSlug(
          game.home_team_name || '',
          game.away_team_name || '',
          game.fixture_id
        )}/matches`;

        const renderVoteButton = (label, prediction, teamName, teamLogo) => {
            const isVoting = votingInProgress?.[game.fixture_id];
            const isDisabled = isVoting || hasVoted || isCompleted || isLive;
            
            return (
                <button
                    className="btn btn-sm flex-fill rounded-pill border border-primary bg-white d-flex align-items-center justify-content-center gap-2"
                    style={{ height: 28 }}
                    onClick={() => onVote(game.fixture_id, prediction)}
                    disabled={isDisabled} 
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
                    <a
                      href={matchUrl}
                      className="d-flex align-items-center gap-2"
                      style={{ color: 'inherit', textDecoration: 'none' }}
                    >
                      <TeamIcon name={game.home_team_name} logo={game.home_team_logo} size={20} />
                      <strong>{game.home_team_name}</strong>
                      <span>vs</span>
                      <TeamIcon name={game.away_team_name} logo={game.away_team_logo} size={20} />
                      <strong>{game.away_team_name}</strong>
                    </a>
                  </div>
                  
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    <small className="text-muted fw-bold">
                      {DateTimeToUsersTimezone(resolveFixtureDateTime(game))}
                    </small>
                    {getStatusBadge(game)}
                  </div>
                </div>

                <div className="d-flex align-items-center gap-2 mt-md-0 w-100">
                  <div className="d-flex gap-2 text-center flex-fill justify-content-md-center">
                    <div className={`border rounded px-2 py-1 bg-white shadow-sm ${matchWinner === '1' ? 'border-success border-2' : ''}`}>
                      <strong>1</strong><br/>
                      <span className="text-success fw-bold">{game.bets_home}</span>
                    </div>
                    <div className={`border rounded px-2 py-1 bg-white shadow-sm ${matchWinner === 'X' ? 'border-success border-2' : ''}`}>
                      <strong>X</strong><br/>
                      <span className="text-success fw-bold">{game.bets_draw}</span>
                    </div>
                    <div className={`border rounded px-2 py-1 bg-white shadow-sm ${matchWinner === '2' ? 'border-success border-2' : ''}`}>
                      <strong>2</strong><br/>
                      <span className="text-success fw-bold">{game.bets_away}</span>
                    </div>
                  </div>

                  <div className="text-end ms-auto">
                    <small className="text-dark fw-bold">Our Prediction</small>
                    <div className={`fw-bold ${game.status_short == 'NS' ? 'text-success' : isCompleted && tipCorrect ? 'text-success' : isCompleted ? 'text-danger' : 'text-secondary'}`}>
                      {topSystem.label} - {topSystem.value}%
                      {isCompleted && (
                        <span className="ms-1">{tipCorrect ? '✓' : '✗'}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-body">
                <div className="mb-1">
                  <div className="d-flex justify-content-between mb-2">
                  <strong>
                      {isCompleted 
                        ? `Voting Results ${hasVoted ? `(You Voted: ${getUserVoteLabel(userVote)})` : ''}` 
                        : hasVoted 
                          ? `Thank you for voting! (You Voted: ${getUserVoteLabel(userVote)})` 
                          : 'Who will win? (Cast Vote)'}
                    </strong>
                    <small style={{fontWeight: "bold", fontSize: "small"}}>Total Votes: {totalVotes}</small>
                  </div>

                  {isCompleted || hasVoted ? (
                    <div className="d-flex gap-2 bg-light rounded-pill p-2">
                      {[
                        { label: '1', pct: homePct, logo: game.home_team_logo, name: game.home_team_name, winner: matchWinner === '1' },
                        { label: 'X', pct: drawPct, winner: matchWinner === 'X' },
                        { label: '2', pct: awayPct, logo: game.away_team_logo, name: game.away_team_name, winner: matchWinner === '2' }
                      ].map((item, i) => {
                        const isUserVote = hasVoted && userVote === item.label;
                        const isWinner = item.winner;
                        
                        let borderClass = 'border-light';
                        if (isWinner) borderClass = 'border-success border-2';
                        else if (item.pct === maxPct) borderClass = 'border-primary fw-bold shadow-sm';
                        
                        return (
                          <div key={i} className={`flex-fill d-flex align-items-center justify-content-between px-2 py-1 rounded-pill border bg-white ${borderClass} ${isUserVote ? 'border-success border-2' : ''}`}>
                            <div className="d-flex align-items-center gap-1">
                              {item.logo || item.name ? <TeamIcon name={item.name} logo={item.logo} size={16} /> : null}
                              <strong>{item.label}</strong>
                              {isWinner && (
                                <span className="badge bg-success ms-1">Winner</span>
                              )}
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
            {(index === 2 && index !== uniqueGamesData.length - 1) && (
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
            {index !== 2 && (index - 2) % 8 === 0 && index !== uniqueGamesData.length - 1 && (
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