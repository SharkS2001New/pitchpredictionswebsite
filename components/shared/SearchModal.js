import React, { useState, useEffect, useRef } from "react";
import FetchSearchResults from "../functions/search";
import Link from "next/link";
import DateTimeToUsersTimezone from "../functions/DatetimeToUsersTimezone";

// Regular function component - no forwardRef needed
const SearchModal = ({ isOpen, onClose }) => {
    const [searchResults, setSearchResults] = useState([]);
    const [search_query, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [activeFilter, setActiveFilter] = useState("all");
    const [suggestedTeams, setSuggestedTeams] = useState([]);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

    const searchInputRef = useRef(null);
    const searchTimerRef = useRef(null);

    // Load suggested teams when modal opens
    useEffect(() => {
        if (isOpen) {
            loadSuggestedTeams();
            setTimeout(() => {
                searchInputRef.current?.focus();
            }, 100);
        } else {
            // Reset state when modal closes
            setSearchResults([]);
            setSearchQuery("");
            setIsLoading(false);
            setActiveFilter("all");
            setSuggestedTeams([]);
        }
    }, [isOpen]);

    // Load suggested teams from API
    const loadSuggestedTeams = async () => {
        
        setIsLoadingSuggestions(true);

        try {
            // Get today's date in YYYY-MM-DD format
            const today = new Date();
            const todaysDate = today.toISOString().split('T')[0];
            
            const url = `https://api.pitchpredictions.com/api/todays_search_suggestions_teams?fixture_date=${todaysDate}`;
            
            const response = await fetch(url, {
                headers: { "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2" }
            });
            
            if (response.ok) {
                const data = await response.json();
                setSuggestedTeams(data.data || []);
            }
        } catch (error) {
            console.error("Error loading suggestions:", error);
        } finally {
            setIsLoadingSuggestions(false);
        }
    };

    // Debounced search function
    const searchOnChange = (inputed_search_query) => {
        setSearchQuery(inputed_search_query);

        if (searchTimerRef.current) {
            clearTimeout(searchTimerRef.current);
        }

        if (inputed_search_query.length >= 3) {
            setIsLoading(true);

            searchTimerRef.current = setTimeout(() => {
                FetchSearchResults(inputed_search_query).then(response => {
                    setSearchResults(response);
                    setIsLoading(false);
                }).catch(() => {
                    setIsLoading(false);
                });
            }, 300);
        } else {
            setSearchResults([]);
            setIsLoading(false);
        }
    };

    // Handle search item click
    const handleSearchItemClick = () => {
        onClose();
    };

    // Filter results based on active filter
    const getFilteredResults = () => {
        if (activeFilter === "all") return searchResults;
        return searchResults.filter(result => result.search_group === activeFilter);
    };

    // Group results by type
    const groupResultsByType = (results) => {
        const teams = results.filter(r => r.search_group === "team");
        const leagues = results.filter(r => r.search_group === "league");
        const countries = results.filter(r => r.search_group === "country");
        const fixtures = results.filter(r => r.search_group === "fixture");
        
        return { teams, leagues, countries, fixtures };
    };

    const filteredResults = getFilteredResults();
    const groupedResults = groupResultsByType(filteredResults);

    // Check if any results exist for the current filter
    const hasAnyResults = () => {
        if (activeFilter === "all") {
            return searchResults.length > 0;
        }
        return filteredResults.length > 0;
    };

    if (!isOpen) return null;

    return (
        <div className="search-modal-overlay" onClick={onClose}>
            <div className="search-modal" onClick={e => e.stopPropagation()}>
                {/* Modal Header */}
                <div className="search-modal-header">
                    <h2>Search</h2>
                    <p className="text-secondary">Search matches, competitions, teams, players, and more</p>
                    <button className="close-button" onClick={onClose}>
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>

                {/* Search Input */}
                <div className="search-input-container">
                    <i className="bi bi-search search-icon"></i>
                    <input
                        ref={searchInputRef}
                        type="text"
                        className="search-input"
                        placeholder="Search..."
                        onChange={(e) => searchOnChange(e.target.value)}
                        value={search_query}
                    />
                </div>

                {/* Filter Tabs */}
                {search_query.length >= 3 && !isLoading && (
                    <div className="filter-tabs">
                        <button 
                            className={`filter-tab ${activeFilter === "all" ? "active" : ""}`}
                            onClick={() => setActiveFilter("all")}
                        >
                            All
                        </button>
                        <button 
                            className={`filter-tab ${activeFilter === "team" ? "active" : ""}`}
                            onClick={() => setActiveFilter("team")}
                        >
                            Teams
                        </button>
                        <button 
                            className={`filter-tab ${activeFilter === "fixture" ? "active" : ""}`}
                            onClick={() => setActiveFilter("fixture")}
                        >
                            Matches
                        </button>
                        <button 
                            className={`filter-tab ${activeFilter === "league" ? "active" : ""}`}
                            onClick={() => setActiveFilter("league")}
                        >
                            Leagues
                        </button>
                        <button 
                            className={`filter-tab ${activeFilter === "country" ? "active" : ""}`}
                            onClick={() => setActiveFilter("country")}
                        >
                            Countries
                        </button>                      
                    </div>
                )}

                {/* Loading State */}
                {isLoading && (
                    <div className="search-loading">
                        <div className="spinner"></div>
                        <p>Searching...</p>
                    </div>
                )}

                {/* Search Results */}
                {!isLoading && search_query.length >= 3 && hasAnyResults() && (
                    <div className="search-results">
                        {/* For ALL filter - only show sections with data, no messages for empty sections */}
                        {activeFilter === "all" && (
                            <>
                                {/* Teams Section - only if has data */}
                                {groupedResults.teams.length > 0 && (
                                    <div className="result-section">
                                        <h3>Teams</h3>
                                        {groupedResults.teams.map((result, index) => (
                                            <a
                                                key={index}
                                                href={encodeURI("/team/" + result.search_res_name.toLowerCase().replace(/\s+/g, '-') + "-" + result.search_res_id) + "/results"}
                                                className="result-item"
                                                onClick={handleSearchItemClick}
                                            >
                                                <span className="result-name">{result.search_res_name}</span>
                                                <span className="result-badge team-badge">Team</span>
                                            </a>
                                        ))}
                                    </div>
                                )}

                                {/* Leagues Section - only if has data */}
                                {groupedResults.leagues.length > 0 && (
                                    <div className="result-section">
                                        <h3>Leagues</h3>
                                        {groupedResults.leagues.map((result, index) => (
                                            <a
                                                key={index}
                                                href={"/league/football-predictions-for-" + result.search_country.toLowerCase() + "/" + encodeURIComponent(result.search_res_name.toLowerCase().replace(/\s+/g, '-')) + '-' + result.search_res_id + "/fixtures"}
                                                className="result-item"
                                                onClick={handleSearchItemClick}
                                            >
                                                <span className="result-name">
                                                    {result.search_res_name} <span className="text-secondary">({result.search_country})</span>
                                                </span>
                                                <span className="result-badge league-badge">League</span>
                                            </a>
                                        ))}
                                    </div>
                                )}

                                {/* Countries Section - only if has data */}
                                {groupedResults.countries.length > 0 && (
                                    <div className="result-section">
                                        <h3>Countries</h3>
                                        {groupedResults.countries.map((result, index) => (
                                            <a
                                                key={index}
                                                href={encodeURI("/country/football-predictions-for-" + result.search_res_name.toLowerCase()) + "/fixtures"}
                                                className="result-item"
                                                onClick={handleSearchItemClick}
                                            >
                                                <span className="result-name">{result.search_res_name}</span>
                                                <span className="result-badge country-badge">Country</span>
                                            </a>
                                        ))}
                                    </div>
                                )}

                            {/* Matches Section - only if has data */}
                            {groupedResults.fixtures.length > 0 && (
                                <div className="result-section">
                                    <h3>Matches</h3>
                                    {groupedResults.fixtures.map((result, index) => (
                                        <a
                                            key={index}
                                            href={'/match/football-predictions-' + 
                                                result.search_res_name.split(' VS ')[0].replace(/\s+/g, '-').toLowerCase()
                                                + '-vs-' + 
                                                result.search_res_name.split(' VS ')[1].replace(/\s+/g, '-').toLowerCase()
                                                + '-' + result.search_res_id + "/matches"}
                                            className="result-item"
                                            onClick={handleSearchItemClick}
                                        >
                                            <div className="match-info">
                                                <span className="result-name">{result.search_res_name}</span>
                                                <span className="match-date">{result.search_res_date}</span>
                                            </div>
                                            <span className="result-badge match-badge">Match</span>
                                        </a>
                                    ))}
                                </div>
                            )}
                            </>
                        )}

                        {/* For specific filters - show message if no data */}
                        {activeFilter === "team" && (
                            <div className="result-section">
                                <h3>Teams</h3>
                                {groupedResults.teams.length > 0 ? (
                                    groupedResults.teams.map((result, index) => (
                                        <a
                                            key={index}
                                            href={encodeURI("/team/" + result.search_res_name.toLowerCase().replace(/\s+/g, '-') + "-" + result.search_res_id) + "/results"}
                                            className="result-item"
                                            onClick={handleSearchItemClick}
                                        >
                                            <span className="result-name">{result.search_res_name}</span>
                                            <span className="result-badge team-badge">Team</span>
                                        </a>
                                    ))
                                ) : (
                                    <div className="no-results-message">
                                        <p>No teams matching your query</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeFilter === "league" && (
                            <div className="result-section">
                                <h3>Leagues</h3>
                                {groupedResults.leagues.length > 0 ? (
                                    groupedResults.leagues.map((result, index) => (
                                        <a
                                            key={index}
                                            href={"/league/football-predictions-for-" + result.search_country.toLowerCase() + "/" + encodeURIComponent(result.search_res_name.toLowerCase().replace(/\s+/g, '-')) + '-' + result.search_res_id + "/fixtures"}
                                            className="result-item"
                                            onClick={handleSearchItemClick}
                                        >
                                            <span className="result-name">
                                                {result.search_res_name} <span className="text-secondary">({result.search_country})</span>
                                            </span>
                                            <span className="result-badge league-badge">League</span>
                                        </a>
                                    ))
                                ) : (
                                    <div className="no-results-message">
                                        <p>No leagues matching your query</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeFilter === "country" && (
                            <div className="result-section">
                                <h3>Countries</h3>
                                {groupedResults.countries.length > 0 ? (
                                    groupedResults.countries.map((result, index) => (
                                        <a
                                            key={index}
                                            href={encodeURI("/country/football-predictions-for-" + result.search_res_name.toLowerCase()) + "/fixtures"}
                                            className="result-item"
                                            onClick={handleSearchItemClick}
                                        >
                                            <span className="result-name">{result.search_res_name}</span>
                                            <span className="result-badge country-badge">Country</span>
                                        </a>
                                    ))
                                ) : (
                                    <div className="no-results-message">
                                        <p>No countries matching your query</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeFilter === "fixture" && (
                            <div className="result-section">
                                <h3>Matches</h3>
                                {groupedResults.fixtures.length > 0 ? (
                                    groupedResults.fixtures.map((result, index) => (
                                        <a
                                            key={index}
                                            href={'/match/football-predictions-' + 
                                            result.search_res_name.split(' VS ')[0].replace(/\s+/g, '-').toLowerCase()
                                            + '-vs-' + 
                                            result.search_res_name.split(' VS ')[1].replace(/\s+/g, '-').toLowerCase()
                                            + '-' + result.search_res_id + "/matches"}
                                            className="result-item"
                                            onClick={handleSearchItemClick}
                                        >
                                            <div className="match-info">
                                                <span className="result-name">{result.search_res_name}</span>
                                                <span className="match-date">{result.search_res_date}</span>
                                            </div>
                                            <span className="result-badge match-badge">Match</span>
                                        </a>
                                    ))
                                ) : (
                                    <div className="no-results-message">
                                        <p>No matches matching your query</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* No Results State - Only when searching with no results for the current filter */}
                {!isLoading && search_query.length >= 3 && !hasAnyResults() && (
                    <div className="no-results">
                        <p className="no-results-icon">🔍</p>
                        <h3>No Results Found</h3>
                        <p className="text-secondary">
                            {activeFilter === "all" && "Try searching for something else"}
                            {activeFilter === "team" && "No teams matching your query"}
                            {activeFilter === "league" && "No leagues matching your query"}
                            {activeFilter === "country" && "No countries matching your query"}
                            {activeFilter === "fixture" && "No matches matching your query"}
                        </p>
                    </div>
                )}
            
                {/* Popular Suggestions */}
                {search_query.length < 3 && (
                    <div className="suggestions-section">
                        <h3>Popular Suggestions for Today</h3>
                        {isLoadingSuggestions ? (
                            <div className="suggestions-loading">
                                <div className="spinner-small"></div>
                                <p>Loading suggestions...</p>
                            </div>
                        ) : suggestedTeams.length > 0 ? (
                            <div className="suggestions-grid">
                                {suggestedTeams.slice(0, 8).map((team) => (
                                    <a
                                        key={team.id}
                                        href={`/team/${team.name.toLowerCase().replace(/\s+/g, '-')}-${team.id}/results`}
                                        className="suggestion-item"
                                        onClick={handleSearchItemClick}
                                    >
                                        <div className="suggestion-name">{team.name}</div>
                                        <div className="suggestion-meta">
                                            <span>{team.league}</span>
                                            <span className="suggestion-time">{DateTimeToUsersTimezone(team.match_time).split(' ')[1]}</span>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        ) : (
                            <div className="no-suggestions">
                                <p className="text-secondary">No suggestions available</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

// Add display name for better debugging
SearchModal.displayName = 'SearchModal';

export default SearchModal;