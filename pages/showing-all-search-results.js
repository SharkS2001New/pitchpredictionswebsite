// pages/search.js
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import Head from 'next/head';
import PreLoader from "../components/includes/loader";
import { Adsense } from "@/components/shared/client-adsense";
import DataNotFoundPage from "../components/includes/datanotfound";

function SearchResults({ initialSearchResults, searchQuery, error }) {
    const router = useRouter();
    const [searchResults, setSearchResults] = useState(initialSearchResults || []);
    const [loading, setLoading] = useState(!initialSearchResults);

    useEffect(() => {
        // Handle client-side search if query changes via router
        if (router.query.query && router.query.query !== searchQuery) {
            setLoading(true);
            
            // Fetch search results client-side
            fetch(`/api/search?q=${encodeURIComponent(router.query.query)}`)
                .then(res => res.json())
                .then(data => {
                    setSearchResults(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error('Search error:', err);
                    setSearchResults([]);
                    setLoading(false);
                });
        }
    }, [router.query.query]);

    // Format search query for display
    const formatSearchQuery = (query) => {
        if (!query) return '';
        return query.charAt(0).toUpperCase() + query.slice(1);
    };

    // Get page title based on results
    const getPageTitle = () => {
        if (searchResults.length > 0) {
            return `Search Results for "${formatSearchQuery(searchQuery)}" | Football Predictions | PitchPredictions`;
        }
        return `Search Football Predictions | Find Countries, Leagues, Teams & Fixtures | PitchPredictions`;
    };

    // Get meta description
    const getMetaDescription = () => {
        if (searchResults.length > 0) {
            const countries = searchResults.filter(r => r.search_group === 'country').length;
            const leagues = searchResults.filter(r => r.search_group === 'league').length;
            const teams = searchResults.filter(r => r.search_group === 'team').length;
            const fixtures = searchResults.filter(r => r.search_group === 'fixture').length;
            
            return `Found ${countries} countries, ${leagues} leagues, ${teams} teams, and ${fixtures} fixtures matching "${formatSearchQuery(searchQuery)}". Browse football predictions and analysis.`;
        }
        return `Search for countries, leagues, teams, and fixtures to get football predictions and expert analysis. Find matches, view statistics, and access betting tips.`;
    };

    if (loading) {
        return <PreLoader />;
    }

    if (error || (searchResults.length === 0 && router.query.query)) {
        return (
            <>
                <Head>
                    <title>No Results Found for "{formatSearchQuery(router.query.query)}" | PitchPredictions</title>
                    <meta name="description" content={`No search results found for "${formatSearchQuery(router.query.query)}". Try searching for countries, leagues, teams, or fixtures.`} />
                    <meta name="robots" content="noindex, follow" />
                </Head>
                
                <div className="container sites-card">
                    <DataNotFoundPage props={`No results found for "${formatSearchQuery(router.query.query)}". Please try a different search term.`} />
                    <br/>
                    <Adsense
                        client="ca-pub-5665711413000284"
                        slot="3850951453"
                        style={{ display: "block" }}
                        layout="display"
                        format="auto"
                    />
                </div>
            </>
        );
    }

    if (searchResults.length > 0) {
        return (
            <>
                <Head>
                    <title>{getPageTitle()}</title>
                    <meta name="description" content={getMetaDescription()} />
                    <meta name="robots" content="noindex, follow" />
                </Head>
                
                <div className="container">
                    {/* Countries Section */}
                    {searchResults.some((result) => result.search_group === 'country' && result.search_res_name !== null) && (
                        <div className="row sites-card mb-1">
                            <div className="col-12 text-left mb-1" style={{backgroundColor: "lavender"}}>
                                <h2 className="sectionTitle" style={{marginTop: "5px", marginLeft: "10px"}}>
                                    Countries ({searchResults.filter(r => r.search_group === 'country').length})
                                </h2>
                            </div>
                            
                            {searchResults.map((result, index) => {
                                if (result.search_group === 'country' && result.search_res_name !== null) {
                                    return (
                                        <div key={`country-${result.search_res_id || index}`} className="col-lg-4 col-md-6 col-6 mb-3 fixturesTextSize">
                                            <a 
                                                href={encodeURI("/country/football-predictions-for-" + result.search_res_name.toLowerCase() + "/fixtures")}
                                                className="ml-2 aTxt"
                                                title={`Football predictions for ${result.search_res_name}`}
                                            >
                                                <div className="responsive-row" style={{border: "none"}}>                                    
                                                    <div className="col-9">                                
                                                        {result.search_res_name}
                                                    </div>
                                                    <div className="col-3"></div>                                   
                                                </div>                   
                                            </a>
                                        </div>
                                    );
                                }
                                return null;
                            })}
                        </div>
                    )}

                    {/* Leagues Section */}
                    {searchResults.some((result) => result.search_group === 'league' && result.search_res_name !== null) && (
                        <div className="row sites-card mb-2">
                            <div className="col-12 text-left mb-2" style={{backgroundColor: "lavender"}}>
                                <h2 className="sectionTitle" style={{marginTop: "10px", marginLeft: "10px"}}>
                                    Leagues ({searchResults.filter(r => r.search_group === 'league').length})
                                </h2>
                            </div>
                            
                            {searchResults.map((result) => {
                                if (result.search_group === 'league' && result.search_res_name !== null) {
                                    const leagueSlug = result.search_res_name.toLowerCase().replace(/\s+/g, '-');
                                    return (
                                        <div key={`league-${result.search_res_id}`} className="col-lg-4 col-md-6 col-6 mb-3 fixturesTextSize">
                                            <a
                                                href={`/league/football-predictions-for-${result.search_country.toLowerCase()}/${leagueSlug}-${result.search_res_id}/fixtures`}
                                                className="ml-2 aTxt"
                                                title={`Football predictions for ${result.search_res_name}`}
                                            >
                                                <div className="responsive-row" style={{border: "none"}}>                                    
                                                    <div className="col-9">                                
                                                        {result.search_res_name} 
                                                    </div>
                                                    <div className="col-3" style={{color: "indianred"}}>     
                                                        {result.search_country}                       
                                                    </div>                                   
                                                </div> 
                                            </a>
                                        </div>
                                    );
                                }
                                return null;
                            })}
                        </div>
                    )}

                    {/* Teams Section */}
                    {searchResults.some((result) => result.search_group === 'team' && result.search_res_name !== null) && (
                        <div className="row sites-card mb-2">
                            <div className="col-12 text-left mb-2" style={{backgroundColor: "lavender"}}>
                                <h2 className="sectionTitle" style={{marginTop: "10px", marginLeft: "10px"}}>
                                    Teams ({searchResults.filter(r => r.search_group === 'team').length})
                                </h2>
                            </div>
                            
                            {searchResults.map((result) => {
                                if (result.search_group === 'team' && result.search_res_name !== null) {
                                    const teamSlug = result.search_res_name.toLowerCase().replace(/\s+/g, '-');
                                    return (
                                        <div key={`team-${result.search_res_id}`} className="col-lg-4 col-md-6 col-6 mb-3 fixturesTextSize">
                                            <a 
                                                href={`/team/${teamSlug}-${result.search_res_id}/results`}
                                                className="ml-2 aTxt"
                                                title={`Football predictions for ${result.search_res_name}`}
                                            >
                                                <div className="responsive-row" style={{border: "none"}}>                                    
                                                    <div className="col-9">                                
                                                        {result.search_res_name}
                                                    </div>
                                                    <div className="col-3"></div>                                   
                                                </div>
                                            </a>
                                        </div>
                                    );
                                }
                                return null;
                            })}
                        </div>
                    )}

                    {/* Fixtures Section */}
                    {searchResults.some((result) => result.search_group === 'fixture' && result.search_res_name !== null) && (
                        <div className="row sites-card mb-2">
                            <div className="col-12 text-left mb-2" style={{backgroundColor: "lavender"}}>
                                <h2 className="sectionTitle" style={{marginTop: "10px", marginLeft: "10px"}}>
                                    Fixtures ({searchResults.filter(r => r.search_group === 'fixture').length})
                                </h2>
                            </div>
                            
                            {searchResults.map((result) => {
                                if (result.search_group === 'fixture' && result.search_res_name !== null) {
                                    const teams = result.search_res_name.split(' VS ');
                                    if (teams.length === 2) {
                                        const homeTeam = teams[0].replace(/\s+/g, '-').toLowerCase();
                                        const awayTeam = teams[1].replace(/\s+/g, '-').toLowerCase();
                                        const fixtureSlug = `${homeTeam}-vs-${awayTeam}-${result.search_res_id}`;
                                        
                                        return (
                                            <div key={`fixture-${result.search_res_id}`} className="col-lg-4 col-md-6 col-sm-6 mb-3 fixturesTextSize">
                                                <a 
                                                    href={`/match/football-predictions-${fixtureSlug}/matches`}
                                                    className="ml-2 aTxt"
                                                    title={`Match preview: ${result.search_res_name}`}
                                                >
                                                    <div className="responsive-row" style={{border: "none"}}>                                    
                                                        <div className="col-9" style={{whiteSpace: "pre-wrap"}}>                                
                                                            {result.search_res_name} 
                                                        </div>
                                                        <div className="col-3" style={{color: "indianred"}}>     
                                                            {result.search_res_date}                       
                                                        </div>                                   
                                                    </div> 
                                                </a>
                                            </div>
                                        );
                                    }
                                }
                                return null;
                            })}
                        </div>
                    )}

                    {/* Ad Section */}
                    <br/>
                    <Adsense
                        client="ca-pub-5665711413000284"
                        slot="3850951453"
                        style={{ display: "block" }}
                        layout="display"
                        format="auto"
                    />
                </div>
            </>
        );
    }

    // Default state when no search query
    return (
        <>
            <Head>
                <title>Search Football Predictions | Find Countries, Leagues, Teams & Fixtures | PitchPredictions</title>
                <meta name="description" content="Search for countries, leagues, teams, and fixtures to get football predictions and expert analysis. Find matches, view statistics, and access betting tips." />
            </Head>
            
            <div className="container sites-card">
                <div className="text-center p-5">
                    <h3>Search Football Predictions</h3>
                    <p>Enter a search term to find countries, leagues, teams, or fixtures.</p>
                </div>
            </div>
        </>
    );
}

export async function getServerSideProps({ query }) {
    const searchQuery = query.query || '';
    
    // Don't search if query is too short
    if (!searchQuery || searchQuery.length < 3) {
        return {
            props: {
                initialSearchResults: [],
                searchQuery: searchQuery,
                error: null
            }
        };
    }

    try {
        // You'll need to create this API endpoint or import the search function
        // This is a placeholder - adjust based on your actual API structure
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(`https://api.pitchpredictions.com/api/search?q=${encodeURIComponent(searchQuery)}`, {
            headers: { 
                "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2"
            },
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        return {
            props: {
                initialSearchResults: data.data || [],
                searchQuery: searchQuery,
                error: null
            }
        };
    } catch (error) {
        console.error('Error fetching search results:', error);
        
        return {
            props: {
                initialSearchResults: [],
                searchQuery: searchQuery,
                error: error.message
            }
        };
    }
}

export default SearchResults;