// components/pages/sportpesa-mega-jackpot.js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import PreLoader from "../../components/includes/loader";
import DataNotFoundPage from "../../components/includes/datanotfound";
import { Adsense } from "@ctrl/react-adsense";
import SportpesaMegaJackpotContent from "../../components/seo-content/jackpots/sportpesa-mega-jackpot-predictions";
import JackpotGamesNewUI from "../../components/shared/jackpot-games-new-ui";

function SportpesaMegaJackpotPredictions() {         
    const router = useRouter();    
    const [gamesData, setGamesData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedVotes, setSelectedVotes] = useState({});
    const [voteStats, setVoteStats] = useState({});
    const [deviceId, setDeviceId] = useState('');
    const [isRefreshingStats, setIsRefreshingStats] = useState({});

    useEffect(() => {
        initializeDeviceId();
        fetchGamesData();
    }, []);

    // Initialize device ID once
    const initializeDeviceId = async () => {
        try {
            let storedDeviceId = localStorage.getItem('device_id');
            
            if (!storedDeviceId) {
                // Generate a unique device ID
                const components = [
                    navigator.userAgent,
                    navigator.platform,
                    screen.width,
                    screen.height,
                    screen.colorDepth,
                    Intl.DateTimeFormat().resolvedOptions().timeZone,
                    Date.now(),
                    Math.random().toString(36).substr(2, 9)
                ];
                
                const deviceString = components.join('|');
                
                // Simple hash function
                let hash = 0;
                for (let i = 0; i < deviceString.length; i++) {
                    const char = deviceString.charCodeAt(i);
                    hash = ((hash << 5) - hash) + char;
                    hash = hash & hash;
                }
                
                storedDeviceId = `web_device_${Math.abs(hash).toString(36)}_${Date.now()}`;
                localStorage.setItem('device_id', storedDeviceId);
            }
            
            setDeviceId(storedDeviceId);
            return storedDeviceId;
        } catch (err) {
            console.error("Error generating device ID:", err);
            const fallbackId = `web_fallback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            setDeviceId(fallbackId);
            localStorage.setItem('device_id', fallbackId);
            return fallbackId;
        }
    };

    const fetchGamesData = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(
                "https://api.pitchpredictions.com/api/fetch_jackpot_fixtures_by_name?jackpot_name=Sportpesa Mega Jackpot"
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
                
                // After loading games, fetch vote stats
                await fetchVoteStats(formattedData);
                
                // Then check existing votes
                if (deviceId) {
                    await checkExistingVotes(formattedData);
                }
                
                // Load locally saved votes
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

            // Use the bulk endpoint for better performance
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
                // Initialize empty stats if no votes yet
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
            alert("Device ID not initialized. Please refresh the page.");
            return;
        }

        try {
            const game = gamesData.find(g => g.fixture_id === fixtureId);
            if (!game) {
                alert("Game not found");
                return;
            }

            // Submit vote to server
            const success = await submitVoteToServer(game, fixtureId, prediction);
            
            if (success) {
                // Update local state
                const newVotes = {
                    ...selectedVotes,
                    [fixtureId]: {
                        prediction,
                        timestamp: Date.now()
                    }
                };
                setSelectedVotes(newVotes);
                localStorage.setItem('jackpot_selected_votes', JSON.stringify(newVotes));
                
                // Immediately update the UI with optimistic update
                updateVoteStatsOptimistically(fixtureId, prediction);
                
                // Then fetch real updated stats (non-blocking)
                setTimeout(() => {
                    refreshVoteStats(fixtureId);
                }, 500);
                
                // Show success message
                alert(`Vote submitted successfully!`);
            }
        } catch (err) {
            console.error("Vote submission error:", err);
            alert(err.message || "Failed to submit vote. Please try again.");
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
                case '1':
                    newStats.home_votes += 1;
                    break;
                case 'X':
                    newStats.draw_votes += 1;
                    break;
                case '2':
                    newStats.away_votes += 1;
                    break;
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
            setIsRefreshingStats(prev => ({ ...prev, [fixtureId]: true }));
            
            const game = gamesData.find(g => g.fixture_id === fixtureId);
            if (!game) return;

            // Fetch updated stats for this specific fixture
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
            setIsRefreshingStats(prev => ({ ...prev, [fixtureId]: false }));
        }
    };

    const submitVoteToServer = async (game, fixtureId, prediction) => {
        try {
            const voteData = {
                jackpot_id: game.jackpot_tips_id,
                fixture_id: fixtureId,
                prediction: prediction,
                device_id: deviceId,
                jackpot_name: game.jackpot_name || 'Sportpesa Mega Jackpot'
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

    const handleConfirmPicks = () => {
        const voteCount = Object.keys(selectedVotes).length;
        const totalGames = gamesData.length;
        
        if (voteCount === 0) {
            alert("Please select at least one prediction before confirming.");
            return;
        }
        
        if (voteCount < totalGames) {
            const confirmProceed = confirm(`You have selected ${voteCount} out of ${totalGames} games. Do you want to proceed with your current selections?`);
            if (!confirmProceed) return;
        }
        
        // Create a voting slip
        const votingSlip = {
            jackpot_id: gamesData[0]?.jackpot_tips_id,
            jackpot_name: gamesData[0]?.jackpot_name || 'Sportpesa Mega Jackpot',
            timestamp: new Date().toISOString(),
            device_id: deviceId,
            votes: selectedVotes,
            total_games: totalGames,
            votes_count: voteCount
        };
        
        // Save slip to localStorage
        localStorage.setItem('voting_slip', JSON.stringify(votingSlip));
        
        // Show success message
        alert(`Your ${voteCount} predictions have been recorded! Good luck!`);
        
        console.log("Voting slip saved:", votingSlip);
    };

    const getCommunityPrediction = (fixtureId) => {
        const stats = voteStats[fixtureId];
        if (stats && stats.community_prediction) {
            return {
                prediction: stats.community_prediction,
                percentages: stats.percentages
            };
        }
        return null;
    };

    const getUserVoteCount = (fixtureId) => {
        if (selectedVotes[fixtureId]) {
            return 1;
        }
        return 0;
    };

    // Prepare data for JackpotGamesNewUI component
    const preparedGamesData = gamesData.map(game => ({
        ...game,
        community_prediction: getCommunityPrediction(game.fixture_id),
        user_vote_count: getUserVoteCount(game.fixture_id),
        vote_stats: voteStats[game.fixture_id] || null,
        is_refreshing: isRefreshingStats[game.fixture_id] || false
    }));

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
                       <SportpesaMegaJackpotContent/>
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

            {/* New UI Component */}
            <JackpotGamesNewUI 
                gamesData={preparedGamesData} 
                selectedVotes={selectedVotes}
                onVote={handleVote}
                onConfirm={handleConfirmPicks}
                deviceId={deviceId}
                voteStats={voteStats}
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
                    <SportpesaMegaJackpotContent/>
                </div>
            </div>

            <style jsx>{`
                .sites-card {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 20px;
                }
                
                .premium-banner {
                    // background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    // padding: 15px;
                    border-radius: 10px;
                    margin-bottom: 20px;
                    // box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                }
                
                .voting-info-card {
                    background: #f8f9fa;
                    border-left: 4px solid #007bff;
                    padding: 15px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                }
                
                .voting-stats {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 20px;
                    margin-bottom: 10px;
                }
                
                .stat-item {
                    padding: 5px 10px;
                    background: white;
                    border-radius: 5px;
                    border: 1px solid #dee2e6;
                }
                
                .voting-note {
                    color: #6c757d;
                    margin: 0;
                    font-size: 0.9em;
                }
                
                .blink_me {
                    animation: blinker 2s linear infinite;
                }
                
                @keyframes blinker {
                    50% {
                        opacity: 0.7;
                    }
                }
                
                // .seo-content-section {
                //     margin-top: 40px;
                //     padding: 20px;
                //     background: #f8f9fa;
                //     border-radius: 10px;
                // }
                
                @media (max-width: 768px) {
                    .sites-card {
                        padding: 10px;
                    }
                    
                    .voting-stats {
                        flex-direction: column;
                        gap: 10px;
                    }
                    
                    .stat-item {
                        width: 100%;
                    }
                }
            `}</style>
        </div>
    );
}

export default SportpesaMegaJackpotPredictions;