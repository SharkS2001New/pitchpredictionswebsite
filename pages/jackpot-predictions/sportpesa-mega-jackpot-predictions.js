// pages/jackpot/sportpesa-mega-jackpot-predictions.js
import React, { useState, useEffect } from 'react';
import DataNotFoundPage from "../../components/includes/datanotfound";
import { Adsense } from "@/components/shared/client-adsense";
import SportpesaMegaJackpotContent from "../../components/seo-content/jackpots/sportpesa-mega-jackpot-predictions";
import JackpotGamesBootstrap from "../../components/shared/jackpot-games-new-ui";
import fs from 'fs';
import path from 'path';
import { writeCacheFileAtPath } from "../../components/functions/file_cache";

function SportpesaMegaJackpotPredictions({ 
    initialGamesData, 
    endpointStatus, 
    error,
    initialVoteStats,
    structuredData
}) {         
    const [gamesData, setGamesData] = useState(initialGamesData || []);
    const [selectedVotes, setSelectedVotes] = useState({});
    const [voteStats, setVoteStats] = useState(initialVoteStats || {});
    const [deviceId, setDeviceId] = useState('');
    const [votingInProgress, setVotingInProgress] = useState({});
    const [refreshingStats, setRefreshingStats] = useState({});

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
            return;
        }

        // Check if already voting for this fixture
        if (votingInProgress[fixtureId]) {
            return; // Already voting, ignore click
        }

        try {
            const game = gamesData.find(g => g.fixture_id == fixtureId);
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
                jackpot_name: game.jackpot_name || 'Sportpesa Mega Jackpot',
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

    // Handle error state
    if (endpointStatus === "error" || error) {
        return (
            <>
                {/* Structured Data Script */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
                />
                <div className="sites-card jackpot-sites-card">
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
            </>
        );
    }

    // Handle empty data state
    if (!gamesData || gamesData.length === 0) {
        return (
            <>
                {/* Structured Data Script */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
                />
                <div className="sites-card jackpot-sites-card">
                    <DataNotFoundPage props="No jackpot fixtures available at the moment." />
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
            </>
        );
    }

    return (
        <>
            {/* Structured Data Script */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
            
            <div className="sites-card jackpot-sites-card">
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
                        <SportpesaMegaJackpotContent/>
                    </div>
                </div>
            </div>
        </>
    );
}

export async function getServerSideProps() {
    const siteUrl = 'https://www.pitchpredictions.com';
    const currentDate = new Date().toISOString().split('T')[0];
    
    const headers = {
        "Content-type": "application/json; charset=UTF-8",
        Origin: "https://www.pitchpredictions.com", Authorization: `Bearer ${process.env.ACCESS_TOKEN || "UJlhuDILIR1Lc2IEwZDIKOln9d"}`
    };

    let initialGamesData = [];
    let endpointStatus = "success";
    let error = null;
    let initialVoteStats = {};
    let cacheInfo = {
        fromCache: false,
        generatedAt: null
    };

    // Cache setup
    const cacheDir = path.join(process.cwd(), 'public', 'cache');
    const cacheFilename = `sportpesa-mega-jackpot-fixtures.json`;
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
                "https://api.pitchpredictions.com/api/fetch_jackpot_fixtures_by_name?jackpot_name=Sportpesa Mega Jackpot",
                { headers }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.status && data.data) {
                initialGamesData = data.data.map(game => ({
                    ...game,
                    jackpot_id: game.jackpot_tips_id,
                    fixture_id: game.fixture_id,
                    game_id: game.id
                }));

                // Save fixtures to cache (without vote stats)
                const cacheData = {
                    generatedAt: new Date().toISOString(),
                    gamesData: initialGamesData,
                    count: initialGamesData.length
                };
                
                // Atomic write
                writeCacheFileAtPath(cachePath, cacheData);
                
                cacheInfo = {
                    fromCache: false,
                    generatedAt: cacheData.generatedAt
                };
                
            }

            endpointStatus = data.status === true ? "success" : "error";
            error = data.status === true ? null : (data.message || "Failed to load jackpot fixtures");
        }

        // ALWAYS fetch live vote stats (don't cache these)
        if (initialGamesData.length > 0) {
            const jackpotId = initialGamesData[0]?.jackpot_tips_id;
            const fixtureIds = initialGamesData.map(game => game.fixture_id);

            try {
                const statsResponse = await fetch('https://api.pitchpredictions.com/api/jackpot/vote/stats/multiple', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Origin: "https://www.pitchpredictions.com", Authorization: `Bearer ${process.env.ACCESS_TOKEN || "UJlhuDILIR1Lc2IEwZDIKOln9d"}`
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
        await cleanupOldCacheFiles(cacheDir);

    } catch (err) {
        console.error("Error fetching jackpot data:", err);
        endpointStatus = "error";
        error = err.message || "Failed to load jackpot fixtures";
        initialGamesData = [];
        initialVoteStats = {};
        
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
                endpointStatus = "success";
                error = null;
                
                // Still try to get live vote stats even if fixtures are from cache
                if (initialGamesData.length > 0) {
                    try {
                        const jackpotId = initialGamesData[0]?.jackpot_tips_id;
                        const fixtureIds = initialGamesData.map(game => game.fixture_id);
                        
                        const statsResponse = await fetch('https://api.pitchpredictions.com/api/jackpot/vote/stats/multiple', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                Origin: "https://www.pitchpredictions.com", Authorization: `Bearer ${process.env.ACCESS_TOKEN || "UJlhuDILIR1Lc2IEwZDIKOln9d"}`
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
                        console.error("Error fetching vote stats in fallback mode:", voteStatsError);
                    }
                }
            } catch (fallbackErr) {
                console.error('Fallback error:', fallbackErr);
            }
        }
    }

    // Create structured data for Sportpesa Mega Jackpot
    const structuredData = createStructuredData(siteUrl, currentDate);

    return {
        props: {
            initialGamesData,
            endpointStatus,
            error,
            initialVoteStats,
            structuredData,
            cacheInfo
        }
    };
}

// Helper function to clean up old cache files
async function cleanupOldCacheFiles(cacheDir) {
    try {
        if (!fs.existsSync(cacheDir)) return;
        
        const files = fs.readdirSync(cacheDir);
        const now = new Date().getTime();
        const maxAge = 30 * 60 * 1000; // 30 minutes
        
        for (const file of files) {
            if (file === 'sportpesa-mega-jackpot-fixtures.json') {
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

// Helper function to create structured data for Sportpesa Mega Jackpot
function createStructuredData(siteUrl, currentDate) {
    return {
        "@context": "https://schema.org",
        "@graph": [
            // 1. Organization
            {
                "@type": "Organization",
                "@id": `${siteUrl}#organization`,
                "name": "Pitch Predictions",
                "url": siteUrl,
                "logo": {
                    "@type": "ImageObject",
                    "url": `${siteUrl}/pitch-predictions-logo.png`,
                    "width": 300,
                    "height": 60
                },
                "description": "Free, data-driven football prediction platform covering 700+ leagues and jackpots worldwide.",
                "sameAs": ["https://t.me/s/betsassuredkenya"],
                "contactPoint": {
                    "@type": "ContactPoint",
                    "contactType": "Customer Support",
                    "url": `${siteUrl}/contactus`
                }
            },
            
            // 2. WebPage for Sportpesa Mega Jackpot
            {
                "@type": "WebPage",
                "@id": `${siteUrl}/jackpot-predictions/sportpesa-mega-jackpot-predictions#webpage`,
                "name": "Sportpesa Mega Jackpot Predictions – Free Tips This Weekend",
                "description": "Free Sportpesa Mega Jackpot predictions for all 17 games this weekend. Expert 1X2 and Double Chance tips backed by form, H2H and squad data — updated every week.",
                "url": `${siteUrl}/jackpot-predictions/sportpesa-mega-jackpot-predictions`,
                "isPartOf": {
                    "@type": "WebSite",
                    "@id": `${siteUrl}#website`
                },
                "about": {
                    "@type": "Thing",
                    "name": "Sportpesa Mega Jackpot Predictions"
                },
                "dateModified": currentDate,
                "inLanguage": "en",
                "breadcrumb": {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        {
                            "@type": "ListItem",
                            "position": 1,
                            "name": "Home",
                            "item": siteUrl
                        },
                        {
                            "@type": "ListItem",
                            "position": 2,
                            "name": "Jackpot Predictions",
                            "item": `${siteUrl}/jackpot-predictions`
                        },
                        {
                            "@type": "ListItem",
                            "position": 3,
                            "name": "Sportpesa Mega Jackpot Predictions",
                            "item": `${siteUrl}/jackpot-predictions/sportpesa-mega-jackpot-predictions`
                        }
                    ]
                }
            },
            
            // 3. FAQPage for Sportpesa Mega Jackpot
            {
                "@type": "FAQPage",
                "@id": `${siteUrl}/jackpot-predictions/sportpesa-mega-jackpot-predictions#faq`,
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": "What is the Sportpesa Mega Jackpot?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "The Sportpesa Mega Jackpot is a weekly football jackpot offered by Sportpesa Kenya. It features 17 preselected games from leagues around the world played every weekend (Saturday–Sunday). The grand prize is up to KSh 360 million for correctly predicting all 17 outcomes. Bonus prizes are awarded for 12, 13, 14, 15, and 16 correct predictions."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "How do I win the Sportpesa Mega Jackpot?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "To win the Sportpesa Mega Jackpot grand prize, you must correctly predict all 17 preselected games. Each game requires a 1X2 prediction — Home win (1), Draw (X), or Away win (2). Sportpesa also awards bonus prizes for 12, 13, 14, 15, or 16 correct predictions, making partial wins a realistic weekly target."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Are the Sportpesa Mega Jackpot predictions on Pitch Predictions free?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Yes. All Sportpesa Mega Jackpot predictions on Pitch Predictions are completely free. We publish expert 1X2 and Double Chance tips for all 17 jackpot games every week, backed by statistical analysis covering form, head-to-head records, and squad news. A premium subscription provides access to additional in-depth analysis."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "How are the Sportpesa Mega Jackpot predictions calculated?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Our Mega Jackpot predictions are built using each team's last 12 match performance, head-to-head records, current league standings, and home and away form. We provide both 1X2 and Double Chance options for all 17 games to help bettors improve their chances of reaching bonus prize thresholds."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "When is the Sportpesa Mega Jackpot deadline?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "The Sportpesa Mega Jackpot deadline is before the kickoff of the first preselected game each weekend, typically Saturday afternoon. Pitch Predictions publishes predictions early in the week — well before the deadline — so you have time to review the analysis and submit your slip."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "How much does it cost to enter the Sportpesa Mega Jackpot?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "The Sportpesa Mega Jackpot requires a stake of KSh 99 per entry. You must predict the outcomes of all 17 preselected games on a single slip. Multiple entries are allowed, enabling bettors to cover different combinations across the 17 games."
                        }
                    }
                ]
            },
            
            // 4. BreadcrumbList
            {
                "@type": "BreadcrumbList",
                "@id": `${siteUrl}/jackpot-predictions/sportpesa-mega-jackpot-predictions#breadcrumb`,
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": siteUrl
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": "Jackpot Predictions",
                        "item": `${siteUrl}/jackpot-predictions`
                    },
                    {
                        "@type": "ListItem",
                        "position": 3,
                        "name": "Sportpesa Mega Jackpot Predictions",
                        "item": `${siteUrl}/jackpot-predictions/sportpesa-mega-jackpot-predictions`
                    }
                ]
            },
            
            // 5. WebSite
            {
                "@type": "WebSite",
                "@id": `${siteUrl}#website`,
                "name": "Pitch Predictions",
                "url": siteUrl,
                "publisher": {
                    "@id": `${siteUrl}#organization`
                }
            }
        ]
    };
}

export default SportpesaMegaJackpotPredictions;