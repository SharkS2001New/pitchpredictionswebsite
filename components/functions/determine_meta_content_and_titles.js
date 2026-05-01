import { useRouter } from 'next/router';

function MetaContent(){
    let title = "";
    let meta_desc_content ="";
    let meta_keywords = "";
    let page_title= "";
    let image_url = "";
    let image_alt = "";

    var meta_content_array = [];

    const router = useRouter();

    var current_url = router.pathname.substring(1);
    
    //url value being passed on page each page load
    if(current_url == "football-predictions-today"){

        title ="Today's Football Predictions – Free Tips & Stats";
        meta_desc_content = "Free football predictions for today's matches. Expert 1X2, BTTS, Over/Under & correct score tips with stats across the Premier League, La Liga, Serie-A & 700+ leagues.";
        meta_keywords = "Today football prediction, soccer predictions today, soccer predictions for today , predictions for today matches, football tips today, today matches predictions, today soccer predictions, today soccer predictions, football predictions today, football today matches, football predictions for today";
        page_title = "Today's Football Predictions – Free Tips & Stats";

        meta_content_array.push(title,meta_desc_content,meta_keywords,page_title);

    } else if(current_url == "football-predictions-today/double-chance-predictions") {

        title = "Double Chance Football Predictions & Match Insights | Pitch Predictions";
        meta_desc_content = "Get expert Double Chance football predictions backed by stats. Make informed betting decisions with accurate insights from Pitch Predictions.";
        meta_keywords = "double chance predictions, football tips, soccer betting insights, match stats, football predictions";
        page_title = "Double Chance Predictions - Today";

        meta_content_array.push(title, meta_desc_content, meta_keywords, page_title);
    
    } else if(current_url == "football-predictions-today/predictions-halftime-fulltime"){

        title ="Half Time/Full Time Predictions, Soccer Tips and Match Stats: Today.";
        meta_desc_content = "Pitch Predictions offers statistics-based Today’s Football Predictions. Why wait? Join us now and make informed decisions on today's matches.";
        meta_keywords = "Today football prediction, soccer predictions today, soccer predictions for today , predictions for today matches, football tips today, today matches predictions, today soccer predictions, today soccer predictions, football predictions today, football today matches, football predictions for today";
        page_title = "Half Time/Full Time Predictions - Today";

        meta_content_array.push(title,meta_desc_content,meta_keywords,page_title);

    } else if(current_url == "football-predictions-today/predictions-under-over"){

        title ="Under/Over 2.5 Goals Predictions, Soccer Tips and Match Stats: Today.";
        meta_desc_content = "Pitch Predictions offers statistics-based Today’s Football Predictions. Why wait? Join us now and make informed decisions on today's matches.";
        meta_keywords = "Today football prediction, soccer predictions today, soccer predictions for today , predictions for today matches, football tips today, today matches predictions, today soccer predictions, today soccer predictions, football predictions today, football today matches, football predictions for today";
        page_title = "Under/Over 2.5 Goals Predictions - Today";

        meta_content_array.push(title,meta_desc_content,meta_keywords,page_title);

    }else if(current_url == "football-predictions-today/predictions-both-to-score"){

        title ="Both to score Predictions, Soccer Tips and Match Stats: Today.";
        meta_desc_content = "Pitch Predictions offers statistics-based Today’s Football Predictions. Why wait? Join us now and make informed decisions on today's matches.";
        meta_keywords = "Today football prediction, soccer predictions today, soccer predictions for today , predictions for today matches, football tips today, today matches predictions, today soccer predictions, today soccer predictions, football predictions today, football today matches, football predictions for today";
        page_title = "Both to score Predictions - Today";

        meta_content_array.push(title,meta_desc_content,meta_keywords,page_title);
    
    } else if(current_url == "live-football-predictions"){

        title = "LiveScore | Today's Football Predictions, Live Scores & Stats";  
        meta_desc_content = "Get real-time livescores, today's best football predictions, and match stats. Follow live soccer scores, results, and expert tips for all fixtures.";  
        meta_keywords = "livescores, livescore prediction, livescore prediction today, livescore prediction tips, today livescore prediction, livescores today, soccer livescores, live football prediction, livescore results";  
        page_title = "Live Football Scores and Predictions";  

        meta_content_array.push(title,meta_desc_content,meta_keywords,page_title);
    } else if(current_url == "live-football-predictions/double-chance-predictions"){

        title ="Double Chance Predictions, Soccer Tips and Match Stats: Live.";
        meta_desc_content = "Get Real-Time Livescores for Football and Soccer Matches With Free Live Score Predictions. Get Accurate Football Livescore Results, Stats for All Fixtures.";
        meta_keywords = "livescore, livescores, football livescore, live score soccer, live score today, livescore results, live football prediction, free livescore, livescore results today,live scores prediction";
        page_title = "Double Chance Predictions - Today";

        meta_content_array.push(title,meta_desc_content,meta_keywords,page_title);
    } else if(current_url == "live-football-predictions/predictions-halftime-fulltime"){

        title ="Half Time/Full Time Predictions, Soccer Tips and Match Stats: Live.";
        meta_desc_content = "Get Real-Time Livescores for Football and Soccer Matches With Free Live Score Predictions. Get Accurate Football Livescore Results, Stats for All Fixtures.";
        meta_keywords = "livescore, livescores, football livescore, live score soccer, live score today, livescore results, live football prediction, free livescore, livescore results today, live score prediction today, live scores prediction";
        page_title = "Half Time/Full Time Predictions - Today";

        meta_content_array.push(title,meta_desc_content,meta_keywords,page_title);

    } else if(current_url == "live-football-predictions/predictions-under-over"){

        title ="Under/Over 2.5 Goals Predictions, Soccer Tips and Match Stats: Live.";
        meta_desc_content = "Get Real-Time Livescores for Football and Soccer Matches With Free Live Score Predictions. Get Accurate Football Livescore Results, Stats for All Fixtures.";
        meta_keywords = "livescore, livescores, football livescore, live score soccer, live score today, livescore results, live football prediction, free livescore, livescore results today, live score prediction today, live scores prediction";
        page_title = "Under/Over 2.5 Goals Predictions - Today";

        meta_content_array.push(title,meta_desc_content,meta_keywords,page_title);

    }else if(current_url == "live-football-predictions/predictions-both-to-score"){

        title ="Both to score Predictions, Soccer Tips and Match Stats: Live.";
        meta_desc_content = "Get Real-Time Livescores for Football and Soccer Matches With Free Live Score Predictions. Get Accurate Football Livescore Results, Stats for All Fixtures.";
        meta_keywords = "livescore, livescores, football livescore, live score soccer, live score today, livescore results, live football prediction, free livescore, livescore results today, live score prediction today, live scores prediction";
        page_title = "Both to score Predictions - Today";

        meta_content_array.push(title,meta_desc_content,meta_keywords,page_title);
    
    } else if(current_url == "upcoming-football-predictions"){//Not done

        title = "Top Football Predictions Today | Expert Betting Tips & Match Previews";  
        meta_desc_content = "Get today's best football predictions, expert betting tips, and in-depth match previews with live stats. Discover winning picks for top leagues and matches.";  
        meta_keywords = "top football tips, top football predictions today, best soccer predictions, expert betting tips, premier league predictions, match previews, live football tips, today's football predictions, winning football picks, upcoming match predictions";  
        page_title = "Top Football Predictions Today | Expert Betting Tips";  

        meta_content_array.push(title,meta_desc_content,meta_keywords,page_title);

    } else if(current_url == "upcoming-football-predictions/double-chance-predictions"){

        title ="Double Chance Predictions, Soccer Tips and Match Stats: Upcoming.";
        meta_desc_content = "For Free upcoming football matches predictions for today, tips and stats with full match previews, stats, analyses, and live scores predictions";
        meta_keywords = "Upcoming soccer prediction, Upcoming soccer predictions this week, Upcoming premier league predictions, Upcoming football matches, Upcoming matches predictions, upcoming predictions,upcoming football predictions,upcoming football matches predictions,free upcoming football predictions,upcoming matches predictions today";
        page_title = "Double Chance Predictions - Upcoming";

        meta_content_array.push(title,meta_desc_content,meta_keywords,page_title);
    } else if(current_url == "upcoming-football-predictions/predictions-halftime-fulltime"){

        title ="Half Time/Full Time Predictions, Soccer Tips and Match Stats: Upcoming.";
        meta_desc_content = "For Free upcoming football matches predictions for today, tips and stats with full match previews, stats, analyses, and live scores predictions";
        meta_keywords = "Upcoming soccer prediction, Upcoming soccer predictions this week, Upcoming premier league predictions, Upcoming football matches, Upcoming matches predictions, upcoming predictions,upcoming football predictions,upcoming football matches predictions,free upcoming football predictions,upcoming matches predictions today";
        page_title = "Half Time/Full Time Predictions - Upcoming";

        meta_content_array.push(title,meta_desc_content,meta_keywords,page_title);

    } else if(current_url == "upcoming-football-predictions/predictions-under-over"){

        title ="Under/Over 2.5 Goals Predictions, Soccer Tips and Match Stats: Upcoming.";
        meta_desc_content = "For Free upcoming football matches predictions for today, tips and stats with full match previews, stats, analyses, and live scores predictions";
        meta_keywords = "Upcoming soccer prediction, Upcoming soccer predictions this week, Upcoming premier league predictions, Upcoming football matches, Upcoming matches predictions, upcoming predictions,upcoming football predictions,upcoming football matches predictions,free upcoming football predictions,upcoming matches predictions today";
        page_title = "Under/Over 2.5 Goals Predictions - Upcoming";

        meta_content_array.push(title,meta_desc_content,meta_keywords,page_title);

    } else if(current_url == "upcoming-football-predictions/predictions-both-to-score"){

        title ="Both to score Predictions, Soccer Tips and Match Stats: Upcoming.";
        meta_desc_content = "For Free upcoming football matches predictions for today, tips and stats with full match previews, stats, analyses, and live scores predictions";
        meta_keywords = "Upcoming soccer prediction, Upcoming soccer predictions this week, Upcoming premier league predictions, Upcoming football matches, Upcoming matches predictions, upcoming predictions,upcoming football predictions,upcoming football matches predictions,free upcoming football predictions,upcoming matches predictions today";
        page_title = "Both to score Predictions - Upcoming";

        meta_content_array.push(title,meta_desc_content,meta_keywords,page_title);
    
    } else if(current_url == "top-football-tips-and-predictions/today"){//Not done

        title ="Top football tips and predictions today | Our best picks";
        meta_desc_content = "Get Free top football predictions for today, tips and stats with full match previews, stats, analyses, and live scores predictions";
        meta_keywords = "top football tips, top soccer predictions this week, top premier league predictions, top football matches, top matches predictions, upcoming predictions,upcoming football predictions,upcoming football matches predictions,free upcoming football predictions,upcoming matches predictions today";
        page_title = "Top football tips and Predictions for today | Our best picks";

        meta_content_array.push(title,meta_desc_content,meta_keywords,page_title);

    } else if(current_url == "top-football-tips-and-predictions/today/double-chance-predictions"){

        title ="Double Chance Top football tips and predictions today | Our best picks";
        meta_desc_content = "Get Free top football predictions for today, tips and stats with full match previews, stats, analyses, and live scores predictions";
        meta_keywords = "top football tips, top soccer predictions this week, top premier league predictions, top football matches, top matches predictions, upcoming predictions,upcoming football predictions,upcoming football matches predictions,free upcoming football predictions,upcoming matches predictions today";
        page_title = "Double Chance Top Predictions for today | Our best picks";

        meta_content_array.push(title,meta_desc_content,meta_keywords,page_title);
    } else if(current_url == "top-football-tips-and-predictions/today/predictions-halftime-fulltime"){

        title ="Half Time/Full Time Top football tips and predictions today | Our best picks";
        meta_desc_content = "Get Free top football predictions for today, tips and stats with full match previews, stats, analyses, and live scores predictions";
        meta_keywords = "top football tips, top soccer predictions this week, top premier league predictions, top football matches, top matches predictions, upcoming predictions,upcoming football predictions,upcoming football matches predictions,free upcoming football predictions,upcoming matches predictions today";
        page_title = "Half Time/Full Time Top Predictions for today | Our best picks";

        meta_content_array.push(title,meta_desc_content,meta_keywords,page_title);

    } else if(current_url == "top-football-tips-and-predictions/today/predictions-under-over"){

        title ="Under/Over 2.5 Top football tips and predictions today | Our best picks";
        meta_desc_content = "Get Free top football predictions for today, tips and stats with full match previews, stats, analyses, and live scores predictions";
        meta_keywords = "top football tips, top soccer predictions this week, top premier league predictions, top football matches, top matches predictions, upcoming predictions,upcoming football predictions,upcoming football matches predictions,free upcoming football predictions,upcoming matches predictions today";
        page_title = "Under/Over 2.5 Top Predictions for today | Our best picks";

        meta_content_array.push(title,meta_desc_content,meta_keywords,page_title);

    } else if(current_url == "top-football-tips-and-predictions/today/predictions-both-to-score"){

        title ="Both to score Top football tips and predictions today | Our best picks";
        meta_desc_content = "Get Free top football predictions for today, tips and stats with full match previews, stats, analyses, and live scores predictions";
        meta_keywords = "top football tips, top soccer predictions this week, top premier league predictions, top football matches, top matches predictions, upcoming predictions,upcoming football predictions,upcoming football matches predictions,free upcoming football predictions,upcoming matches predictions today";
        page_title = "Both to score Top Predictions for today | Our best picks";

        meta_content_array.push(title,meta_desc_content,meta_keywords,page_title);    
    
    } else if(current_url == "top-football-tips-and-predictions/tomorrow"){//Not done

        title ="Top football tips and predictions tomorrow | Our best picks";
        meta_desc_content = "Get Free top football predictions for today, tips and stats with full match previews, stats, analyses, and live scores predictions";
        meta_keywords = "top football tips, top soccer predictions this week, top premier league predictions, top football matches, top matches predictions, upcoming predictions,upcoming football predictions,upcoming football matches predictions,free upcoming football predictions,upcoming matches predictions today";
        page_title = "Top football tips and Predictions for tomorrow | Our best picks";

        meta_content_array.push(title,meta_desc_content,meta_keywords,page_title);

    } else if(current_url == "top-football-tips-and-predictions/tomorrow/double-chance-predictions"){

        title ="Double Chance Top football tips and predictions tomorrow | Our best picks";
        meta_desc_content = "Get Free top football predictions for tomorrow, tips and stats with full match previews, stats, analyses, and live scores predictions";
        meta_keywords = "top football tips, top soccer predictions this week, top premier league predictions, top football matches, top matches predictions, upcoming predictions,upcoming football predictions,upcoming football matches predictions,free upcoming football predictions,upcoming matches predictions today";
        page_title = "Double Chance Top Predictions for tomorrow | Our best picks";

        meta_content_array.push(title,meta_desc_content,meta_keywords,page_title);
    } else if(current_url == "top-football-tips-and-predictions/tomorrow/predictions-halftime-fulltime"){

        title ="Half Time/Full Time Top football tips and predictions tomorrow | Our best picks";
        meta_desc_content = "Get Free top football predictions for tomorrow, tips and stats with full match previews, stats, analyses, and live scores predictions";
        meta_keywords = "top football tips, top soccer predictions this week, top premier league predictions, top football matches, top matches predictions, upcoming predictions,upcoming football predictions,upcoming football matches predictions,free upcoming football predictions,upcoming matches predictions today";
        page_title = "Half Time/Full Time Top Predictions for tomorrow | Our best picks";

        meta_content_array.push(title,meta_desc_content,meta_keywords,page_title);

    } else if(current_url == "top-football-tips-and-predictions/tomorrow/predictions-under-over"){

        title ="Under/Over 2.5 Top football tips and predictions tomorrow | Our best picks";
        meta_desc_content = "Get Free top football predictions for tomorrow, tips and stats with full match previews, stats, analyses, and live scores predictions";
        meta_keywords = "top football tips, top soccer predictions this week, top premier league predictions, top football matches, top matches predictions, upcoming predictions,upcoming football predictions,upcoming football matches predictions,free upcoming football predictions,upcoming matches predictions today";
        page_title = "Under/Over 2.5 Top Predictions for tomorrow | Our best picks";

        meta_content_array.push(title,meta_desc_content,meta_keywords,page_title);

    } else if(current_url == "top-football-tips-and-predictions/tomorrow/predictions-both-to-score"){

        title ="Both to score Top football tips and predictions tomorrow | Our best picks";
        meta_desc_content = "Get Free top football predictions for tomorrow, tips and stats with full match previews, stats, analyses, and live scores predictions";
        meta_keywords = "top football tips, top soccer predictions this week, top premier league predictions, top football matches, top matches predictions, upcoming predictions,upcoming football predictions,upcoming football matches predictions,free upcoming football predictions,upcoming matches predictions today";
        page_title = "Both to score Top Predictions for tomorrow | Our best picks";

        meta_content_array.push(title,meta_desc_content,meta_keywords,page_title);    
    
    } else if(current_url == "top-football-tips-and-predictions/yesterday"){//Not done

        title ="Top football tips and predictions yesterday | Our best picks";
        meta_desc_content = "Get Free top football predictions for today, tips and stats with full match previews, stats, analyses, and live scores predictions";
        meta_keywords = "top football tips, top soccer predictions this week, top premier league predictions, top football matches, top matches predictions, upcoming predictions,upcoming football predictions,upcoming football matches predictions,free upcoming football predictions,upcoming matches predictions today";
        page_title = "Top football tips and Predictions for yesterday | Our best picks";

        meta_content_array.push(title,meta_desc_content,meta_keywords,page_title);

    } else if(current_url == "top-football-tips-and-predictions/yesterday/double-chance-predictions"){

        title ="Double Chance Top football tips and predictions yesterday | Our best picks";
        meta_desc_content = "Get Free top football predictions for yesterday, tips and stats with full match previews, stats, analyses, and live scores predictions";
        meta_keywords = "top football tips, top soccer predictions this week, top premier league predictions, top football matches, top matches predictions, upcoming predictions,upcoming football predictions,upcoming football matches predictions,free upcoming football predictions,upcoming matches predictions today";
        page_title = "Double Chance Top Predictions for yesterday | Our best picks";

        meta_content_array.push(title,meta_desc_content,meta_keywords,page_title);
    } else if(current_url == "top-football-tips-and-predictions/yesterday/predictions-halftime-fulltime"){

        title ="Half Time/Full Time Top Predictions yesterday | Our best picks";
        meta_desc_content = "Get Free top football predictions for yesterday, tips and stats with full match previews, stats, analyses, and live scores predictions";
        meta_keywords = "top football tips, top soccer predictions this week, top premier league predictions, top football matches, top matches predictions, upcoming predictions,upcoming football predictions,upcoming football matches predictions,free upcoming football predictions,upcoming matches predictions today";
        page_title = "Half Time/Full Time Top Predictions for yesterday | Our best picks";

        meta_content_array.push(title,meta_desc_content,meta_keywords,page_title);

    } else if(current_url == "top-football-tips-and-predictions/yesterday/predictions-under-over"){

        title ="Under/Over 2.5 Top Predictions yesterday | Our best picks";
        meta_desc_content = "Get Free top football predictions for yesterday, tips and stats with full match previews, stats, analyses, and live scores predictions";
        meta_keywords = "top football tips, top soccer predictions this week, top premier league predictions, top football matches, top matches predictions, upcoming predictions,upcoming football predictions,upcoming football matches predictions,free upcoming football predictions,upcoming matches predictions today";
        page_title = "Under/Over 2.5 Top Predictions for yesterday | Our best picks";

        meta_content_array.push(title,meta_desc_content,meta_keywords,page_title);

    } else if(current_url == "top-football-tips-and-predictions/yesterday/predictions-both-to-score"){

        title ="Both to score Top football tips and predictions yesterday | Our best picks";
        meta_desc_content = "Get Free top football predictions for yesterday, tips and stats with full match previews, stats, analyses, and live scores predictions";
        meta_keywords = "top football tips, top soccer predictions this week, top premier league predictions, top football matches, top matches predictions, upcoming predictions,upcoming football predictions,upcoming football matches predictions,free upcoming football predictions,upcoming matches predictions today";
        page_title = "Both to score Top Predictions for yesterday | Our best picks";

        meta_content_array.push(title,meta_desc_content,meta_keywords,page_title);    

    } else if(current_url == "football-predictions-yesterday"){

        title ="Yesterday Football Predictions, Fixture, Scores and Results";
        meta_desc_content = "Yesterday's football predictions, Tips, Match Previews, Head to Head (H2H), Team Comparison and Standings, Fixtures, Scores, Results and Match Statistics.";
        meta_keywords = "yesterday football predictions,football predictions yesterday, yesterday soccer predictions, yesterday matches predictions, yesterday games predictions, yesterday football results, yesterday predictions, correct score, correct score yesterday";
        page_title = "Yesterday Football Predictions and Results";

        meta_content_array.push(title,meta_desc_content,meta_keywords,page_title);
    } else if(current_url == "football-predictions-yesterday/double-chance-predictions"){

        title ="Double Chance Predictions, Soccer Tips and Match Stats: Yesterday.";
        meta_desc_content = "Yesterday's football predictions, Tips, Match Previews, Head to Head (H2H), Team Comparison and Standings, Fixtures, Scores, Results and Match Statistics.";
        meta_keywords = "yesterday football predictions,football predictions yesterday, yesterday soccer predictions, yesterday matches predictions, yesterday games predictions, yesterday football results, yesterday predictions, correct score, correct score yesterday";
        page_title = "Double Chance Predictions - Yesterday";

        meta_content_array.push(title,meta_desc_content,meta_keywords,page_title);
    } else if(current_url == "football-predictions-yesterday/predictions-halftime-fulltime"){

        title ="Half Time/Full Time Predictions, Soccer Tips and Match Stats: Yesterday.";
        meta_desc_content = "Yesterday's football predictions, Tips, Match Previews, Head to Head (H2H), Team Comparison and Standings, Fixtures, Scores, Results and Match Statistics.";
        meta_keywords = "yesterday football predictions,football predictions yesterday, yesterday soccer predictions, yesterday matches predictions, yesterday games predictions, yesterday football results, yesterday predictions, correct score, correct score yesterday";
        page_title = "Half Time/Full Time Predictions - Yesterday";

        meta_content_array.push(title,meta_desc_content,meta_keywords,page_title);

    } else if(current_url == "football-predictions-yesterday/predictions-under-over"){

        title ="Under/Over 2.5 Goals Predictions, Soccer Tips and Match Stats: Yesterday.";
        meta_desc_content = "Yesterday's football predictions, Tips, Match Previews, Head to Head (H2H), Team Comparison and Standings, Fixtures, Scores, Results and Match Statistics.";
        meta_keywords = "yesterday football predictions,football predictions yesterday, yesterday soccer predictions, yesterday matches predictions, yesterday games predictions, yesterday football results, yesterday predictions, correct score, correct score yesterday";
        page_title = "Under/Over 2.5 Goals Predictions - Yesterday";

        meta_content_array.push(title,meta_desc_content,meta_keywords,page_title);

    } else if(current_url == "football-predictions-yesterday/predictions-both-to-score"){

        title ="Both to score Predictions, Soccer Tips and Match Stats: Yesterday.";
        meta_desc_content = "Yesterday's football predictions, Tips, Match Previews, Head to Head (H2H), Team Comparison and Standings, Fixtures, Scores, Results and Match Statistics.";
        meta_keywords = "yesterday football predictions,football predictions yesterday, yesterday soccer predictions, yesterday matches predictions, yesterday games predictions, yesterday football results, yesterday predictions, correct score, correct score yesterday";
        page_title = "Both to score Predictions - Yesterday";

        meta_content_array.push(title,meta_desc_content,meta_keywords,page_title);
    
    } else if(current_url == "football-predictions-tomorrow"){

        title ="Tomorrow Football Predictions, Match Fixtures and Statistics";
        meta_desc_content = "Football predictions for tomorrow are available on Pitch Predictions. We offer mathematically-analyzed data for tomorrow's matches";
        meta_keywords = "tomorrow prediction, tomorrow football predictions, tomorrow soccer prediction, tomorrow football matches, football fixtures tomorrow, tomorrow matches predictions, football tomorrow, correct score tomorrow";
        page_title = "Tomorrow Football Predictions and Tips";

        meta_content_array.push(title,meta_desc_content,meta_keywords,page_title);
    } else if(current_url == "football-predictions-tomorrow/double-chance-predictions"){

        title ="Double Chance Predictions, Soccer Tips and Match Stats: Tomorrow.";
        meta_desc_content = "Football predictions for tomorrow are available on Pitch Predictions. We offer mathematically-analyzed data for tomorrow's matches";
        meta_keywords = "tomorrow prediction, tomorrow football predictions, tomorrow soccer prediction, tomorrow football matches, football fixtures tomorrow, tomorrow matches predictions, football tomorrow, correct score tomorrow";
        page_title = "Double Chance Predictions - Tomorrow";

        meta_content_array.push(title,meta_desc_content,meta_keywords,page_title);
    } else if(current_url == "football-predictions-tomorrow/predictions-halftime-fulltime"){

        title ="Half Time/Full Time Predictions, Soccer Tips and Match Stats: Tomorrow.";
        meta_desc_content = "Football predictions for tomorrow are available on Pitch Predictions. We offer mathematically-analyzed data for tomorrow's matches";
        meta_keywords = "tomorrow prediction, tomorrow football predictions, tomorrow soccer prediction, tomorrow football matches, football fixtures tomorrow, tomorrow matches predictions, football tomorrow, correct score tomorrow";
        page_title = "Half Time/Full Time Predictions - Tomorrow";

        meta_content_array.push(title,meta_desc_content,meta_keywords,page_title);

    } else if(current_url == "football-predictions-tomorrow/predictions-under-over"){

        title ="Under/Over 2.5 Goals Predictions, Soccer Tips and Match Stats: Tomorrow.";
        meta_desc_content = "Football predictions for tomorrow are available on Pitch Predictions. We offer mathematically-analyzed data for tomorrow's matches";
        meta_keywords = "tomorrow prediction, tomorrow football predictions, tomorrow soccer prediction, tomorrow football matches, football fixtures tomorrow, tomorrow matches predictions, football tomorrow, correct score tomorrow";
        page_title = "Under/Over 2.5 Goals Predictions - Tomorrow";

        meta_content_array.push(title,meta_desc_content,meta_keywords,page_title);

    } else if(current_url == "football-predictions-tomorrow/predictions-both-to-score"){

        title ="Both to score Predictions, Soccer Tips and Match Stats: Tomorrow.";
        meta_desc_content = "Football predictions for tomorrow are available on Pitch Predictions. We offer mathematically-analyzed data for tomorrow's matches";
        meta_keywords = "tomorrow prediction, tomorrow football predictions, tomorrow soccer prediction, tomorrow football matches, football fixtures tomorrow, tomorrow matches predictions, football tomorrow, correct score tomorrow";
        page_title = "Both to score Predictions - Tomorrow";

        meta_content_array.push(title,meta_desc_content,meta_keywords,page_title);
    
    } else if(current_url == "football-predictions-weekend"){

        title ="Weekend Football Predictions – Free Tips for Saturday & Sunday | Pitch Predictions";
        meta_desc_content = "Free football predictions for this weekend's matches. Expert 1X2, BTTS, Over/Under &amp; correct score tips for Saturday & Sunday fixtures across 700+ leagues — updated weekly.";
        meta_keywords = "Football predictions for the weekend, weekend football predictions, weekend sure predictions, weekend football fixtures predictions, weekend soccer predictions, weekend prediction correct score, weekend football fixtures predictions, weekend football tips, football prediction weekend, premier league predictions this weekend";
        page_title = "Weekend Football Predictions – Free Tips for Saturday & Sunday";

        meta_content_array.push(title,meta_desc_content,meta_keywords,page_title);

    } else if(current_url == "football-predictions-weekend/double-chance-predictions"){

        title ="Double Chance Predictions, Soccer Tips and Match Stats: Weekend.";
        meta_desc_content = "Get free football predictions for the weekend on Pitch Predictions. The football tips are for all fixtures in over 1000 leagues.";
        meta_keywords = "Football predictions for the weekend, weekend football predictions, weekend sure predictions, weekend football fixtures predictions, weekend soccer predictions, weekend prediction correct score, weekend football fixtures predictions, weekend football tips, football prediction weekend, premier league predictions this weekend";
        page_title = "Double Chance Predictions - Weekend";

        meta_content_array.push(title,meta_desc_content,meta_keywords,page_title);
    } else if(current_url == "football-predictions-weekend/predictions-halftime-fulltime"){

        title ="Half Time/Full Time Predictions, Soccer Tips and Match Stats: Weekend.";
        meta_desc_content = "Get free football predictions for the weekend on Pitch Predictions. The football tips are for all fixtures in over 1000 leagues.";
        meta_keywords = "Football predictions for the weekend, weekend football predictions, weekend sure predictions, weekend football fixtures predictions, weekend soccer predictions, weekend prediction correct score, weekend football fixtures predictions, weekend football tips, football prediction weekend, premier league predictions this weekend";
        page_title = "Half Time/Full Time Predictions - Weekend";

        meta_content_array.push(title,meta_desc_content,meta_keywords,page_title);

    } else if(current_url == "football-predictions-weekend/predictions-under-over"){

        title ="Under/Over 2.5 Goals Predictions, Soccer Tips and Match Stats: Weekend.";
        meta_desc_content = "Get free football predictions for the weekend on Pitch Predictions. The football tips are for all fixtures in over 1000 leagues.";
        meta_keywords = "Football predictions for the weekend, weekend football predictions, weekend sure predictions, weekend football fixtures predictions, weekend soccer predictions, weekend prediction correct score, weekend football fixtures predictions, weekend football tips, football prediction weekend, premier league predictions this weekend";
        page_title = "Under/Over 2.5 Goals Predictions - Weekend";

        meta_content_array.push(title,meta_desc_content,meta_keywords,page_title);

    } else if(current_url == "football-predictions-weekend/predictions-both-to-score"){

        title ="Both to score Predictions, Soccer Tips and Match Stats: Weekend.";
        meta_desc_content = "Get free football predictions for the weekend on Pitch Predictions. The football tips are for all fixtures in over 1000 leagues.";
        meta_keywords = "Football predictions for the weekend, weekend football predictions, weekend sure predictions, weekend football fixtures predictions, weekend soccer predictions, weekend prediction correct score, weekend football fixtures predictions, weekend football tips, football prediction weekend, premier league predictions this weekend";
        page_title = "Both to score Predictions - Weekend";

        meta_content_array.push(title,meta_desc_content,meta_keywords,page_title);
    
    } else if(current_url == "football-predictions-today/finished"){

        title ="Today's Football Predictions, Soccer Tips and Match Stats.";
        meta_desc_content = "Pitch Predictions offers statistics-based Today’s Football Predictions. Why wait? Join us now and make informed decisions on today's matches.";
        meta_keywords = "Today football prediction, soccer predictions today, soccer predictions for today , predictions for today matches, football tips today, today matches predictions, today soccer predictions, today soccer predictions, football predictions today, football today matches, football predictions for today";
        page_title = "Today's Football Predictions and Tips (Finished Matches)";

        meta_content_array.push(title,meta_desc_content,meta_keywords,page_title);

    } else if(current_url == "football-predictions-today/finished/double-chance-predictions"){

        title ="Double Chance Predictions, Soccer Tips and Match Stats: Finished Matches.";
        meta_desc_content = "Pitch Predictions offers statistics-based Today’s Football Predictions. Why wait? Join us now and make informed decisions on today's matches.";
        meta_keywords = "Today football prediction, soccer predictions today, soccer predictions for today , predictions for today matches, football tips today, today matches predictions, today soccer predictions, today soccer predictions, football predictions today, football today matches, football predictions for today";
        page_title = "Double Chance Predictions - (Finished Matches)";

        meta_content_array.push(title,meta_desc_content,meta_keywords,page_title);
    } else if(current_url == "football-predictions-today/finished/predictions-halftime-fulltime"){

        title ="Half Time/Full Time Predictions, Soccer Tips and Match Stats: Finished Matches.";
        meta_desc_content = "Pitch Predictions offers statistics-based Today’s Football Predictions. Why wait? Join us now and make informed decisions on today's matches.";
        meta_keywords = "Today football prediction, soccer predictions today, soccer predictions for today , predictions for today matches, football tips today, today matches predictions, today soccer predictions, today soccer predictions, football predictions today, football today matches, football predictions for today";
        page_title = "Half Time/Full Time Predictions - (Finished Matches)";

        meta_content_array.push(title,meta_desc_content,meta_keywords,page_title);

    } else if(current_url == "football-predictions-today/finished/predictions-under-over"){

        title ="Under/Over 2.5 Goals Predictions, Soccer Tips and Match Stats: Finished Matches.";
        meta_desc_content = "Pitch Predictions offers statistics-based Today’s Football Predictions. Why wait? Join us now and make informed decisions on today's matches.";
        meta_keywords = "Today football prediction, soccer predictions today, soccer predictions for today , predictions for today matches, football tips today, today matches predictions, today soccer predictions, today soccer predictions, football predictions today, football today matches, football predictions for today";
        page_title = "Under/Over 2.5 Goals Predictions - (Finished Matches)";

        meta_content_array.push(title,meta_desc_content,meta_keywords,page_title);

    } else if(current_url == "football-predictions-today/finished/predictions-both-to-score"){

        title ="Both to score Predictions, Soccer Tips and Match Stats: Finished Matches.";
        meta_desc_content = "Pitch Predictions offers statistics-based Today’s Football Predictions. Why wait? Join us now and make informed decisions on today's matches.";
        meta_keywords = "Today football prediction, soccer predictions today, soccer predictions for today , predictions for today matches, football tips today, today matches predictions, today soccer predictions, today soccer predictions, football predictions today, football today matches, football predictions for today";
        page_title = "Both to score Predictions - (Finished Matches)";

        meta_content_array.push(title,meta_desc_content,meta_keywords,page_title);
        
    } else if(current_url.includes("match/[match-details]/")){
        if(router.isReady){    
            const matchdetails = router.query["match-details"]?.replace("football-predictions-", "");
            // Split the string at the "vs" delimiter
            const splitStrings = matchdetails.split("-vs-");
            // Remove the integer from the second string
            const secondString = splitStrings[1].replace(/[0-9]/g, "").trim();

            const team_A = splitStrings[0].replace(/-/g, ' ').toLowerCase().replace(/(^|\s)\S/g, function(t) { return t.toUpperCase(); });
            const team_B = secondString.replace(/-/g, ' ').toLowerCase().replace(/(^|\s)\S/g, function(t) { return t.toUpperCase(); });

            //fixtures url descriptions 
            title = team_A + ' vs '+ team_B+' Predictions Fixtures, Results and Stats';
            meta_desc_content = team_A +' vs ' + team_B +  " Predictions, Tips, Matches, Table Standings, Fixtures, Scores, Results and Match statistics.";
            meta_keywords = team_A + ' vs '+ team_B+' Predictions, '+team_A + ' vs '+ team_B +" standings, "+ team_A +' vs ' +team_B + ' fixtures, ' + team_A + ' vs '+ team_B+" results, "+team_A + ' vs '+ team_B+" table";
            page_title = team_A + " vs "+ team_B + " Fixtures and Results";

            meta_content_array.push(title,meta_desc_content,meta_keywords,page_title);
        }
    } else if(current_url === "team/[team-details]/results"){
        if(router.isReady){
            const team_name = router.query["team-details"].replace(/[0-9]/g, "").trim();
            const new_team_name = team_name.replace(/-/g, ' ').toLowerCase().replace(/(^|\s)\S/g, function(t) { return t.toUpperCase(); });

            //teams url descriptions
            title ="Latest "+new_team_name+ ' Results for all matches and Fixtures';
            meta_desc_content = "Get the latest "+ new_team_name +' results for all matches and fixtures in all competition. Track  '+new_team_name+'\'s progress overtime and compare their results to other teams.';
            meta_keywords = new_team_name+ " results, "+ new_team_name + " result, " + new_team_name+" result today, "+ new_team_name+ " result and fixtures, "+ new_team_name+" results tonight, "+ new_team_name+ " results today," +new_team_name+ " results this season, "+ new_team_name+ " result today match.";
            page_title = "LATEST "+new_team_name.toUpperCase()+" RESULTS";

            meta_content_array.push(title,meta_desc_content,meta_keywords,page_title);
            
        }
    } else if(current_url === "team/[team-details]/upcoming-matches"){
        if(router.isReady){
            const team_name = router.query["team-details"].replace(/[0-9]/g, "").trim();
            const new_team_name = team_name.replace(/-/g, ' ').toLowerCase().replace(/(^|\s)\S/g, function(t) { return t.toUpperCase(); });

            //teams url descriptions
            title =new_team_name+ ' Upcoming fixtures and matches';
            meta_desc_content = new_team_name +' upcoming matches. Latest schedule for team next game and fixtures. Stay up-to-date on '+new_team_name+" upcoming games and don't miss a single match.";
            meta_keywords = new_team_name+ " fixtures, "+ new_team_name + " next game, " + new_team_name+" next match, "+ new_team_name+ " next fixtures, "+ new_team_name+ " next five fixtures," +new_team_name+ " next "+ new_team_name.toUpperCase()+" fixtures, "+ new_team_name+ " remaining game, "+ new_team_name+ " upcoming matches, "+new_team_name+ " upcoming fixtures, "+ new_team_name+ " schedule.";
            page_title = new_team_name.toUpperCase()+" UPCOMING MATCHES AND FIXTURES";

            meta_content_array.push(title,meta_desc_content,meta_keywords,page_title);
            
        }
    } else if(current_url === "team/[team-details]/players"){
        if(router.isReady){
            const team_name = router.query["team-details"].replace(/[0-9]/g, "").trim();
            const new_team_name = team_name.replace(/-/g, ' ').toLowerCase().replace(/(^|\s)\S/g, function(t) { return t.toUpperCase(); });

            //teams url descriptions
            title =new_team_name+ ' Players, Squads and Player Stats';
            meta_desc_content = "Get to know the "+ new_team_name +' players, their positions, nationalities and stats. See who the '+new_team_name+'\s top scorers are, who has the most assists, and most clean sheets.';
            meta_keywords = new_team_name+ " players, "+ new_team_name + " top scorers, " + new_team_name+" players year, best "+ new_team_name+ " players, "+ new_team_name+" players on loan, old "+ new_team_name+ " players," +new_team_name+ " player ages";
            page_title = new_team_name.toUpperCase()+" PLAYERS AND STATS";

            meta_content_array.push(title,meta_desc_content,meta_keywords,page_title);
            
        }
    } else if(current_url === "team/[team-details]/standings"){
        if(router.isReady){
            const team_name = router.query["team-details"].replace(/[0-9]/g, "").trim();
            const new_team_name = team_name.replace(/-/g, ' ').toLowerCase().replace(/(^|\s)\S/g, function(t) { return t.toUpperCase(); });

            //teams url descriptions
            title ='Latest '+new_team_name+ ' Table and Standings';
            meta_desc_content = "Get the latest "+ new_team_name +' standings and Table positions. See where they rank in the league, how many points they have, and how many games they have played';
            meta_keywords = new_team_name+ " standings, "+ new_team_name + " table, " + new_team_name+" standing, "+ new_team_name+ " table standings, "+ new_team_name+" standings table, "+ new_team_name+ " standings," +new_team_name+ " position, "+ new_team_name+ " league table";
            page_title = "LATEST "+new_team_name.toUpperCase()+" TABLE AND STANDINGS";

            meta_content_array.push(title,meta_desc_content,meta_keywords,page_title);
            
        }
    } else if(current_url == "league/[country-name]/[football-prediction-for-league]/fixtures"){
        //Fixtures by Country 
        if(router.isReady){
            const country_name = router.query["country-name"]?.replace("football-predictions-for-", "");
            const new_country_name = country_name.replace(/-/g, ' ').toLowerCase().replace(/(^|\s)\S/g, function(t) { return t.toUpperCase(); });

            const league_name = removeLastIntegerPart(router.query["football-prediction-for-league"]);
            const new_league_name = league_name.replace(/-/g, ' ').toLowerCase().replace(/(^|\s)\S/g, function(t) { return t.toUpperCase(); });

            title = new_country_name + " "+ new_league_name+ " Fixtures Predictions, Matches and Results";
            meta_desc_content = "Get the latest schedule for all "+new_country_name +" " + new_league_name +" matches, including the date, time and opponent. Stay up to date on the league fixtures and matches predictions.";
            meta_keywords = new_country_name + " " +new_league_name +" fixtures,"+ new_country_name + " "+ new_league_name+ " fixtures, "+ new_country_name + " "+ new_league_name + " matches, "+ new_country_name + " " + new_league_name +" schedule, upcoming " + new_country_name + " "+ new_league_name +" matches, " + new_country_name + " "+ new_league_name+ " fixtures predictions, "+ new_country_name + " "+ new_league_name + " predictions";
            page_title = new_country_name + " " + new_league_name +" Fixtures Predictions, Matches and Results";
            image_url = "/pitch-predictions-logo.png";
            image_alt = new_country_name + " " +new_league_name +" Fixtures Predictions, Matches and Results";

            meta_content_array.push(title,meta_desc_content,meta_keywords,page_title,image_url,image_alt);
        }       
    } else if(current_url == "league/[country-name]/[football-prediction-for-league]/fixtures/double-chance-predictions"){
        //Fixtures by Country 
        if(router.isReady){
            const country_name = router.query["country-name"]?.replace("football-predictions-for-", "");
            const new_country_name = country_name.replace(/-/g, ' ').toLowerCase().replace(/(^|\s)\S/g, function(t) { return t.toUpperCase(); });

            const league_name = removeLastIntegerPart(router.query["football-prediction-for-league"]);
            const new_league_name = league_name.replace(/-/g, ' ').toLowerCase().replace(/(^|\s)\S/g, function(t) { return t.toUpperCase(); });

            title = new_country_name + " "+ new_league_name+ " Double Chance Predictions, Matches and Results";
            meta_desc_content = "Get the latest schedule for all "+new_country_name +" " + new_league_name +" matches, including the date, time and opponent. Stay up to date on the league fixtures and matches predictions.";
            meta_keywords = new_country_name + " " +new_league_name +" fixtures,"+ new_country_name + " "+ new_league_name+ " fixtures, "+ new_country_name + " "+ new_league_name + " matches, "+ new_country_name + " " + new_league_name +" schedule, upcoming " + new_country_name + " "+ new_league_name +" matches, " + new_country_name + " "+ new_league_name+ " fixtures predictions, "+ new_country_name + " "+ new_league_name + " predictions";
            page_title = new_country_name + " " +new_league_name +" Double Chance Predictions, Matches and Results";
            image_url = "/pitch-predictions-logo.png";
            image_alt = new_country_name + " " + new_league_name +" Double Chance Predictions, Matches and Results";

            meta_content_array.push(title,meta_desc_content,meta_keywords,page_title,image_url,image_alt);
        } 
    }  else if(current_url == "league/[country-name]/[football-prediction-for-league]/fixtures/predictions-halftime-fulltime"){
            //Fixtures by Country 
            if(router.isReady){
                const country_name = router.query["country-name"]?.replace("football-predictions-for-", "");
                const new_country_name = country_name.replace(/-/g, ' ').toLowerCase().replace(/(^|\s)\S/g, function(t) { return t.toUpperCase(); });
    
                const league_name = removeLastIntegerPart(router.query["football-prediction-for-league"]);
                const new_league_name = league_name.replace(/-/g, ' ').toLowerCase().replace(/(^|\s)\S/g, function(t) { return t.toUpperCase(); });
    
                title = new_country_name + " "+ new_league_name+ " Halftime/Fultime Predictions, Matches and Results";
                meta_desc_content = "Get the latest schedule for all "+new_country_name +" " + new_league_name +" matches, including the date, time and opponent. Stay up to date on the league fixtures and matches predictions.";
                meta_keywords = new_country_name + " " +new_league_name +" fixtures,"+ new_country_name + " "+ new_league_name+ " fixtures, "+ new_country_name + " "+ new_league_name + " matches, "+ new_country_name + " " + new_league_name +" schedule, upcoming " + new_country_name + " "+ new_league_name +" matches, " + new_country_name + " "+ new_league_name+ " fixtures predictions, "+ new_country_name + " "+ new_league_name + " predictions";
                page_title = new_country_name + " " + new_league_name +" Halftime/Fultime Predictions, Matches and Results";
                image_url = "/pitch-predictions-logo.png";
                image_alt = new_country_name + " " +new_league_name +" Halftime/Fultime Predictions, Matches and Results";
    
                meta_content_array.push(title,meta_desc_content,meta_keywords,page_title,image_url,image_alt);
            }          
    } else if(current_url == "league/[country-name]/[football-prediction-for-league]/fixtures/predictions-under-over"){
            //Fixtures by Country 
            if(router.isReady){
                const country_name = router.query["country-name"]?.replace("football-predictions-for-", "");
                const new_country_name = country_name.replace(/-/g, ' ').toLowerCase().replace(/(^|\s)\S/g, function(t) { return t.toUpperCase(); });
    
                const league_name = removeLastIntegerPart(router.query["football-prediction-for-league"]);
                const new_league_name = league_name.replace(/-/g, ' ').toLowerCase().replace(/(^|\s)\S/g, function(t) { return t.toUpperCase(); });
    
                title = new_country_name + " "+ new_league_name+ " Under/Over2.5 Predictions, Matches and Results";
                meta_desc_content = "Get the latest schedule for all "+new_country_name +" " + new_league_name +" matches, including the date, time and opponent. Stay up to date on the league fixtures and matches predictions.";
                meta_keywords = new_country_name + " " +new_league_name +" fixtures,"+ new_country_name + " "+ new_league_name+ " fixtures, "+ new_country_name + " "+ new_league_name + " matches, "+ new_country_name + " " + new_league_name +" schedule, upcoming " + new_country_name + " "+ new_league_name +" matches, " + new_country_name + " "+ new_league_name+ " fixtures predictions, "+ new_country_name + " "+ new_league_name + " predictions";
                page_title = new_country_name + " " +new_league_name +" Under/Over2.5 Predictions, Matches and Results";
                image_url = "/pitch-predictions-logo.png";
                image_alt = new_country_name + " " +new_league_name +" Under/Over2.5 Predictions, Matches and Results";
    
                meta_content_array.push(title,meta_desc_content,meta_keywords,page_title,image_url,image_alt);
            }          
    }  else if(current_url == "league/[country-name]/[football-prediction-for-league]/fixtures/predictions-both-to-score"){
        //Fixtures by Country 
        if(router.isReady){
            const country_name = router.query["country-name"]?.replace("football-predictions-for-", "");
            const new_country_name = country_name.replace(/-/g, ' ').toLowerCase().replace(/(^|\s)\S/g, function(t) { return t.toUpperCase(); });

            const league_name = removeLastIntegerPart(router.query["football-prediction-for-league"]);
            const new_league_name = league_name.replace(/-/g, ' ').toLowerCase().replace(/(^|\s)\S/g, function(t) { return t.toUpperCase(); });

            title = new_country_name + " "+ new_league_name+ " Both to Score Predictions, Matches and Results";
            meta_desc_content = "Get the latest schedule for all "+new_country_name +" " + new_league_name +" matches, including the date, time and opponent. Stay up to date on the league fixtures and matches predictions.";
            meta_keywords = new_country_name + " " +new_league_name +" fixtures,"+ new_country_name + " "+ new_league_name+ " fixtures, "+ new_country_name + " "+ new_league_name + " matches, "+ new_country_name + " " + new_league_name +" schedule, upcoming " + new_country_name + " "+ new_league_name +" matches, " + new_country_name + " "+ new_league_name+ " fixtures predictions, "+ new_country_name + " "+ new_league_name + " predictions";
            page_title = new_country_name + " " +new_league_name +" Both to Score Predictions, Matches and Results";
            image_url = "/pitch-predictions-logo.png";
            image_alt = new_country_name + " " +new_league_name +" Both to Score Predictions, Matches and Results";

            meta_content_array.push(title,meta_desc_content,meta_keywords,page_title,image_url,image_alt);
        }          
     
    } else if(current_url == "league/[country-name]/[football-prediction-for-league]/results"){
        //Fixtures by Country 
        if(router.isReady){
            const country_name = router.query["country-name"]?.replace("football-predictions-for-", "");
            const new_country_name = country_name.replace(/-/g, ' ').toLowerCase().replace(/(^|\s)\S/g, function(t) { return t.toUpperCase(); });

            const league_name = removeLastIntegerPart(router.query["football-prediction-for-league"]);
            const new_league_name = league_name.replace(/-/g, ' ').toLowerCase().replace(/(^|\s)\S/g, function(t) { return t.toUpperCase(); });

            title = "Latest "+new_country_name + " "+ new_league_name+ " Results for all matches and fixtures.";
            meta_desc_content = "Get the latest "+new_country_name +" " + new_league_name +" results for all matches and fixtures. Results from  "+new_country_name +" " + new_league_name + " matches including the final, goal scored and lineups.";
            meta_keywords = new_country_name + " "+ new_league_name +" result,"+ new_country_name + " "+ new_league_name+ " results, "+ new_country_name + " "+ new_league_name + " results today, "+ new_country_name + " " + new_league_name +" results and fixtures, " + new_country_name + " " + new_league_name +" results tonight, " + new_country_name + " "+ new_league_name+ " result today, "+ new_country_name + " "+ new_league_name + " result this season" + new_country_name + " "+ new_league_name + " game results";
            page_title = "Latest "+new_country_name + " "+ new_league_name+" Results"
            image_url = "/pitch-predictions-logo.png";
            image_alt = "Latest " +new_country_name + " "+ new_league_name+" Results";

            meta_content_array.push(title,meta_desc_content,meta_keywords,page_title,image_url,image_alt);
        }   
    } else if(current_url == "league/[country-name]/[football-prediction-for-league]/results/double-chance-predictions"){
        //Fixtures by Country 
        if(router.isReady){
            const country_name = router.query["country-name"]?.replace("football-predictions-for-", "");
            const new_country_name = country_name.replace(/-/g, ' ').toLowerCase().replace(/(^|\s)\S/g, function(t) { return t.toUpperCase(); });

            const league_name = removeLastIntegerPart(router.query["football-prediction-for-league"]);
            const new_league_name = league_name.replace(/-/g, ' ').toLowerCase().replace(/(^|\s)\S/g, function(t) { return t.toUpperCase(); });

            title = "Latest "+new_country_name + " "+ new_league_name+ " Double Chance  Results for all matches and fixtures.";
            meta_desc_content = "Get the latest "+new_country_name +" " + new_league_name +" results for all matches and fixtures. Results from  "+new_country_name +" " + new_league_name + " matches including the final, goal scored and lineups.";
            meta_keywords = new_country_name + " "+ new_league_name +" result,"+ new_country_name + " "+ new_league_name+ " results, "+ new_country_name + " "+ new_league_name + " results today, "+ new_country_name + " " + new_league_name +" results and fixtures, " + new_country_name + " " + new_league_name +" results tonight, " + new_country_name + " "+ new_league_name+ " result today, "+ new_country_name + " "+ new_league_name + " result this season" + new_country_name + " "+ new_league_name + " game results";
            page_title = "Latest " +new_country_name + " "+ new_league_name+" Double Chance Results"
            image_url = "/pitch-predictions-logo.png";
            image_alt = "Latest "+new_country_name + " "+ new_league_name+" Results";

            meta_content_array.push(title,meta_desc_content,meta_keywords,page_title,image_url,image_alt);
        }          
    } else if(current_url == "league/[country-name]/[football-prediction-for-league]/results/predictions-halftime-fulltime"){
        //Fixtures by Country 
        if(router.isReady){
            const country_name = router.query["country-name"]?.replace("football-predictions-for-", "");
            const new_country_name = country_name.replace(/-/g, ' ').toLowerCase().replace(/(^|\s)\S/g, function(t) { return t.toUpperCase(); });

            const league_name = removeLastIntegerPart(router.query["football-prediction-for-league"]);
            const new_league_name = league_name.replace(/-/g, ' ').toLowerCase().replace(/(^|\s)\S/g, function(t) { return t.toUpperCase(); });

            title = "Latest "+new_country_name + " "+ new_league_name+ " Halftime/Fulltime Results for all matches and fixtures.";
            meta_desc_content = "Get the latest "+new_country_name +" " + new_league_name +" results for all matches and fixtures. Results from  "+new_country_name +" " + new_league_name + " matches including the final, goal scored and lineups.";
            meta_keywords = new_country_name + " "+ new_league_name +" result,"+ new_country_name + " "+ new_league_name+ " results, "+ new_country_name + " "+ new_league_name + " results today, "+ new_country_name + " " + new_league_name +" results and fixtures, " + new_country_name + " " + new_league_name +" results tonight, " + new_country_name + " "+ new_league_name+ " result today, "+ new_country_name + " "+ new_league_name + " result this season" + new_country_name + " "+ new_league_name + " game results";
            page_title = "Latest "+ new_country_name + " " + new_league_name+" Halftime/Fulltime Results"
            image_url = "/pitch-predictions-logo.png";
            image_alt = "Latest "+new_country_name + " " + new_league_name+" Halftime/Fulltime Results";

            meta_content_array.push(title,meta_desc_content,meta_keywords,page_title,image_url,image_alt);
        }          
    } else if(current_url == "league/[country-name]/[football-prediction-for-league]/results/predictions-under-over"){
        //Fixtures by Country 
        if(router.isReady){
            const country_name = router.query["country-name"]?.replace("football-predictions-for-", "");
            const new_country_name = country_name.replace(/-/g, ' ').toLowerCase().replace(/(^|\s)\S/g, function(t) { return t.toUpperCase(); });

            const league_name = removeLastIntegerPart(router.query["football-prediction-for-league"]);
            const new_league_name = league_name.replace(/-/g, ' ').toLowerCase().replace(/(^|\s)\S/g, function(t) { return t.toUpperCase(); });

            title = "Latest "+new_country_name + " "+ new_league_name+ " Under/Over2.5 Results for all matches and fixtures.";
            meta_desc_content = "Get the latest "+new_country_name +" " + new_league_name +" results for all matches and fixtures. Results from  "+new_country_name +" " + new_league_name + " matches including the final, goal scored and lineups.";
            meta_keywords = new_country_name + " "+ new_league_name +" result,"+ new_country_name + " "+ new_league_name+ " results, "+ new_country_name + " "+ new_league_name + " results today, "+ new_country_name + " " + new_league_name +" results and fixtures, " + new_country_name + " " + new_league_name +" results tonight, " + new_country_name + " "+ new_league_name+ " result today, "+ new_country_name + " "+ new_league_name + " result this season" + new_country_name + " "+ new_league_name + " game results";
            page_title = "Latest "+new_country_name + " " + new_league_name+" Under/Over2.5 Results"
            image_url = "/pitch-predictions-logo.png";
            image_alt = "Latest " +new_country_name + " "+ new_league_name+" Under/Over2.5 Results";

            meta_content_array.push(title,meta_desc_content,meta_keywords,page_title,image_url,image_alt);
        }          
    } else if(current_url == "league/[country-name]/[football-prediction-for-league]/results/predictions-both-to-score"){
        //Fixtures by Country 
        if(router.isReady){
            const country_name = router.query["country-name"]?.replace("football-predictions-for-", "");
            const new_country_name = country_name.replace(/-/g, ' ').toLowerCase().replace(/(^|\s)\S/g, function(t) { return t.toUpperCase(); });

            const league_name = removeLastIntegerPart(router.query["football-prediction-for-league"]);
            const new_league_name = league_name.replace(/-/g, ' ').toLowerCase().replace(/(^|\s)\S/g, function(t) { return t.toUpperCase(); });

            title = "Latest "+new_country_name + " "+ new_league_name+ " Both to Score Results for all matches and fixtures.";
            meta_desc_content = "Get the latest "+new_country_name +" " + new_league_name +" results for all matches and fixtures. Results from  "+new_country_name +" " + new_league_name + " matches including the final, goal scored and lineups.";
            meta_keywords = new_country_name + " "+ new_league_name +" result,"+ new_country_name + " "+ new_league_name+ " results, "+ new_country_name + " "+ new_league_name + " results today, "+ new_country_name + " " + new_league_name +" results and fixtures, " + new_country_name + " " + new_league_name +" results tonight, " + new_country_name + " "+ new_league_name+ " result today, "+ new_country_name + " "+ new_league_name + " result this season" + new_country_name + " "+ new_league_name + " game results";
            page_title = "Latest " +new_country_name + " "+ new_league_name+" Both to Score Results"
            image_url = "/pitch-predictions-logo.png";
            image_alt = "Latest " +new_country_name + " "+ new_league_name+" Both to Score Results";

            meta_content_array.push(title,meta_desc_content,meta_keywords,page_title,image_url,image_alt);
        }          
           
    } else if(current_url == "league/[country-name]/[football-prediction-for-league]/standings"){
        //Fixtures by Country 
        if(router.isReady){
            const country_name = router.query["country-name"]?.replace("football-predictions-for-", "");
            const new_country_name = country_name.replace(/-/g, ' ').toLowerCase().replace(/(^|\s)\S/g, function(t) { return t.toUpperCase(); });

            const league_name = removeLastIntegerPart(router.query["football-prediction-for-league"]);
            const new_league_name = league_name.replace(/-/g, ' ').toLowerCase().replace(/(^|\s)\S/g, function(t) { return t.toUpperCase(); });

            title = "Latest "+new_country_name + " "+ new_league_name+ " Table Standings and Stats";
            meta_desc_content = "Latest "+new_country_name +" " + new_league_name +" standings including points, goals scored and goals conceded. Check the current positions, number of wins, loses and draws for each team.";
            meta_keywords = new_country_name + " "+ new_league_name +" standings,"+ new_country_name + " "+ new_league_name+ " table, "+ new_country_name + " "+ new_league_name + " table standings, "+ new_country_name + " " + new_league_name +" standing table, " + new_country_name + " " + new_league_name +" standings, " + new_country_name + " "+ new_league_name+ " goals scored, "+ new_country_name + " "+ new_league_name + " points";
            page_title = "Latest " +new_country_name + " "+ new_league_name+" Table Standings";
            image_url = "/pitch-predictions-logo.png";
            image_alt = "Latest " +new_country_name + " "+ new_league_name+" Table Standings";

            meta_content_array.push(title,meta_desc_content,meta_keywords,page_title,image_url,image_alt);
        }          
    } else if(current_url == "league/[country-name]/[football-prediction-for-league]/trends"){
        //Fixtures by Country 
        if(router.isReady){
            const country_name = router.query["country-name"]?.replace("football-predictions-for-", "");
            const new_country_name = country_name.replace(/-/g, ' ').toLowerCase().replace(/(^|\s)\S/g, function(t) { return t.toUpperCase(); });

            const league_name = removeLastIntegerPart(router.query["football-prediction-for-league"]);
            const new_league_name = league_name.replace(/-/g, ' ').toLowerCase().replace(/(^|\s)\S/g, function(t) { return t.toUpperCase(); });

            title = "Top "+new_country_name + " "+ new_league_name+ " Trends and Stats";
            meta_desc_content = "Get the Latest "+new_country_name +" " + new_league_name +" trends, including the most talked about players, teams and matches. Stay up to date on the top league trends.";
            meta_keywords = new_country_name + " "+ new_league_name +" trends,"+ new_country_name + " "+ new_league_name+ " football trends, "+ new_country_name + " "+ new_league_name + " team trends, "+ new_country_name + " " + new_league_name +" top trends, " + new_country_name + " " + new_league_name +" season trends, " + new_country_name + " "+ new_league_name+ " stats trends";
            page_title = "Top " +new_country_name + " "+ new_league_name+" Trends and Stats";
            image_url = "/pitch-predictions-logo.png";
            image_alt = "Top " +new_country_name + " " + new_league_name+" Trends and Stats";

            meta_content_array.push(title,meta_desc_content,meta_keywords,page_title,image_url,image_alt);
        }          
    } else if(current_url == "country/[football-prediction-for-country]/fixtures"){
         //Fixtures by Country 
         if(router.isReady){
            const country_name = router.query["football-prediction-for-country"];
            const new_country_name = country_name.replace(/-/g, ' ').toLowerCase().replace(/(^|\s)\S/g, function(t) { return t.toUpperCase(); });

            title = new_country_name +  " Fixtures and Results Today";
            meta_desc_content = "Get All "+new_country_name + " Fixtures, Results, Predictions and Stats for the previous and next matches.";
            meta_keywords = new_country_name + " Fixtures, "+ new_country_name+" Fixture predictions, "+ new_country_name+" Fixture results, " + new_country_name+" matches, " + new_country_name+ " next fixtures, Upcoming "+ new_country_name+ " Fixtures.";
            page_title = new_country_name + " Fixtures and Results.";
            image_url = "/pitch-predictions-logo.png";
            image_alt = new_country_name + " Fixtures and Results.";

            meta_content_array.push(title,meta_desc_content,meta_keywords,page_title,image_url,image_alt);
         }   
    } else if(current_url == "country/[football-prediction-for-country]/results"){
        //Fixtures by Country 
        if(router.isReady){
           const country_name = router.query["football-prediction-for-country"];
           const new_country_name = country_name.replace(/-/g, ' ').toLowerCase().replace(/(^|\s)\S/g, function(t) { return t.toUpperCase(); });

           title = "Latest "+new_country_name + " Results For all Matches and Fixtures";
           meta_desc_content = "Get the latest "+new_country_name + " results for all matches and fixtures in all competitions. Get updated on the country results today, including scores and outcomes.";
           meta_keywords = new_country_name + " result, "+ new_country_name+" results, "+ new_country_name+" results today, " + new_country_name+" results and fixtures, " + new_country_name+ " results tonight, "+ new_country_name+ " result today, " + new_country_name + " match results";
           page_title = "Latest "+new_country_name + " Results and Fixtures.";
           image_url = "/pitch-predictions-logo.png";
           image_alt = "Latest "+new_country_name + " Results and Fixtures.";

           meta_content_array.push(title,meta_desc_content,meta_keywords,page_title,image_url,image_alt);
        }   
    } else if(current_url == "[football-prediction-for-date]"){
        if(router.isReady){
            const options = { day: '2-digit', month: '2-digit', year: 'numeric' , weekday:"long"};
            const convert_date_ = new Date(router.query.filter_date).toLocaleDateString('en-GB', options); // "03/04/2023"
            
            title = "Football Predictions for " + convert_date_;
            meta_desc_content = "Football predictions for the matches of " + convert_date_
            meta_keywords = "For free mathematically analyzed football predictions for "+convert_date_+",tips and fixtures with full match previews and stats";
            page_title = "Football Tips and Predictions for " + convert_date_;

            meta_content_array.push(title,meta_desc_content,meta_keywords,page_title);
        } 

    } else if(current_url == "football-prediction/double-chance-predictions"){
        if(router.isReady){
            const options = { day: '2-digit', month: '2-digit', year: 'numeric' , weekday:"long"};
            const convert_date_ = new Date(router.query.filter_date).toLocaleDateString('en-GB', options); // "03/04/2023"
            
            title = "Football Predictions for " + convert_date_;
            meta_desc_content = "Football predictions for the matches of " + convert_date_
            meta_keywords = "For free mathematically analyzed football predictions for "+convert_date_+",tips and fixtures with full match previews and stats";
            page_title = "Football Tips and Predictions for " + convert_date_;

            meta_content_array.push(title,meta_desc_content,meta_keywords,page_title);
        } 

    } else if(current_url == "football-predictions/double-chance-predictions"){
        if(router.isReady){
            const options = { day: '2-digit', month: '2-digit', year: 'numeric' , weekday:"long"};
            const convert_date_ = new Date(router.query.filter_date).toLocaleDateString('en-GB', options); // "03/04/2023"
            
            title = "Double Chance Football Predictions for " + convert_date_;
            meta_desc_content = "Football predictions for the matches of " + convert_date_
            meta_keywords = "For free mathematically analyzed football predictions for "+convert_date_+",tips and fixtures with full match previews and stats";
            page_title = "Double Chance Football Tips and Predictions for " + convert_date_;

            meta_content_array.push(title,meta_desc_content,meta_keywords,page_title);
        } 
    } else if(current_url == "football-predictions/predictions-halftime-fulltime"){
        if(router.isReady){
            const options = { day: '2-digit', month: '2-digit', year: 'numeric' , weekday:"long"};
            const convert_date_ = new Date(router.query.filter_date).toLocaleDateString('en-GB', options); // "03/04/2023"
            
            title = "Halftime/Fulltime Football Predictions for " + convert_date_;
            meta_desc_content = "Football predictions for the matches of " + convert_date_
            meta_keywords = "For free mathematically analyzed football predictions for "+convert_date_+",tips and fixtures with full match previews and stats";
            page_title = "Halftime/Fulltime  Football Tips and Predictions for " + convert_date_;

            meta_content_array.push(title,meta_desc_content,meta_keywords,page_title);
        } 
    } else if(current_url == "football-predictions/predictions-under-over"){
        if(router.isReady){
            const options = { day: '2-digit', month: '2-digit', year: 'numeric' , weekday:"long"};
            const convert_date_ = new Date(router.query.filter_date).toLocaleDateString('en-GB', options); // "03/04/2023"
            
            title = "Under/Over 2.5 Football Predictions for " + convert_date_;
            meta_desc_content = "Football predictions for the matches of " + convert_date_
            meta_keywords = "For free mathematically analyzed football predictions for "+convert_date_+",tips and fixtures with full match previews and stats";
            page_title = "Under/Over 2.5 Football Tips and Predictions for " + convert_date_;

            meta_content_array.push(title,meta_desc_content,meta_keywords,page_title);
        } 
    } else if(current_url == "football-predictions/predictions-both-to-score"){
        if(router.isReady){
            const options = { day: '2-digit', month: '2-digit', year: 'numeric' , weekday:"long"};
            const convert_date_ = new Date(router.query.filter_date).toLocaleDateString('en-GB', options); // "03/04/2023"
            
            title = "Both to Score Football Predictions for " + convert_date_;
            meta_desc_content = "Football predictions for the matches of " + convert_date_
            meta_keywords = "For free mathematically analyzed football predictions for "+convert_date_+",tips and fixtures with full match previews and stats";
            page_title = "Both to Score Football Tips and Predictions for " + convert_date_;

            meta_content_array.push(title,meta_desc_content,meta_keywords,page_title);
        } 
    } else if(current_url == "terms-and-conditions"){
        title = "Pitch Predictions Terms and Conditions";
        meta_desc_content = "Pitch Predictions Terms and Conditions"
        meta_keywords = "Pitch Predictions Terms and Conditions";

        page_title = "Terms and Conditions";
    
        meta_content_array.push(title,meta_desc_content,meta_keywords,page_title);

    } else if(current_url == "privacy-policy"){
        title = "Privacy Policy for PitchPredictions";
        meta_desc_content = "Privacy Policy for PitchPredictions"
        meta_keywords = "Privacy Policy for PitchPredictions";
        page_title = "Privacy Policy for PitchPredictions";
    
        meta_content_array.push(title,meta_desc_content,meta_keywords,page_title);
    } else if(current_url == "contactus"){
        title = "Contact us";
        meta_desc_content = "Contact us"
        meta_keywords = "Contact us";
        page_title = "Contact us";
    
        meta_content_array.push(title,meta_desc_content,meta_keywords,page_title);
    } else if(current_url == "my-favourite-predictions"){
        title = "My Selected Fixtures";
        meta_desc_content = "My Selected Fixtures"
        meta_keywords = "My Selected Fixtures";
        page_title = "My Selected Fixtures";
    
        meta_content_array.push(title,meta_desc_content,meta_keywords,page_title); 
    } else if(current_url == "showing-all-search-results"){
        title =  `Showing Search Results for:  ${router.query.query}`;
        meta_desc_content =  `Showing Search Results for:  ${router.query.query}`;
        meta_keywords = `Showing Search Results for:  ${router.query.query}`;
        page_title = `Showing Search Results for:  ${router.query.query}`;
    
        meta_content_array.push(title,meta_desc_content,meta_keywords,page_title);
                    
    } else if(current_url == "team-comparison"){
        title = "Team Comparison and Head-to-Head Football Analysis";
        meta_desc_content = "Compare football teams head-to-head with accurate stats, performance metrics, and match predictions. Get insights for smarter betting and team evaluation.";
        meta_keywords = "team comparison, football team comparison, soccer team comparison, head to head team comparison, team comparison prediction, team comparison football";
        page_title = "Football Team Comparison and H2H Match Insights";
    
        meta_content_array.push(title,meta_desc_content,meta_keywords,page_title);
    } else if(current_url == "sitemaps"){
        title =  "Sitemap Links";
        meta_desc_content =  "Sitemap Links";
        meta_keywords = "Sitemap Links";
        page_title = "Sitemap Links";
    
        meta_content_array.push(title,meta_desc_content,meta_keywords,page_title);                  
    } else if(current_url.includes("tips/sokafans")){
        title = "Sokafans Predictions – Free Football Tips & Jackpot Picks";
        meta_desc_content = "Looking for Sokafans predictions? Get free daily football tips, jackpot predictions &amp; match analysis on Pitch Predictions — covering Mega Jackpot, Midweek Jackpot & 700+ leagues.";
        meta_keywords = "sokafans, sokafans prediction, sokafans mega jackpot prediction, sokafans prediction today, sokafans tips, sokafans tips today prediction, sokafans free tips today, sokafans jackpot prediction, sokafans 100% sure tips";
        page_title = "Sokafans Predictions – Free Football Tips & Jackpot Picks";

        meta_content_array.push(title,meta_desc_content,meta_keywords,page_title);
    } else if (current_url.includes("tips/betensured-predictions")) {
        title = "Betensured Predictions and Football Jackpot Tips";
        meta_desc_content = "Get Betensured predictions and expert football tips for today. Find reliable jackpot insights, betting analysis, and winning tips to boost your success.";
        meta_keywords = "betensured, betensured predictions today, betensured football tips, betensured jackpot tips, betensured betting tips, betensured free tips";
        page_title = "Free Betensured Football Predictions and Tips";
    
        meta_content_array.push(title, meta_desc_content, meta_keywords, page_title);
    } else if (current_url.includes("tips/cheerplex")) { 
        title = "Cheerplex Predictions and Jackpot Football Tips";
        meta_desc_content = "Get Cheerplex predictions for today’s matches, including SportPesa mega jackpot tips. Access free football advice and expert jackpot insights to raise your winning chances.";
        meta_keywords = "cheerplex, cheerplex prediction, cheerplex mega jackpot prediction, cheerplex sportpesa mega jackpot prediction, cheerplex jackpot prediction, cheerplex jackpot prediction today";
        page_title = "Free Cheerplex Football Tips and Predictions";
    
        meta_content_array.push(title, meta_desc_content, meta_keywords, page_title);
    } else if (current_url.includes("tips/mwanasoka")) {
        title = "Mwanasoka Predictions – Free Daily Football Tips & Jackpot Picks | Pitch Predictions";
        meta_desc_content = "Looking for Mwanasoka predictions today? Get free daily football tips, jackpot predictions, BTTS, GG, correct score &amp; over/under picks on Pitch Predictions — updated daily.";
        meta_keywords = "mwanasoka tips, mwanasoka football predictions, mwanasoka daily tips, mwanasoka free tips, mwanasoka jackpot predictions, mwanasoka mega jackpot tips, mwanasoka gg tips, mwanasoka predictions today";
        page_title = "Mwanasoka Predictions – Free Daily Football Tips & Jackpot Picks";
    
        meta_content_array.push(title, meta_desc_content, meta_keywords, page_title);
    } else if (current_url.includes("tips/sunpel")) {
        title = "Sunpel Predictions – Free Football Tips & Jackpot Picks";
        meta_desc_content = "Looking for Sunpel predictions today? Get free football tips, jackpot predictions, BTTS, correct score & mega jackpot analysis on Pitch Predictions — updated daily.";
        meta_keywords = "sunpel, sunpel predictions today, sunpel football tips, sunpel jackpot tips, sunpel mega jackpot tips, sunpel btts tips";
        page_title = "Sunpel Predictions – Free Football Tips & Jackpot Picks";
    
        meta_content_array.push(title, meta_desc_content, meta_keywords, page_title);
    } else if (current_url.includes("tips/1960tips")) { //New ones
        title = "1960Tips Football Predictions and Expert Betting Tips";  
        meta_desc_content = "Get accurate 1960Tips football predictions and expert betting advice. Access daily updated match analysis and free soccer tips to improve your betting success.";  
        meta_keywords = "1960Tips, Football predictions, Accurate betting tips, Free soccer predictions, 1960Tips expert analysis, Best football betting tips";  
        page_title = "1960Tips Football Predictions and Betting Insights";  
    
        meta_content_array.push(title, meta_desc_content, meta_keywords, page_title);
    } else if (current_url.includes("tips/amazingstakes")) { 
        title = "Amazing Stakes Football Predictions and Betting Tips";  
        meta_desc_content = "Boost your winning chances with Amazing Stakes. Access daily football predictions, accurate soccer betting tips, and detailed match analysis to guide your bets.";  
        meta_keywords = "Amazing Stakes, Amazingstakes, Amazing Stakes predictions, Amazing Stakes betting tips, Accurate soccer tips, Football match analysis";  
        page_title = "Amazing Stakes Free Football Predictions and Expert Tips";  
    
        meta_content_array.push(title, meta_desc_content, meta_keywords, page_title);

    } else if (current_url.includes("tips/bet-of-the-day-tips")) { 
        title = "PitchPredictions Bet of the Day and Winning Football Tips";  
        meta_desc_content = "Discover the best football bet of the day on PitchPredictions. Get expert picks, banker bets, and single tips to improve your chances of winning.";  
        meta_keywords = "PitchPredictions, mybets today, bet of the day, banker bet of the day, single bet of the day, bet of the day soccervista, forebet bet of the day, banker bets, mybet correct score today, mybet today";  
        page_title = "PitchPredictions Bet of the Day and Expert Football Tips";  
        
        meta_content_array.push(title, meta_desc_content, meta_keywords, page_title);        

    } else if (current_url.includes("tips/betarazi")) { 
        title = "Betarazi Football Predictions and Daily Betting Tips";  
        meta_desc_content = "Explore Betarazi’s expert football predictions, daily tips, and in-depth match analysis. Get reliable betting insights to improve your winning chances.";  
        meta_keywords = "Betarazi, Amazing Stakes, Betarazi predictions, Betarazi tips, Betarazi betting tips, Accurate soccer tips, Daily football predictions, Winning football strategies";  
        page_title = "Betarazi Football Predictions and Expert Betting Insights";  

        meta_content_array.push(title, meta_desc_content, meta_keywords, page_title);

    } else if (current_url.includes("tips/betnumbers-predictions")) { 
        title = "Betnumbers Predictions and Bet Numbers Tips";  
        meta_desc_content = "Get BetNumbers football predictions, trusted betting tips, and jackpot picks for today’s matches. Accurate insights to guide your winning strategy.";  
        meta_keywords = "BetNumbers, BetNumbers tips, BetNumbers predictions today, BetNumbers free tips, BetNumbers football predictions, BetNumbers betting tips, jackpot picks";  
        page_title = "BetNumbers Free Tips and Daily Football Predictions";   
            
        meta_content_array.push(title, meta_desc_content, meta_keywords, page_title);
    } else if (current_url.includes("tips/correct-predict")) { 
        title = "Correct Predict Accurate Predictions and Betting Tips";  
        meta_desc_content = "Get today's correct football predictions on Correct Predict. Boost your betting accuracy with reliable tips and expert analysis for the latest matches.";  
        meta_keywords = "Correct Predict, Correct predictor, Correct prediction, Correct tips, accurate football predictions, football betting tips, daily football predictions, expert soccer predictions";  
        page_title = "Correct Predict: Accurate Predictions & Betting Tips";  
        
        meta_content_array.push(title, meta_desc_content, meta_keywords, page_title);
        
    } else if (current_url.includes("tips/correct-score")) { 
        title = "Correct Score Predictions | Accurate Football Tips & Analysis";  
        meta_desc_content = "Find reliable predictions and expert tips on Correct Predict. Improve your betting strategy with accurate match analysis and daily insights.";  
        meta_keywords = "Correct Predict, Correct predictor, Correct prediction, Correct tips, accurate football predictions, football betting tips, daily football predictions, expert soccer predictions";  
        page_title = "Correct Predict Daily Tips and Expert Insights";  
        
        meta_content_array.push(title, meta_desc_content, meta_keywords, page_title);        
    } else if (current_url.includes("tips/direct-win-prediction")) { 
        title = "Direct Win Predictions – Free Straight Win Football Tips Today | Pitch Predictions";  
        meta_desc_content = "Get free direct win predictions for today's football matches. Straight win tips backed by form, H2H records &amp; squad news across the Premier League, Champions League &amp; 700+ leagues.";  
        meta_keywords = "Direct Win Prediction, 180 tips today, Best football prediction site, Sure bet tips, Football betting tips, Expert match predictions, Accurate football predictions, Today match prediction";  
        page_title = "Direct Win Predictions – Free Straight Win Football Tips Today";  

        meta_content_array.push(title, meta_desc_content, meta_keywords, page_title);
    } else if (current_url.includes("tips/free-vip-tips-today")) { 
        title = "Free VIP Tips Today and 100% Accurate Football Predictions";  
        meta_desc_content = "Get free VIP tips today with 100% accurate football predictions and expert insights. Trusted analysis to help you make smarter betting choices.";  
        meta_keywords = "free vip tips today, 100 accurate free vip tips today, football predictions today, accurate betting tips, daily football insights";  
        page_title = "Free VIP Tips Today with 100% Predictions";      
    
        meta_content_array.push(title, meta_desc_content, meta_keywords, page_title);
    } else if (current_url.includes("tips/liobet")) { 
        title = "Liobet Predictions & Tips for Today | Accurate Football Betting Advice";  
        meta_desc_content = "Get the latest Liobet predictions and expert tips for today's football matches. Improve your betting strategy with our trusted forecasts and analysis."  
        meta_keywords = "Liobet, Liobet predictions, Liobet tips, Liobet football tips, Liobet betting tips, football predictions today, betting tips for today, accurate football tips";  
        page_title = "Liobet Predictions & Betting Tips for Today";  
                
        meta_content_array.push(title, meta_desc_content, meta_keywords, page_title);        
    } else if (current_url.includes("tips/must-win-teams-today")) { 
        title = "Must Win Football Teams Today – High Confidence Picks";
        meta_desc_content = "Explore today's must win football teams using form, H2H records, and key stats. Get high-confidence, data-driven picks updated daily by Pitch Predictions.";
        meta_keywords = "must win teams today, football must win tips, high confidence football predictions, strong football picks today, match winner tips, football form guide today";
        page_title = "Must Win Teams for Today & Tomorrow";
        
        meta_content_array.push(title, meta_desc_content, meta_keywords, page_title);  
        
    } else if (current_url.includes("tips/sure-win-prediction-today")) { 
        title = "Sure win Prediction Today and Tomorrow";
        meta_desc_content = "Get sure win prediction today with football tips and correct score picks. Follow match insights from Pitch Predictions to improve your betting choices.";
        meta_keywords = "sure win prediction today, sure win prediction today correct score, football tips, match predictions, correct score picks";
        page_title = "Sure Win Predictions Today – Correct Score Picks";

        meta_content_array.push(title, meta_desc_content, meta_keywords, page_title);

    } else if (current_url.includes("tips/everyday-winning-tips")) { 
        title = "Everyday Winning Tips Today";
        meta_desc_content = "Get everyday winning tips today with 1X2 and accumulator picks from Pitch Predictions. Make smarter football bets with reliable match selections";
        meta_keywords = "everyday winning tips, everyday winning tips today, free everyday winning tips, football predictions, daily football tips";
        page_title = "Everyday Winning Tips";
        
        meta_content_array.push(title, meta_desc_content, meta_keywords, page_title);

    } else if (current_url.includes("tips/5-sure-odds-today")) { 
        title = "5 Sure Odds Today | Daily Football Tips";
        meta_desc_content = "Get 5 sure odds today with selected football matches, realistic predictions, and simple picks to improve your daily betting.";
        meta_keywords = "5 sure odds today, sure odds today, 5 odds prediction, football odds tips, daily sure odds";
        page_title = "5 Sure Odds Today – Football Tips";
        
        meta_content_array.push(title, meta_desc_content, meta_keywords, page_title);

    } else if (current_url.includes("tips/betwinner360")) { 
        title = "Betwinner360 Football Predictions and Jackpot Tips";  
        meta_desc_content = "Get Betwinner 360 predictions for today’s football matches with expert tips and mega jackpot insights. Reliable advice to help you make smarter betting choices.";  
        meta_keywords = "Betwinner360 predictions, Betwinner360 tips, Betwinner360 football tips, Betwinner360 jackpot predictions, football betting advice, betting tips today";  
        page_title = "Daily Betwinner360 Predictions";  

        meta_content_array.push(title, meta_desc_content, meta_keywords, page_title);         
    } else if (current_url.includes("tips/passion-predict")) { 
        title = "Passion Predict | Accurate Football Predictions & Betting Tips";
        meta_desc_content = "Boost your betting accuracy with Passion Predict. Discover expert football predictions and betting tips for today's matches, helping you make informed choices.";
        meta_keywords = "Passion Predict, Passion Predict tips, football predictions, accurate betting tips, Passion Predict predictions, soccer betting, daily football tips, win predictions today";
        page_title = "Passion Predict Free Football Tips & Predictions";        

        meta_content_array.push(title, meta_desc_content, meta_keywords, page_title);
    } else if (current_url.includes("tips/prediction-vitibet-adibet")) { 
        title = "Adibet & Vitibet Predictions Today | Win Big with Accurate Betting Tips";  
        meta_desc_content = "Get accurate Adibet and Vitibet predictions today. Increase your chances of winning with expert tips and reliable football match predictions for today's fixtures.";  
        meta_keywords = "adibet, vitibet, win big, prediction today, adibet prediction, vitibet prediction, football betting tips, accurate betting predictions, betting tips today";  
        page_title = "Adibet & Vitibet Football Predictions | Expert Tips & Winning Strategies";  

        meta_content_array.push(title, meta_desc_content, meta_keywords, page_title);

    } else if (current_url.includes("tips/soccervista-prediction")) { 
        title = "SoccerVista Predictions Today | Sure Win Tips & Expert Analysis";  
        meta_desc_content = "Get today's sure win football predictions from SoccerVista. Trusted tips and expert match analysis to improve your betting strategy and win more.";  
        meta_keywords = "soccervista, soccervista com, soccervista.com today sure win, www soccervista com, prediction, football predictions, soccer betting tips, accurate predictions today";  
        page_title = "SoccerVista Sure Win Football Predictions & Betting Tips Today";  

        meta_content_array.push(title, meta_desc_content, meta_keywords, page_title);
    } else if (current_url.includes("tips/sokapedia")) { 
        title = "Sokapedia Predictions – Daily Jackpot & Football Tips";
        meta_desc_content = "Explore Sokapedia’s expert football predictions and jackpot tips. Get reliable insights to improve your betting decisions today.";
        meta_keywords = "Sokapedia, football predictions, jackpot tips, soccer betting, daily betting advice";
        page_title = "Sokapedia Jackpot Predictions & Expert Betting Tips";      

        meta_content_array.push(title, meta_desc_content, meta_keywords, page_title);
    } else if (current_url.includes("tips/solo-prediction")) { 
        title = "Solo Prediction Today – Data-Driven Football Pick";
        meta_desc_content = "Find today’s solo prediction using team form, H2H stats, and match context. Get a data-driven football pick to support smarter betting decisions.";
        meta_keywords = "solo prediction today, solo prediction for today, football predictions, betting tips";
        page_title = "Solo Prediction Today";

        meta_content_array.push(title, meta_desc_content, meta_keywords, page_title);
    } else if (current_url.includes("tips/sure-tips")) { 
        title = "Sure Tips Today – Free High-Confidence Football Predictions | Pitch Predictions";  
        meta_desc_content = "Free sure tips for today's football matches. High-confidence predictions across the Premier League, Champions League &amp; 700+ leagues — backed by form, H2H &amp; squad data. Updated daily.";  
        meta_keywords = "sure tips today, 100% sure tips today, SupaTips predictions, sure win tips, accurate football predictions, daily betting insights";  
        page_title = "Sure Tips Today – Free High-Confidence Football Predictions";  

        meta_content_array.push(title, meta_desc_content, meta_keywords, page_title);
    } else if (current_url.includes("tips/take-the-risk")) { 
        title = "Big Odds Predictions | High Risk Betting Tips for Big Wins";  
        meta_desc_content = "Get the latest big odds predictions and high-risk betting tips. Maximize your chances of big wins with expert analysis on risk odds predictions.";  
        meta_keywords = "Big Odds Prediction, High Odds Betting, Risk Odds Prediction, Big Wins, High Risk Betting Tips, Betting Predictions, Big Odds Tips, Risky Bets, High Payout Predictions";  
        page_title = "Big Odds & High Risk Predictions for Big Wins Today";          
    
        meta_content_array.push(title, meta_desc_content, meta_keywords, page_title);
    } else if (current_url.includes("tips/tips-spotika")) { 
        title = "Spotika Free Bet Kenya | Accurate Football & Soccer Predictions";  
        meta_desc_content = "Get expert football and soccer predictions on Pitch Predictions. Discover Spotika's free bets and sure tips for betting success in Kenya.";  
        meta_keywords = "Football Prediction, Spotika Free Bet Kenya, Pitch Predictions, Soccer Prediction, Spotika Sure Bet, Sure Tips, Kenya Football Bets, Free Betting Tips";  
        page_title = "Spotika Free Bet & Football Predictions Today";  
        
        meta_content_array.push(title, meta_desc_content, meta_keywords, page_title);        
    } else if (current_url.includes("tips/tips180")) { 
        title = "180 Tips Prediction – Sure Football Tips for Today";
        meta_desc_content = "Get today’s 180 tips predictions with trusted football insights and betting advice from Pitch Predictions.";
        meta_keywords = "180 tips prediction, sure football tips, football predictions today, betting advice";
        page_title = "Today’s 180 Tips & Football Predictions";

        meta_content_array.push(title, meta_desc_content, meta_keywords, page_title);
    } else if (current_url.includes("tips/victor-predict")) { 
        title = "Victor Predict | Accurate Football Predictions & Winning Tips Today";
        meta_desc_content = "Get Victor Predict's top-rated football predictions and winning betting tips for today's matches. Make smarter bets with our expert analysis and insights.";
        meta_keywords = "Victor Predict, Victor Predictions, football predictions today, sure betting tips, winning soccer predictions, Victor betting tips, predictions for today, best football tips";
        page_title = "Victor Predict Free Football Predictions Today";
        
        meta_content_array.push(title, meta_desc_content, meta_keywords, page_title);    
        
    } else if(current_url.includes("tips/10-teams-to-win-today")){
        title = "10 Teams to Win Today";
        meta_desc_content = "Get expert football predictions for today's top 10 teams most likely to win. Backed by stats, recent form, and analysis to help you make confident picks.";
        meta_keywords = "10 teams to win today, sure 10 teams to win today, top 10 football tips, 10 teams to win today tomorrow, football predictions today";
        page_title = "Sure 10 Teams to Win Today";

        meta_content_array.push(title, meta_desc_content, meta_keywords, page_title);

    } else if(current_url.includes("tips/100-percent-winning-tips")){
        title = "100 Percent Winning Tips Today";
        meta_desc_content = "Get today’s most trusted football predictions on Pitch Predictions. Our 100% winning tips include correct score insights, helping you make confident betting decisions.";
        meta_keywords = "100 percent winning tips, 100 percent winning tips today, 100 percent winning tips correct score, today 100 percent winning tips, Pitch Predictions football tips";
        page_title = "Todays 100% Winning Tips";

        meta_content_array.push(title, meta_desc_content, meta_keywords, page_title);

    } else if(current_url.includes("tips/feedinco")){
        title = "Feedinco Football Tips and Jackpot Prediction";
        meta_desc_content = "Get daily football tips and jackpot predictions inspired by Feedinco, including correct scores and winning insights — all free on Pitch Predictions.";
        meta_keywords = "feedinco, feedinco tips, feedinco predictions, feedinco jackpot, feedinco correct score, Pitch Predictions feedinco";
        page_title = "Feedinco Football Tips and Free Jackpot Predictions";

        meta_content_array.push(title, meta_desc_content, meta_keywords, page_title);

    } else if(current_url.includes("tips/one-million-prediction")){
        title = "One Million Prediction Tips and Correct Score Forecasts";
        meta_desc_content = "Access One Million Prediction tips including correct score forecasts for today and tomorrow. Get trusted insights to help you make confident betting decisions.";
        meta_keywords = "one million prediction, one million prediction today, one million prediction tomorrow, one million prediction correct score, one million prediction tips";
        page_title = "One Million Prediction Tips for Today and Tomorrow";

        meta_content_array.push(title,meta_desc_content,meta_keywords,page_title);
    // New pages
    } else if(current_url.includes("1x2-betting-tips")){
        title = "Accurate 1X2 Betting Tips & Football Predictions";
        meta_desc_content = "Get expert 1X2 football betting tips, statistics, and safe strategies. Perfect for bettors in Africa and America seeking smarter wagers.";
        meta_keywords = "1x2 betting tips, 1x2 betting tips today, 1x2 betting tips prediction, 1x2 match predictions, 1x2 tips today";
        page_title = "1X2 Betting Tips – Expert Football Predictions for Africa & America";

        meta_content_array.push(title, meta_desc_content, meta_keywords, page_title);

    } else if(current_url.includes("tips/24-prediction-today")){
        title = "24 Prediction Tips for Today";
        meta_desc_content = "Get 24 prediction today with football match tips and correct score picks. View today’s 24 predictions for league and cup games with updated selections.";
        meta_keywords = "24 prediction today, football 24 prediction today, 24 prediction today correct score, 24 match predictions today";
        page_title = "24 Predictions Today and Correct Score Tips";

        meta_content_array.push(title, meta_desc_content, meta_keywords, page_title);

    } else if(current_url.includes("tips/55-sure-winning-tips-today")){
        title = "55 Sure Winning Tips Today";
        meta_desc_content = "Get 55 sure winning tips with football match predictions for today’s games. View selected tips for league and cup matches updated daily on Pitch Predictions";
        meta_keywords = "55 sure winning tips today, 55 winning tips today, football 55 tips today, sure winning tips today";
        page_title = "55 Sure Winning Tips Today";

        meta_content_array.push(title, meta_desc_content, meta_keywords, page_title);

    } else if(current_url.includes("tips/90-accurate-football-predictions")){
        title = "90 Accurate Football Predictions";
        meta_desc_content = "90 accurate football predictions with 1X2 picks and correct score tips. Get free football predictions for today’s league and cup matches on Pitch Predictions.";
        meta_keywords = "90 accurate football predictions, 90 accurate football predictions 1x2, 90 accurate football predictions free, 90 accurate football predictions correct score";
        page_title = "90 Accurate Football Predictions for Today";

        meta_content_array.push(title, meta_desc_content, meta_keywords, page_title);

    } else if(current_url.includes("tips/99-accurate-prediction-site")){
        title = "99 Accurate Prediction, Tips and Match Picks";
        meta_desc_content = "99 accurate prediction site for football tips, 1X2 predictions, and correct score picks. Get today’s top match predictions for leagues and cup games.";
        meta_keywords = "99 accurate prediction site, 99 football tips, 99 accurate football predictions, 99 match predictions";
        page_title = "99 Accurate Football Predictions and Tips";

        meta_content_array.push(title, meta_desc_content, meta_keywords, page_title);

    } else if(current_url.includes("tips/100-sure-wins-only")){
        title = "100 Sure Wins Only";
        meta_desc_content = "Get 100 sure wins only with top football tips. Access today’s 100 sure wins only correct score picks and increase your chances of winning.";
        meta_keywords = "100 sure wins only, 100 sure wins only correct score, football 100 sure wins, match predictions, correct score tips";
        page_title = "100 Sure Wins Only – Correct Score Tips";

        meta_content_array.push(title, meta_desc_content, meta_keywords, page_title);

    } else if(current_url.includes("tips/banker-of-the-day")){
        title = "Banker of the day 1x2";
        meta_desc_content = "Get the Banker of the Day with our top football pick. Check today’s match prediction and increase your chances of a winning bet.";
        meta_keywords = "Banker of the Day, today’s football pick, football banker, match prediction, top football pick";
        page_title = "Banker of the Day – Top Football Pick";

        meta_content_array.push(title, meta_desc_content, meta_keywords, page_title);

    } else if(current_url.includes("tips/best-prediction-site")){
        title = "Best Prediction Site | 1X2, Double Chance & More";
        meta_desc_content = "Pitch Predictions is the best prediction site in the world. Get 1X2 predictions, double chance, over/under tips, and both teams to score forecasts today.";
        meta_keywords = "best prediction site, best prediction site in the world, 1X2 predictions, double chance tips, over/under predictions, both teams to score";
        page_title = "Best Prediction Site – Football Predictions by Pitch Predictions";

        meta_content_array.push(title, meta_desc_content, meta_keywords, page_title);

    } else if(current_url.includes("tips/fizzley-tips")){
        title = "Fizzley Tips | Pitch Predictions";
        meta_desc_content = "Get Fizzley Tips with today’s sure wins and tomorrow’s football picks. Stay ahead with reliable match predictions and boost your chances of winning.";
        meta_keywords = "fizzley tips, fizzley tips today sure wins, fizzley tips tomorrow, football tips, match predictions, sure wins today";
        page_title = "Fizzley Tips – Today & Tomorrow Football Picks";

        meta_content_array.push(title, meta_desc_content, meta_keywords, page_title);

    } else if(current_url.includes("tips/king-prediction")){
        title = "King Prediction Today";
        meta_desc_content = "King Predictions brings you today’s football tips, including BTTS, win, and 1X2 picks. Simple match insights to help you choose better bets.";
        meta_keywords = "king prediction, king prediction today, king prediction tips, king prediction 1x2, king prediction btts & win";
        page_title = "King Prediction Tips 1x2";

        meta_content_array.push(title, meta_desc_content, meta_keywords, page_title);

    } else if(current_url.includes("tips/accumulator-tips")){
        title = "Accumulator Tips Today – Free Football Acca Predictions | Pitch Predictions";
        meta_desc_content = "Free football accumulator tips for today. Data-driven acca predictions across the Premier League, Champions League & 700+ leagues — build your winning slip with high-confidence selections.";
        meta_keywords = "accumulator tips, accumulator tips today, sure accumulator tips, football accumulator tips";
        page_title = "Accumulator Tips Today – Free Football Acca Predictions";

        meta_content_array.push(title, meta_desc_content, meta_keywords, page_title);

    } else if(current_url.includes("tips/odd-4-sure-wins")){
        title = "Odd 4 Sure Wins Today";
        meta_desc_content = "Get Odds 4 sure wins for today with from pitch predictions. Carefully picked matches aimed at building a total odd of four with steady selections.";
        meta_keywords = "odd 4 sure wins, odd 4 sure wins free, football odd 4 tips, odd 4 predictions";
        page_title = "Odd 4 Sure Win Predictions";

        meta_content_array.push(title, meta_desc_content, meta_keywords, page_title);

    } else if(current_url ==="jackpot-predictions"){
        title = "Free Jackpot Prediction and Weekly Bonus Tips";
        meta_desc_content ="Get accurate jackpot predictions — free, data-driven tips for SportPesa, Betika, and other bookmakers to boost your winning chances and earn bonus rewards"
        meta_keywords = "Jackpot predictions, free jackpot tips, Sportpesa jackpot predictions, Betika jackpot predictions, accurate betting tips, midweek jackpot tips, mega jackpot predictions, today's jackpot tips, Sportpesa mega jackpot analysis";
        page_title = "Jackpot Tips and Predictions This Week";
        
        meta_content_array.push(title,meta_desc_content,meta_keywords,page_title);

    } else if (current_url == "jackpot-predictions/sportpesa-mega-jackpot-predictions") {
        title = "Sportpesa Mega Jackpot Predictions – Free Tips This Weekend | Pitch Predictions";
        meta_desc_content = "Free Sportpesa Mega Jackpot predictions for all 17 games this weekend. Expert 1X2 &amp; Double Chance tips backed by form, H2H &amp; squad data — updated every week before the deadline.";
        meta_keywords = "SportPesa Mega Jackpot tips, SportPesa predictions, Mega Jackpot analysis, football jackpot tips, SportPesa betting advice";
        page_title = "Sportpesa Mega Jackpot Predictions – Free Tips This Weekend";
    
        meta_content_array.push(title, meta_desc_content, meta_keywords, page_title);

    } else if (current_url == "jackpot-predictions/forebet-mega-jackpot-prediction") {
        title = "Forebet Mega Jackpot Predictions & Expert Tips - This Weekend's Games";
        meta_desc_content = "Unlock winning potential with our Forebet Mega Jackpot predictions. We provide expert analysis and tips for all 17 games to help you make smarter picks and increase your chances of a payout.";
        meta_keywords = "Forebet Mega Jackpot Prediction, Forebet Sportpesa Mega Jackpot Prediction, Mega Jackpot tips today, Forebet football tips, Forebet Mega Jackpot this weekend";
        page_title = "Forebet Sportpesa Mega Jackpot Predictions";
        
        meta_content_array.push(title, meta_desc_content, meta_keywords, page_title);

    } else if (current_url == "jackpot-predictions/sportpesa-midweek-jackpot-predictions") {
        title = "Sportpesa Midweek Jackpot Predictions – Free Tips This Week | Pitch Predictions";
        meta_desc_content = "Free Sportpesa Midweek Jackpot predictions for all 13 games this week. Expert 1X2 &amp; Double Chance tips backed by form, H2H &amp; squad data — updated every week before the deadline.";
        meta_keywords = "SportPesa Midweek Jackpot tips, Midweek Jackpot predictions, football betting insights, SportPesa stats, accurate predictions";
        page_title = "Sportpesa Midweek Jackpot Predictions – Free Tips This Week";
    
        meta_content_array.push(title, meta_desc_content, meta_keywords, page_title); 

    } else if (current_url == "jackpot-predictions/forebet-midweek-jackpot-predictions") {
        title = "Forebet Midweek Jackpot Prediction 13»X1212X1";
        meta_desc_content = "Get Forebet midweek jackpot predictions for this week. Pitch Predictions shares match picks covering all 13 games in the current jackpot round.";
        meta_keywords = "forebet midweek jackpot predictions, forebet jackpot predictions, forebet midweek jackpot predictions today";
        page_title = "Forebet Midweek Jackpot Predictions Today";
    
        meta_content_array.push(title, meta_desc_content, meta_keywords, page_title); 

    } else if (current_url == "jackpot-predictions/betika-midweek-jackpot-predictions") { 
        title = "Betika Midweek Jackpot Predictions – Free Tips This Week | Pitch Predictions";
        meta_desc_content = "Free Betika Midweek Jackpot predictions for all 15 games this week. Expert 1X2 &amp; Double Chance tips backed by form, H2H &amp; squad data — updated every week before the deadline.";
        meta_keywords = "Betika Midweek Jackpot tips, Betika predictions, Midweek Jackpot stats, accurate Betika tips, football analysis";
        page_title = "Betika Midweek Jackpot Predictions – Free Tips This Week";
    
        meta_content_array.push(title, meta_desc_content, meta_keywords, page_title);
    } else if(current_url ==="jackpot-predictions/[jackpot-predictions-by-name]"){
        if(router.isReady){
            let jackpot_name = router.query["jackpot-predictions-by-name"];

            let formattedJackpotName = jackpotNameToSentenceCase(jackpot_name);

            //Jackpots Page url descriptions (route "/jackpot-predictions/[jackpot-predictions-by-name]")
            title = formattedJackpotName + " & Expert Tips";
            meta_desc_content = "Get free " + formattedJackpotName + " with detailed match analysis and trusted betting insights. Make confident picks with Pitch Predictions.";
            meta_keywords = formattedJackpotName + ", Jackpot predictions, Jackpot tips, midweek jackpot predictions, jackpot betting tips, today’s jackpot predictions";
            page_title = "Free " + formattedJackpotName + " Predictions";


            meta_content_array.push(title,meta_desc_content,meta_keywords,page_title);
        }
    //Auth Pages url descriptions (route "/auth/[auth]")
    } else if (current_url =="auth/login") {
        title = "Login to Pitch Prediction | Free Football Betting Tips";
        meta_desc_content = "Login to Pitch Prediction today and get free football betting tips, predictions, and analysis. Join our community for accurate and reliable football betting insights.";
        meta_keywords = "Login, Football betting tips, Free football predictions, Football betting analysis, Football betting predictions, Football betting tips";
        page_title = "Login to Pitch Prediction";

        meta_content_array.push(title, meta_desc_content, meta_keywords, page_title);
    } else if (current_url =="auth/register") {
        title = "Register for Pitch Prediction | Free Football Betting Tips";
        meta_desc_content = "Register for Pitch Prediction today and get free football betting tips, predictions, and analysis. Join our community for accurate and reliable football betting insights.";
        meta_keywords = "Register, Football betting tips, Free football predictions, Football betting analysis, Football betting predictions, Football betting tips";
        page_title = "Register for Pitch Prediction";

        meta_content_array.push(title, meta_desc_content, meta_keywords, page_title);

    } else if (current_url.includes("auth")) {
        title = "Dashboard | Pitch Prediction - Football Betting Insights";
        meta_desc_content = "Access your personalized football betting insights on the Pitch Prediction Dashboard. Stay updated with accurate predictions, match analysis, and expert tips.";
        meta_keywords = "Dashboard, Football betting insights, Match analysis, Betting predictions, Football betting tips, Accurate football predictions";
        page_title = "Dashboard | Pitch Prediction";

        meta_content_array.push(title, meta_desc_content, meta_keywords, page_title);
    } else if(current_url == "blog"){

        title = "Pitch Predictions Blog: Expert Football Betting Tips & Predictions";
        meta_desc_content = "Discover expert football betting tips, match previews, and in-depth predictions on the Pitch Predictions blog. Stay ahead with insights, strategies, and weekly updates.";
        meta_keywords = "football betting blog, football predictions, betting tips, football analysis, match previews, soccer betting, football insights, Pitch Predictions blog, betting strategies";
        page_title = "Pitch Predictions Blog – Expert Tips, Predictions & Football Insights";
    
        meta_content_array.push(title, meta_desc_content, meta_keywords, page_title);    
        
    } else if(current_url ===""){
        //Homepage url descriptions (route "/")
        title = "Pitch Predictions – Free Football Tips & Match Predictions";
        meta_desc_content = "Get free, data-driven football predictions for today's matches across 700+ leagues. Expert tips, live scores, jackpot picks &amp; standings — updated daily.";
        meta_keywords = "football predictions, free football tips, football betting tips, today football predictions, match predictions, jackpot predictions, soccer predictions, premier league predictions, over 2.5 goals, BTTS tips";
        page_title = "Free Football Predictions & Tips — Data-Driven Picks for Every Match";

        meta_content_array.push(title,meta_desc_content,meta_keywords,page_title);
    }

    return meta_content_array;
}

 //function to form league name
 const removeLastIntegerPart = (str) => {
    const regex = /-\d+$/;
    const match = str.match(regex);
    if (match) {
        const integerPart = match[0];
        return str.slice(0, str.lastIndexOf(integerPart));
    } else {
        return str;
    }
};

function jackpotNameToSentenceCase(input) {
    return input
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
}

export default MetaContent;