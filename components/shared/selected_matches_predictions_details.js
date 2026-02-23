import { useRouter } from 'next/router';
import { useEffect, useState, useMemo } from "react";
import DetermineLiveScores from "../functions/determine_live_scores";
import WinningTeamAndOdd from "../functions/determine_winning_team_and_odd";
import ProbabilityResults from "../functions/determine_probability_results";
import FixturesTableDisplay from "./fixtures_table_display";
import ComputeFixtureAverage from "../functions/ComputefixtureAverage";

function SelectedMacthesPredDetails({ props: gameDetails }) {
    const [isMobile, setIsMobile] = useState(false);
    const router = useRouter();

    // Handle mobile detection
    useEffect(() => {
        if (!router.isReady) return;

        const detectMobile = () => {
            setIsMobile(window.innerWidth < 760);
        };

        detectMobile();
        window.addEventListener('resize', detectMobile);
        
        return () => window.removeEventListener('resize', detectMobile);
    }, [router.isReady]);

    // Process all match data using useMemo for performance
    const predictionsList = useMemo(() => {
        if (!gameDetails?.length) return [];

        return gameDetails.map((game, index) => {
            // Parse scores data safely
            let scores_data = {};
            let halftime_data = "";
            let extratime_data = "";
            let penalty_data = "";

            try {
                scores_data = game.scores ? JSON.parse(game.scores) : {};
                
                if (scores_data?.halftime?.home != null) {
                    halftime_data = `(${scores_data.halftime.home} - ${scores_data.halftime.away})`;
                }

                if (scores_data?.extratime?.home != null) {
                    extratime_data = `${scores_data.extratime.home} - ${scores_data.extratime.away}`;
                }

                if (scores_data?.penalty?.home != null) {
                    penalty_data = `${scores_data.penalty.home} - ${scores_data.penalty.away}`;
                }
            } catch (e) {
                console.error('Error parsing scores data:', e);
            }

            // Process prediction percentages
            let home_odd = "", draw_odd = "", away_odd = "";
            
            if (game.percent_pred_home) {
                home_odd = game.percent_pred_home.slice(0, -1);
                draw_odd = game.percent_pred_draw?.slice(0, -1) || "";
                away_odd = game.percent_pred_away?.slice(0, -1) || "";
            }

            // Compute winning team and odds
            const [winning_team, winning_odd] = WinningTeamAndOdd(
                home_odd, 
                draw_odd, 
                away_odd, 
                game
            );

            // Compute probability results
            const probability_results = ProbabilityResults(game, winning_team);

            // Get live scores
            const [livestatus, livescores] = DetermineLiveScores(game, isMobile);

            // Compute fixture averages
            const fixturesAverage = ComputeFixtureAverage(
                game.teams_perfomance_home_for,
                game.teams_perfomance_home_aganist,
                game.teams_perfomance_away_for,
                game.teams_perfomance_away_aganist,
                game.teams_games_played_home,
                game.teams_games_played_away
            );

            // Prepare data for FixturesTableDisplay
            const sharedTabledetailsArray = [{
                game_details: game,
                home_odd,
                draw_odd,
                away_odd,
                probability_results,
                winning_odd,
                winning_team,
                livestatus,
                livescores,
                halftime_data,
                extratime_data,
                penalty_data,
                average: fixturesAverage
            }];

            return (
                <FixturesTableDisplay 
                    key={game.fixture_id || index}
                    props={sharedTabledetailsArray}
                    isMobile={isMobile}
                />
            );
        });
    }, [gameDetails, isMobile]); // Re-run when gameDetails or isMobile changes

    return predictionsList;
}

export default SelectedMacthesPredDetails;