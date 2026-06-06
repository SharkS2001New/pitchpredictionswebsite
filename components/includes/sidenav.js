'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import useCompatRouter from '../functions/use-compat-router';
import jsonpopularLeagues from "../../public/jsonfiles/popular-leagues.json";
import jsonotherLeagues from "../../public/jsonfiles/other-leagues.json";
import jsonotherCompetitions from "../../public/jsonfiles/other-competitions.json";
import LeagusByCountryCollapsible from "./leagues_by_country_collapsible";
import GetLeagueId from '../functions/GetLeagueId';

const STATIC_PINNED_LEAGUES = jsonpopularLeagues.data || [];
const STATIC_OTHER_LEAGUES = jsonotherLeagues.data || [];
const STATIC_OTHER_COMPETITIONS = jsonotherCompetitions.data || [];
const CACHE_DURATION = 24 * 60 * 60 * 1000;

function readCachedLeagues(key, fallback) {
    if (typeof window === "undefined") return fallback;

    try {
        const cached = localStorage.getItem(key);
        if (!cached) return fallback;
        const parsed = JSON.parse(cached);
        return Array.isArray(parsed) && parsed.length > 0 ? parsed : fallback;
    } catch {
        return fallback;
    }
}

function SideNavBar() {
    const router = useCompatRouter();
    const leagueId = useMemo(() => GetLeagueId(router), [router]);

    const [pinnedLeagues, setPinnedLeagues] = useState(STATIC_PINNED_LEAGUES);
    const [otherLeagues, setOtherLeagues] = useState(STATIC_OTHER_LEAGUES);
    const [otherCompetions, setOtherCompetions] = useState(STATIC_OTHER_COMPETITIONS);

    const openSidemenu = useCallback(() => {
        if (typeof window === 'undefined') return;
        document.body.classList.toggle('sb-sidenav-toggled');
        localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
    }, []);

    useEffect(() => {
        setPinnedLeagues(readCachedLeagues('pinnedLeagues', STATIC_PINNED_LEAGUES));
        setOtherLeagues(readCachedLeagues('otherLeagues', STATIC_OTHER_LEAGUES));
        setOtherCompetions(readCachedLeagues('otherCompetitions', STATIC_OTHER_COMPETITIONS));

        const now = Date.now();
        const updates = [
            { key: 'pinnedLeagues', data: STATIC_PINNED_LEAGUES, tsKey: 'pinnedLeagues_timestamp', setter: setPinnedLeagues },
            { key: 'otherLeagues', data: STATIC_OTHER_LEAGUES, tsKey: 'otherLeagues_timestamp', setter: setOtherLeagues },
            { key: 'otherCompetitions', data: STATIC_OTHER_COMPETITIONS, tsKey: 'otherCompetitions_timestamp', setter: setOtherCompetions },
        ];

        for (const item of updates) {
            const timestamp = localStorage.getItem(item.tsKey);
            const isExpired = !timestamp || now - parseInt(timestamp, 10) > CACHE_DURATION;

            if (isExpired) {
                item.setter(item.data);
                localStorage.setItem(item.key, JSON.stringify(item.data));
                localStorage.setItem(item.tsKey, now.toString());
            }
        }
    }, []);

    const countryName = useMemo(() => {
        if (router.pathname.includes("country/[football-prediction-for-country]") && router.isReady) {
            const query_link = router.query["football-prediction-for-country"];
            const prefix = "football-predictions-for-";
            return query_link ? query_link.substring(prefix.length) : "";
        }
        return "";
    }, [router.pathname, router.isReady, router.query]);

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

    return (
        <div className="" id="sidebar-wrapper">
            <div className="sideNavCustom">
                <div className="list-group list-group-flush">
                    <span className="list-group-item list-group-item-action p-1 sideNavCustom1" style={{ backgroundColor: "#212830" }}></span>
                    
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
