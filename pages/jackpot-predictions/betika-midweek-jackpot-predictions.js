import React, { useState, useEffect } from 'react';
import PreLoader from "../../components/includes/loader";
import DataNotFoundPage from "../../components/includes/datanotfound";
import { Adsense } from "@ctrl/react-adsense";
import JackpotGamesBootstrap from "../../components/shared/jackpot-games-new-ui";
import BetikaMidweekJackpotContent from '../../components/seo-content/jackpots/betika-midweek-jackpot-predictions';

function BetikaMidweekJackpotPredictions() {         
    const [gamesData, setGamesData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedVotes, setSelectedVotes] = useState({});
    const [voteStats, setVoteStats] = useState({});
    const [deviceId, setDeviceId] = useState('');
    const [votingInProgress, setVotingInProgress] = useState({});
    const [refreshingStats, setRefreshingStats] = useState({});

    useEffect(() => {
        initializeDeviceId();
        fetchGamesData();
    }, []);

    // Initialize persistent device ID
    const initializeDeviceId = async () => {
        try {
            let storedDeviceId = localStorage.getItem('persistent_device_id');
            
            if (!storedDeviceId) {
                // Create a persistent device ID
                const components = [
                    navigator.userAgent,
                    navigator.platform,
                    screen.width.toString(),
                    screen.height.toString(),
                    screen.colorDepth.toString()
                ];
                
                const deviceString = components.join('|');
                let hash = 0;
                for (let i = 0; i < deviceString.length; i++) {
                    const char = deviceString.charCodeAt(i);
                    hash = ((hash << 5) - hash) + char;
                    hash = hash & hash;
                }
                
                storedDeviceId = `device_${Math.abs(hash).toString(36)}`;
                localStorage.setItem('persistent_device_id', storedDeviceId);
            }
            
            setDeviceId(storedDeviceId);
            return storedDeviceId;
        } catch (err) {
            console.error("Error generating device ID:", err);
            const fallbackId = `device_${Date.now()}`;
            setDeviceId(fallbackId);
            localStorage.setItem('persistent_device_id', fallbackId);
            return fallbackId;
        }
    };

    const fetchGamesData = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(
                "https://api.pitchpredictions.com/api/fetch_jackpot_fixtures_by_name?jackpot_name=Betika Midweek Jackpot"
            );
            const data = await response.json();
            
            if (data.status && data.data) {
                const formattedData = data.data.map(game => ({
                    ...game,
                    jackpot_id: game.jackpot_tips_id,
                    fixture_id: game.fixture_id,
                    game_id: game.id
                }));
                
                setGamesData(formattedData);
                await fetchVoteStats(formattedData);
                
                if (deviceId) {
                    await checkExistingVotes(formattedData);
                }
                
                loadSavedVotes(formattedData);
            } else {
                setError("No data available");
            }
        } catch (err) {
            console.error("Fetch error:", err);
            setError("Failed to fetch data. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const checkExistingVotes = async (games) => {
        if (!deviceId || games.length === 0) return;

        try {
            const fixtureIds = games.map(game => game.fixture_id);
            const jackpotId = games[0]?.jackpot_tips_id;

            if (!jackpotId) return;

            const response = await fetch('https://api.pitchpredictions.com/api/jackpot/vote/check-multiple', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    jackpot_id: jackpotId,
                    device_id: deviceId,
                    fixture_ids: fixtureIds
                })
            });

            const result = await response.json();
            
            if (result.status && result.data) {
                const newSelectedVotes = {};
                Object.entries(result.data).forEach(([fixtureId, voteData]) => {
                    if (voteData.has_voted && voteData.prediction) {
                        newSelectedVotes[fixtureId] = {
                            prediction: voteData.prediction,
                            timestamp: voteData.voted_at || Date.now()
                        };
                    }
                });
                
                setSelectedVotes(newSelectedVotes);
                localStorage.setItem('jackpot_selected_votes', JSON.stringify(newSelectedVotes));
            }
        } catch (err) {
            console.error("Error checking existing votes:", err);
        }
    };

    const fetchVoteStats = async (games) => {
        if (games.length === 0) return;

        try {
            const jackpotId = games[0]?.jackpot_tips_id;
            const fixtureIds = games.map(game => game.fixture_id);

            const response = await fetch('https://api.pitchpredictions.com/api/jackpot/vote/stats/multiple', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    jackpot_id: jackpotId,
                    fixture_ids: fixtureIds
                })
            });

            const result = await response.json();
            
            if (result.status && result.data) {
                setVoteStats(result.data);
            } else {
                const emptyStats = {};
                fixtureIds.forEach(fixtureId => {
                    emptyStats[fixtureId] = {
                        stats: { home_votes: 0, draw_votes: 0, away_votes: 0, total_votes: 0 },
                        percentages: { home: 0, draw: 0, away: 0 },
                        community_prediction: null
                    };
                });
                setVoteStats(emptyStats);
            }
        } catch (err) {
            console.error("Error fetching vote stats:", err);
        }
    };

    const loadSavedVotes = (games) => {
        try {
            const savedVotes = localStorage.getItem('jackpot_selected_votes');
            if (savedVotes) {
                const parsedVotes = JSON.parse(savedVotes);
                
                const currentJackpotId = games[0]?.jackpot_tips_id;
                const filteredVotes = {};
                
                Object.keys(parsedVotes).forEach(fixtureId => {
                    const game = games.find(g => g.fixture_id === fixtureId);
                    if (game && game.jackpot_tips_id === currentJackpotId) {
                        filteredVotes[fixtureId] = parsedVotes[fixtureId];
                    }
                });
                
                setSelectedVotes(filteredVotes);
            }
        } catch (err) {
            console.error("Error loading saved votes:", err);
        }
    };

    const handleVote = async (fixtureId, prediction) => {
        if (!deviceId) {
            return;
        }

        // Check if already voting for this fixture
        if (votingInProgress[fixtureId]) {
            return; // Already voting, ignore click
        }

        try {
            const game = gamesData.find(g => g.fixture_id === fixtureId);
            if (!game) {
                return;
            }

            // Check if game is still votable (NS status only)
            if (game.status_short !== 'NS') {
                return; // Silently return if game is completed
            }

            // Set voting in progress for this fixture
            setVotingInProgress(prev => ({ ...prev, [fixtureId]: true }));

            // Submit vote to server
            const success = await submitVoteToServer(game, fixtureId, prediction);
            
            if (success) {
                const newVotes = {
                    ...selectedVotes,
                    [fixtureId]: {
                        prediction,
                        timestamp: Date.now()
                    }
                };
                setSelectedVotes(newVotes);
                localStorage.setItem('jackpot_selected_votes', JSON.stringify(newVotes));
                
                updateVoteStatsOptimistically(fixtureId, prediction);
                
                setTimeout(() => {
                    refreshVoteStats(fixtureId);
                }, 500);
            }
        } catch (err) {
            console.error("Vote submission error:", err);
            // Only show alert for unexpected errors
            if (!err.message.includes('already completed')) {
                alert(err.message || "Failed to submit vote. Please try again.");
            }
        } finally {
            // Clear voting in progress state
            setVotingInProgress(prev => ({ ...prev, [fixtureId]: false }));
        }
    };

    const updateVoteStatsOptimistically = (fixtureId, prediction) => {
        setVoteStats(prev => {
            const currentStats = prev[fixtureId] || {
                stats: { home_votes: 0, draw_votes: 0, away_votes: 0, total_votes: 0 },
                percentages: { home: 0, draw: 0, away: 0 }
            };
            
            const newStats = { ...currentStats.stats };
            newStats.total_votes += 1;
            
            switch(prediction) {
                case '1': newStats.home_votes += 1; break;
                case 'X': newStats.draw_votes += 1; break;
                case '2': newStats.away_votes += 1; break;
            }
            
            const homePercent = newStats.total_votes > 0 ? 
                Math.round((newStats.home_votes / newStats.total_votes) * 100) : 0;
            const drawPercent = newStats.total_votes > 0 ? 
                Math.round((newStats.draw_votes / newStats.total_votes) * 100) : 0;
            const awayPercent = newStats.total_votes > 0 ? 
                Math.round((newStats.away_votes / newStats.total_votes) * 100) : 0;
            
            return {
                ...prev,
                [fixtureId]: {
                    ...currentStats,
                    stats: newStats,
                    percentages: {
                        home: homePercent,
                        draw: drawPercent,
                        away: awayPercent
                    },
                    community_prediction: getCommunityPredictionFromPercentages(homePercent, drawPercent, awayPercent),
                    optimistic_update: true
                }
            };
        });
    };

    const getCommunityPredictionFromPercentages = (home, draw, away) => {
        const maxPercent = Math.max(home, draw, away);
        if (maxPercent === home) return '1';
        if (maxPercent === draw) return 'X';
        if (maxPercent === away) return '2';
        return null;
    };

    const refreshVoteStats = async (fixtureId) => {
        try {
            setRefreshingStats(prev => ({ ...prev, [fixtureId]: true }));
            
            const game = gamesData.find(g => g.fixture_id === fixtureId);
            if (!game) return;

            const response = await fetch(`https://api.pitchpredictions.com/api/jackpot/vote/stats/${game.jackpot_tips_id}/${fixtureId}`);
            const result = await response.json();
            
            if (result.status && result.data) {
                setVoteStats(prev => ({
                    ...prev,
                    [fixtureId]: {
                        ...result.data,
                        last_refreshed: new Date().toISOString()
                    }
                }));
            }
        } catch (err) {
            console.error("Error refreshing vote stats:", err);
        } finally {
            setRefreshingStats(prev => ({ ...prev, [fixtureId]: false }));
        }
    };

    const submitVoteToServer = async (game, fixtureId, prediction) => {
        try {
            // Only allow voting on NS games
            if (game.status_short !== 'NS') {
                throw new Error(`Game ${game.home_team} vs ${game.away_team} is already completed (${game.status_short})`);
            }

            const voteData = {
                jackpot_id: game.jackpot_tips_id,
                fixture_id: fixtureId,
                prediction: prediction,
                device_id: deviceId,
                jackpot_name: game.jackpot_name || 'Betika Midweek Jackpot',
                game_status: game.status_short
            };

            const response = await fetch('https://api.pitchpredictions.com/api/jackpot/vote', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(voteData)
            });

            const result = await response.json();
            
            if (result.status) {
                return true;
            } else {
                throw new Error(result.message || "Vote failed");
            }
        } catch (err) {
            throw err;
        }
    };

    if (isLoading) {
        return <PreLoader />;
    }

    if (error || gamesData.length === 0) {
        return (
            <div className="sites-card">
                <DataNotFoundPage props={error || "Jackpot fixtures have not been updated. Please check again later."} />
                <br/>
                <Adsense
                    client="ca-pub-5665711413000284"
                    slot="3850951453"
                    style={{ display: "block" }}
                    layout="display"
                    format="auto"
                />   
                <br/>   
                <div className="">
                    <div className="container">
                        <BetikaMidweekJackpotContent/>
                    </div>
                </div>         
            </div>
        );
    }

    return (
        <div className="sites-card">
            {/* Premium Banner */}
            <div className="premium-banner">
                <p className="text-center blink_me">Buy Premium Jackpot Predictions Now and Win a Bonus!!!</p>
                <p className="text-center">
                    <a href="/auth/login" className="btn btn-danger btn-sm">Buy Premium Jackpot Now</a>
                </p>
            </div>

            {/* Games Component */}
            <JackpotGamesBootstrap 
                gamesData={gamesData} 
                selectedVotes={selectedVotes}
                voteStats={voteStats}
                onVote={handleVote}
                votingInProgress={votingInProgress}
                refreshingStats={refreshingStats}
            />

            {/* Ads */}
            <br/>
            <Adsense
                client="ca-pub-5665711413000284"
                slot="3850951453"
                style={{ display: "block" }}
                layout="display"
                format="auto"
            /> 
            <br/>   

            {/* SEO Content */}
            <div className="seo-content-section">
                <div className="container">
                    <BetikaMidweekJackpotContent/>
                </div>
            </div>

            <style jsx>{`  
                .sites-card {
                    max-width: 1200px;
                    margin: 0 auto;
                    background-color: white;
                    padding: 10px;
                }
            `}</style>
        </div>
    );
}

export default BetikaMidweekJackpotPredictions;