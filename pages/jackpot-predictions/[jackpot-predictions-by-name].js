// pages/jackpot-predictions/[jackpot-predictions-by-name].js
import React, { useState, useEffect } from 'react';
import DataNotFoundPage from "../../components/includes/datanotfound";
import { Adsense } from "@ctrl/react-adsense";
import JackpotGamesBootstrap from "../../components/shared/jackpot-games-new-ui";
import ReturnJackpotNameSavedInDB from "../../components/functions/getJackpotFilterName";
import { useRouter } from 'next/router';
import fs from 'fs';
import path from 'path';

function JackpotByNamePredictions({ 
    initialGamesData, 
    endpointStatus, 
    error,
    initialVoteStats,
    jackpotApiName,
    isNotFound = false // Add this prop
}) {         
    const [gamesData, setGamesData] = useState(initialGamesData || []);
    const [selectedVotes, setSelectedVotes] = useState({});
    const [voteStats, setVoteStats] = useState(initialVoteStats || {});
    const [deviceId, setDeviceId] = useState('');
    const [votingInProgress, setVotingInProgress] = useState({});
    const [refreshingStats, setRefreshingStats] = useState({});
    
    const router = useRouter();

    // Initialize device ID on client side only
    useEffect(() => {
        initializeDeviceId();
    }, []);

    // Load saved votes from localStorage after device ID is set
    useEffect(() => {
        if (deviceId && gamesData.length > 0) {
            loadSavedVotes();
            checkExistingVotes();
        }
    }, [deviceId, gamesData]);

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

    const checkExistingVotes = async () => {
        if (!deviceId || gamesData.length === 0) return;

        try {
            const fixtureIds = gamesData.map(game => game.fixture_id);
            const jackpotId = gamesData[0]?.jackpot_tips_id;

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

    const loadSavedVotes = () => {
        try {
            const savedVotes = localStorage.getItem('jackpot_selected_votes');
            if (savedVotes) {
                const parsedVotes = JSON.parse(savedVotes);
                
                const currentJackpotId = gamesData[0]?.jackpot_tips_id;
                const filteredVotes = {};
                
                Object.keys(parsedVotes).forEach(fixtureId => {
                    const game = gamesData.find(g => g.fixture_id == fixtureId);
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

        // Check if already voting for this fixture
        if (votingInProgress[fixtureId]) {
            return; // Already voting, ignore click
        }

        try {
            const game = gamesData.find(g => g.fixture_id == fixtureId);
            if (!game) {
                alert("Game not found");
                return;
            }

            // Check if game is still votable (NS status only)
            if (game.status_short !== 'NS') {
                // Silently return without alert
                return;
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
            if (!err.message?.includes('already completed')) {
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
            
            const game = gamesData.find(g => g.fixture_id == fixtureId);
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
                jackpot_name: game.jackpot_name || jackpotApiName || 'Unknown Jackpot',
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

    // Show friendly message if jackpot is not found (404)
    if (isNotFound) {
        return (
            <div className="sites-card">
                <div className="container text-center py-5">
                    <div className="mb-4">
                        <i className="bi bi-trophy" style={{ fontSize: '4rem', color: '#6c757d' }}></i>
                    </div>
                    <h2 className="h4 mb-3">Jackpot Not Available</h2>
                    <p className="text-muted mb-4">
                        This jackpot is either not currently active or hasn't been updated yet. 
                        Please check back later or browse our other active jackpots.
                    </p>
                    <div className="mb-4">
                        <a href="/jackpot-predictions" className="btn btn-primary">
                            <i className="bi bi-arrow-left me-2"></i>
                            View All Jackpots
                        </a>
                    </div>
                </div>
                <br/>
                <Adsense
                    client="ca-pub-5665711413000284"
                    slot="3850951453"
                    style={{ display: "block" }}
                    layout="display"
                    format="auto"
                />         
            </div>
        );
    }

    // Handle error state (API errors, etc.)
    if (endpointStatus === "error" || error) {
        return (
            <div className="sites-card">
                <DataNotFoundPage props="This jackpot is currently not available. Please check back later." />
                <br/>
                <Adsense
                    client="ca-pub-5665711413000284"
                    slot="3850951453"
                    style={{ display: "block" }}
                    layout="display"
                    format="auto"
                />         
            </div>
        );
    }

    // Handle empty data state (API returned no data)
    if (!gamesData || gamesData.length === 0) {
        return (
            <div className="sites-card">
                <DataNotFoundPage props="No jackpot fixtures available at the moment." />
                <br/>
                <Adsense
                    client="ca-pub-5665711413000284"
                    slot="3850951453"
                    style={{ display: "block" }}
                    layout="display"
                    format="auto"
                />         
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

export async function getServerSideProps(context) {
    const { 'jackpot-predictions-by-name': jackpotSlug } = context.params;
    
    if (!jackpotSlug) {
        return {
            notFound: true
        };
    }
    
    // FIXED: Rename this variable to avoid conflict with 'path' module
    const urlPath = `jackpot-predictions/${jackpotSlug}`;
    const jackpotApiName = ReturnJackpotNameSavedInDB(urlPath);
    
    // If jackpot name is "Unknown Jackpot", show friendly 404
    if (!jackpotApiName || jackpotApiName === "Unknown Jackpot") {
        return {
            props: {
                initialGamesData: [],
                endpointStatus: "not_found",
                error: null,
                initialVoteStats: {},
                jackpotApiName: null,
                isNotFound: true
            }
        };
    }
    
    const headers = {
        "Content-type": "application/json; charset=UTF-8",
        "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2"
    };

    let initialGamesData = [];
    let endpointStatus = "success";
    let error = null;
    let initialVoteStats = {};
    let cacheInfo = {
        fromCache: false,
        generatedAt: null
    };

    // Create a safe filename from jackpot name for caching
    const safeJackpotName = jackpotApiName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const cacheDir = path.join(process.cwd(), 'public', 'cache');
    const cacheFilename = `${safeJackpotName}-fixtures.json`;
    const cachePath = path.join(cacheDir, cacheFilename);

    try {
        // Create cache directory if it doesn't exist
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir, { recursive: true });
        }

        // Check if we have a valid cache file for fixtures only (30 minutes = 1,800,000 ms)
        if (fs.existsSync(cachePath)) {
            const cacheContent = fs.readFileSync(cachePath, 'utf8');
            const cache = JSON.parse(cacheContent);
            
            const cacheTime = new Date(cache.generatedAt).getTime();
            const now = new Date().getTime();
            const ageInMinutes = (now - cacheTime) / (1000 * 60);
            
            if (ageInMinutes <= 30) {
                // ✅ Cache is valid - use cached fixtures
                initialGamesData = cache.gamesData;
                cacheInfo = {
                    fromCache: true,
                    generatedAt: cache.generatedAt
                };
            } else {
                // ❌ Cache expired - delete it
                fs.unlinkSync(cachePath);
            }
        }

        // If no valid cache, fetch fixtures from API
        if (initialGamesData.length === 0) {            
            // Fetch jackpot fixtures
            const response = await fetch(
                `https://api.pitchpredictions.com/api/fetch_jackpot_fixtures_by_name?jackpot_name=${encodeURIComponent(jackpotApiName)}`,
                { headers }
            );

            // If API returns 404, show friendly message
            if (response.status === 404) {
                return {
                    props: {
                        initialGamesData: [],
                        endpointStatus: "not_found",
                        error: null,
                        initialVoteStats: {},
                        jackpotApiName: jackpotApiName,
                        isNotFound: true
                    }
                };
            }

            if (!response.ok) {
                // For other errors, still show friendly message but with error status
                return {
                    props: {
                        initialGamesData: [],
                        endpointStatus: "not_found",
                        error: "This jackpot is currently not available",
                        initialVoteStats: {},
                        jackpotApiName: jackpotApiName,
                        isNotFound: true
                    }
                };
            }

            const data = await response.json();
            
            // If API returns false status or no data, show friendly message
            if (!data.status || !data.data || data.data.length === 0) {
                return {
                    props: {
                        initialGamesData: [],
                        endpointStatus: "not_found",
                        error: null,
                        initialVoteStats: {},
                        jackpotApiName: jackpotApiName,
                        isNotFound: true
                    }
                };
            }
            
            if (data.status && data.data && data.data.length > 0) {
                initialGamesData = data.data.map(game => ({
                    ...game,
                    jackpot_id: game.jackpot_tips_id,
                    fixture_id: game.fixture_id,
                    game_id: game.id,
                    // Add helper properties for UI
                    home_team_name: game.home_team_name,
                    away_team_name: game.away_team_name,
                    percent_pred_home: game.percent_pred_home || "0%",
                    percent_pred_draw: game.percent_pred_draw || "0%",
                    percent_pred_away: game.percent_pred_away || "0%",
                    bets_home: game.bets_home || "1.00",
                    bets_draw: game.bets_draw || "1.00",
                    bets_away: game.bets_away || "1.00"
                }));

                // Save fixtures to cache (without vote stats)
                const cacheData = {
                    generatedAt: new Date().toISOString(),
                    gamesData: initialGamesData,
                    count: initialGamesData.length,
                    jackpotName: jackpotApiName
                };
                
                // Atomic write
                const tempPath = `${cachePath}.tmp.${Date.now()}`;
                fs.writeFileSync(tempPath, JSON.stringify(cacheData, null, 2));
                fs.renameSync(tempPath, cachePath);
                
                cacheInfo = {
                    fromCache: false,
                    generatedAt: cacheData.generatedAt
                };
                
            }
        }

        // ALWAYS fetch live vote stats (don't cache these)
        if (initialGamesData.length > 0) {
            console.log(`Fetching live vote stats for "${jackpotApiName}"...`);
            const jackpotId = initialGamesData[0]?.jackpot_tips_id;
            const fixtureIds = initialGamesData.map(game => game.fixture_id);

            try {
                const statsResponse = await fetch('https://api.pitchpredictions.com/api/jackpot/vote/stats/multiple', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'R9TxV3PbOEu7qZnJKgydC5LmX2'
                    },
                    body: JSON.stringify({
                        jackpot_id: jackpotId,
                        fixture_ids: fixtureIds
                    })
                });

                const statsResult = await statsResponse.json();
                
                if (statsResult.status && statsResult.data) {
                    initialVoteStats = statsResult.data;
                } else {
                    // Create empty stats if fetch fails
                    fixtureIds.forEach(fixtureId => {
                        initialVoteStats[fixtureId] = {
                            stats: { home_votes: 0, draw_votes: 0, away_votes: 0, total_votes: 0 },
                            percentages: { home: 0, draw: 0, away: 0 },
                            community_prediction: null
                        };
                    });
                }
            } catch (statsError) {                
                // Create empty stats for all fixtures on error
                fixtureIds.forEach(fixtureId => {
                    initialVoteStats[fixtureId] = {
                        stats: { home_votes: 0, draw_votes: 0, away_votes: 0, total_votes: 0 },
                        percentages: { home: 0, draw: 0, away: 0 },
                        community_prediction: null
                    };
                });
            }
        }

        // Clean up old cache files (older than 30 minutes)
        await cleanupOldCacheFiles(cacheDir, safeJackpotName);

        endpointStatus = "success";
        error = null;

    } catch (error) {
        // If cache exists but API failed, use cached fixtures as fallback
        if (fs.existsSync(cachePath)) {
            try {
                const cacheContent = fs.readFileSync(cachePath, 'utf8');
                const cache = JSON.parse(cacheContent);
                initialGamesData = cache.gamesData;
                cacheInfo = {
                    fromCache: true,
                    generatedAt: cache.generatedAt,
                    isFallback: true
                };
                
                // Still try to get live vote stats even if fixtures are from cache
                if (initialGamesData.length > 0) {
                    try {
                        const jackpotId = initialGamesData[0]?.jackpot_tips_id;
                        const fixtureIds = initialGamesData.map(game => game.fixture_id);
                        
                        const statsResponse = await fetch('https://api.pitchpredictions.com/api/jackpot/vote/stats/multiple', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'R9TxV3PbOEu7qZnJKgydC5LmX2'
                            },
                            body: JSON.stringify({
                                jackpot_id: jackpotId,
                                fixture_ids: fixtureIds
                            })
                        });

                        const statsResult = await statsResponse.json();
                        
                        if (statsResult.status && statsResult.data) {
                            initialVoteStats = statsResult.data;
                        }
                    } catch (voteStatsError) {
                        console.error(`Error fetching vote stats in fallback mode for "${jackpotApiName}":`, voteStatsError);
                    }
                }
                
                return {
                    props: {
                        initialGamesData,
                        endpointStatus: "success",
                        error: null,
                        initialVoteStats,
                        jackpotApiName: jackpotApiName,
                        isNotFound: false,
                        cacheInfo
                    }
                };
            } catch (fallbackErr) {
                console.error(`Fallback error for "${jackpotApiName}":`, fallbackErr);
            }
        }

        // Return friendly message instead of error
        return {
            props: {
                initialGamesData: [],
                endpointStatus: "not_found",
                error: "This jackpot is currently not available",
                initialVoteStats: {},
                jackpotApiName: jackpotApiName,
                isNotFound: true
            }
        };
    }
    
    return {
        props: {
            initialGamesData,
            endpointStatus,
            error,
            initialVoteStats,
            jackpotApiName: jackpotApiName,
            isNotFound: false,
            cacheInfo
        }
    };
}

// Helper function to clean up old cache files
async function cleanupOldCacheFiles(cacheDir, currentJackpotName) {
    try {
        if (!fs.existsSync(cacheDir)) return;
        
        const files = fs.readdirSync(cacheDir);
        const now = new Date().getTime();
        const maxAge = 30 * 60 * 1000; // 30 minutes
        
        for (const file of files) {
            // Only clean up files that end with '-fixtures.json' and aren't the current one
            if (file.endsWith('-fixtures.json') && !file.includes(currentJackpotName)) {
                const filePath = path.join(cacheDir, file);
                const stats = fs.statSync(filePath);
                const fileAge = now - stats.mtimeMs;
                
                if (fileAge > maxAge) {
                    fs.unlinkSync(filePath);
                }
            }
        }
    } catch (error) {
        console.error('Error cleaning up cache:', error);
    }
}

export default JackpotByNamePredictions;