import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import WinningTeamAndOdd from '../functions/determine_winning_team_and_odd';
import ProbabilityResults from '../functions/determine_probability_results';
import DetermineLiveScores from '../functions/determine_live_scores';
import ComputeFixtureAverage from '../functions/ComputefixtureAverage';
import FixturesTableDisplay from '../shared/fixtures_table_display';
import CountrysPageRenders from '../shared/renders/country-renders';
import { Adsense } from '@ctrl/react-adsense';

function TodaysFixturesByCountry(props) {
    const router = useRouter();
    var predictionsList = [];

    for (let i = 0; i < props.todays_matches.length; i++) {
        let winning_team = "";
        let winning_odd = 0;

        let home_odd = "";
        let draw_odd = "";
        let away_odd = "";

        if (props.todays_matches[i].percent_pred_home != null) {
            home_odd = props.todays_matches[i]["percent_pred_home"].slice(0, -1);
            draw_odd = props.todays_matches[i]["percent_pred_draw"].slice(0, -1);
            away_odd = props.todays_matches[i]["percent_pred_away"].slice(0, -1);
        }

        // Decode halftime data stored as a json in mysql
        var scores_data = JSON.parse(props.todays_matches[i].scores);

        var halftime_data = "";
        var extratime_data = "";
        var penalty_data = "";

        if (props.todays_matches[i].scores != null) {
            if (scores_data.halftime.home != null) {
                halftime_data = '(' + scores_data.halftime.home + ' - ' + scores_data.halftime.away + ')';
            }

            if (scores_data.extratime.home != null) {
                extratime_data = scores_data.extratime.home + ' - ' + scores_data.extratime.away;
            }

            if (scores_data.penalty.home != null) {
                penalty_data = scores_data.penalty.home + ' - ' + scores_data.penalty.away;
            }
        }

        let computed_winning_preds = WinningTeamAndOdd(home_odd, draw_odd, away_odd, props.todays_matches[i]);

        winning_team = computed_winning_preds[0];
        winning_odd = computed_winning_preds[1];

        let probability_results = ProbabilityResults(props.todays_matches[i], winning_team);

        // isMobile parameter removed - now handled by CSS in DetermineLiveScores
        let livescores_results = DetermineLiveScores(props.todays_matches[i]);

        let livestatus = livescores_results[0];
        let livescores = livescores_results[1];

        let fixturesAverage = ComputeFixtureAverage(
            props.todays_matches[i].teams_perfomance_home_for,
            props.todays_matches[i].teams_perfomance_home_aganist,
            props.todays_matches[i].teams_perfomance_away_for,
            props.todays_matches[i].teams_perfomance_away_aganist,
            props.todays_matches[i].teams_games_played_home,
            props.todays_matches[i].teams_games_played_away
        );

        var sharedTabledetailsArray = [];

        sharedTabledetailsArray.push({
            game_details: props.todays_matches[i],
            home_odd: home_odd,
            draw_odd: draw_odd,
            away_odd: away_odd,
            probability_results: probability_results,
            winning_odd: winning_odd,
            winning_team: winning_team,
            livestatus: livestatus,
            livescores: livescores,
            halftime_data: halftime_data,
            extratime_data: extratime_data,
            penalty_data: penalty_data,
            average: fixturesAverage
        });

        // Form the array of Fixtures Table by country
        predictionsList.push(
            <FixturesTableDisplay props={sharedTabledetailsArray} key={i} />
        );
    }

    if (predictionsList.length > 0) {
        return (
            <React.Fragment>
                <div className="sites-card mb-2">
                    <div className="desktop-container-resize mb-1">
                        <div className="col-sm-12 text-center bg-light pt-1">
                            <h2 className="sectionTitle">Today's Fixtures - {props.country_name}</h2>
                        </div>
                    </div>
                    <CountrysPageRenders 
                        url_name={router.pathname.substring(1)} 
                        renderPredictions={predictionsList} 
                    />
                    <br />
                    <div className="desktop-container-resize mb-1">
                        <div className="col-sm-12 text-center bg-light pt-1">
                            <Adsense
                                client="ca-pub-5665711413000284"
                                slot="7624930534"
                                style={{ display: "block" }}
                                layout="display"
                                format="auto"
                            />
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    } else {
        return <></>;
    }
}

export default TodaysFixturesByCountry;