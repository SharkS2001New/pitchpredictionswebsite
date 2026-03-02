import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from "next/router";
import jsonpopularLeagues from "../../public/jsonfiles/popular-leagues.json";
import jsonotherLeagues from "../../public/jsonfiles/other-leagues.json";
import jsonotherCompetitions from "../../public/jsonfiles/other-competitions.json";
import LeagusByCountryCollapsible from "./leagues_by_country_collapsible";
import GetLeagueId from '../functions/GetLeagueId';

function SideNavBar() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    
    // Memoize the leagueId to prevent recalculations
    const leagueId = useMemo(() => GetLeagueId(router), [router]);

    // Initialize with empty arrays - no localStorage access during server render
    const [pinnedLeagues, setPinnedLeagues] = useState([]);
    const [otherLeagues, setOtherLeagues] = useState([]);
    const [otherCompetions, setOtherCompetions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Set mounted state after hydration
    useEffect(() => {
        setMounted(true);
    }, []);

    const openSidemenu = useCallback(() => {
        if (typeof window === 'undefined') return;
        document.body.classList.toggle('sb-sidenav-toggled');
        localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
    }, []);

    // Cache duration - 24 hours
    const CACHE_DURATION = 24 * 60 * 60 * 1000;

    // Load from localStorage only after mounting
    useEffect(() => {
        if (!mounted) return;

        // Load cached data
        const cachedPinned = localStorage.getItem('pinnedLeagues');
        const cachedOther = localStorage.getItem('otherLeagues');
        const cachedComp = localStorage.getItem('otherCompetitions');
        
        if (cachedPinned) setPinnedLeagues(JSON.parse(cachedPinned));
        if (cachedOther) setOtherLeagues(JSON.parse(cachedOther));
        if (cachedComp) setOtherCompetions(JSON.parse(cachedComp));

        // Check if we need to fetch fresh data
        loadAllLeagues();
    }, [mounted]);

    const loadAllLeagues = async () => {
        setIsLoading(true);
        
        // Check cache timestamps
        const pinnedTimestamp = localStorage.getItem('pinnedLeagues_timestamp');
        const otherTimestamp = localStorage.getItem('otherLeagues_timestamp');
        const compTimestamp = localStorage.getItem('otherCompetitions_timestamp');
        const now = Date.now();

        // Load pinned leagues if cache expired or doesn't exist
        if (!pinnedTimestamp || now - parseInt(pinnedTimestamp) > CACHE_DURATION) {
            await getPinnedLeagues();
        }

        // Load other leagues if cache expired or doesn't exist
        if (!otherTimestamp || now - parseInt(otherTimestamp) > CACHE_DURATION) {
            await getOtherLeagues();
        }

        // Load other competitions if cache expired or doesn't exist
        if (!compTimestamp || now - parseInt(compTimestamp) > CACHE_DURATION) {
            await getOtherCompetions();
        }

        setIsLoading(false);
    };

    // Fetch pinned leagues and cache them
    const getPinnedLeagues = useCallback(async () => {
        try {
            const data = jsonpopularLeagues.data;
            setPinnedLeagues(data);
            
            // Cache with timestamp
            localStorage.setItem('pinnedLeagues', JSON.stringify(data));
            localStorage.setItem('pinnedLeagues_timestamp', Date.now().toString());
        } catch (error) {
            console.error("Error loading pinned leagues:", error);
        }
    }, []);

    // Fetch other leagues and cache them
    const getOtherLeagues = useCallback(async () => {
        try {
            const data = jsonotherLeagues.data;
            setOtherLeagues(data);
            
            localStorage.setItem('otherLeagues', JSON.stringify(data));
            localStorage.setItem('otherLeagues_timestamp', Date.now().toString());
        } catch (error) {
            console.error("Error loading other leagues:", error);
        }
    }, []);

    // Fetch other competitions and cache them
    const getOtherCompetions = useCallback(async () => {
        try {
            const data = jsonotherCompetitions.data;
            setOtherCompetions(data);
            
            localStorage.setItem('otherCompetitions', JSON.stringify(data));
            localStorage.setItem('otherCompetitions_timestamp', Date.now().toString());
        } catch (error) {
            console.error("Error loading other competitions:", error);
        }
    }, []);

    // Extract country name with useMemo
    const countryName = useMemo(() => {
        if (router.pathname.includes("country/[football-prediction-for-country]") && router.isReady) {
            const query_link = router.query["football-prediction-for-country"];
            const prefix = "football-predictions-for-";
            return query_link ? query_link.substring(prefix.length) : "";
        }
        return "";
    }, [router.pathname, router.isReady, router.query]);

    // Memoize pinned leagues display to prevent recalculation on every render
    const displayPinnedLeagues = useMemo(() => {
        if (!pinnedLeagues?.length) return [];

        return pinnedLeagues.map((league, index) => (
            <div className="d-flex align-items-center countryNameLink" key={league.league_id || index}>
                &nbsp;
                <div style={{ height: "10%", width: "10%", objectFit: "contain" }}>
                    <img
                        src={league.downloaded_country_flag}
                        height="100%"
                        width="100%"
                        className="img-fluid"
                        alt={league.country_name?.replace(/\s+/g, '-').toLowerCase() + "-football-predictions"}
                        style={{ backgroundColor: "whitesmoke" }}
                        loading="lazy"
                    />
                </div>
                <a
                    href={encodeURI("/league/football-predictions-for-" + league.country_name.toLowerCase() + "/" + league.league_name.replace(/\s+/g, '-').toLowerCase()) + '-' + league.league_id + "/fixtures"}
                    className={`list-group-item list-group-item-action sideNavCustom1 border-none countryNameLink d-flex align-items-center ${"popular" + league.league_id === "popular" + leagueId ? 'activeElement' : ''}`}
                    onClick={openSidemenu}
                    title={league.league_name}>
                    {league.league_name}
                </a>
            </div>
        ));
    }, [pinnedLeagues, leagueId, openSidemenu]);

    // Navigation items configuration for cleaner code
    const navItems = useMemo(() => [
        { href: "/football-predictions-today", label: "Football Predictions Today", exact: true },
        { href: "/live-football-predictions", label: "Live Football Predictions", exact: true },
        { href: "/upcoming-football-predictions", label: "Upcoming Football Predictions", exact: true },
        { href: "/football-predictions-tomorrow", label: "Football Predictions Tomorrow", exact: true },
        { href: "/football-predictions-weekend", label: "Football Predictions Weekend", exact: true },
        { href: "/football-predictions-yesterday", label: "Football Predictions Yesterday", exact: true },
        { 
            href: "/top-football-tips-and-predictions/today", 
            label: "Top Predictions (Top Picks)", 
            active: router.pathname.includes("/top-football-tips-and-predictions/")
        },
        { href: "/jackpot-predictions", label: "Jackpot Predictions", exact: true }
    ], [router.pathname]);

    // Show loading skeleton during server render or initial mount
    if (!mounted || (isLoading && !pinnedLeagues.length)) {
        return (
            <div className="" id="sidebar-wrapper">
                <div className="sideNavCustom">
                    <div className="list-group list-group-flush">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <div key={i} className="skeleton-row skeleton-row-shimmer" style={{ height: "40px", margin: "5px" }}></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="" id="sidebar-wrapper">
            <div className="sideNavCustom">
                <div className="list-group list-group-flush">
                    <span className="list-group-item list-group-item-action p-1 sideNavCustom1" style={{ backgroundColor: "#212830" }}></span>
                    
                    {/* Dynamic navigation items */}
                    {navItems.map((item) => (
                        <a
                            key={item.href}
                            href={item.href}
                            className={`list-group-item list-group-item-action p-1 sideNavCustom1 countryNameLink ${
                                item.exact 
                                    ? router.pathname.substring(1) === item.href.substring(1) ? "activeElement" : ""
                                    : item.active ? "activeElement" : ""
                            }`}
                            onClick={openSidemenu}>
                            {item.label}
                        </a>
                    ))}

                    <div className="border-bottom" id="sidenavDynamicheader" style={{ backgroundColor: "#202c3c", color: "white" }}>
                        Top Leagues
                    </div>
                    
                    <div className="responsive-cell team-link">
                        {displayPinnedLeagues}
                    </div>
                    
                    <div className="border-bottom" id="sidenavDynamicheader" style={{ backgroundColor: "#202c3c", color: "white" }}>
                        Countries
                    </div>
                    
                    <LeagusByCountryCollapsible 
                        other_leagues={otherLeagues} 
                        other_competions={otherCompetions} 
                        leagueId={leagueId} 
                        countryName={countryName}
                    />
                    <br />
                </div>
                <br />
            </div>
        </div>
    );
}

export default SideNavBar;