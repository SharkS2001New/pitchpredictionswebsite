function ReturnSlugFromJackpotName(jackpotName) {
    const jackpotSlugMapping = {
        "Sportpesa Mega Jackpot": "sportpesa-mega-jackpot-predictions",
        "Sportpesa Midweek Jackpot": "sportpesa-midweek-jackpot-predictions",
        "Betika Mega Jackpot": "betika-grand-jackpot-predictions",
        "Betika Midweek Jackpot": "betika-midweek-jackpot-predictions",
        // "Betika Sababisha Jackpot": "betika-sababisha-jackpot-predictions",
        "Odibet Laki Tatu Jackpot": "odibet-laki-tatu-daily-jackpot-predictions",
        "Mozzart Super Daily Jackpot": "mozzart-super-daily-jackpot-predictions",
        "Mozzart Bet Grand Jackpot": "mozzart-super-grand-jackpot-predictions",
        "Shabiki Midweek Jackpot": "shabiki-jackpot-predictions",
        "Sporty bet Jackpot": "sportybet-jackpot-predictions",
        "Betlion Daily Jackpot": "betlion-daily-jp-jackpot-predictions",
        // "Betlion Goliath Jackpot": "betlion-goliath-jackpot-predictions",
        "Betika Kitonga Tanzania": "betika-kitonga-jackpot-tz",
        "Sportpesa Midweek Tanzania Jackpot": "sportpesa-supa-jackpot-13-predictions-tz",
        "Sportpesa Supa Jackpot Tanzania": "sportpesa-supa-jackpot-17-predictions-tz",
        "Betway Uganda Jackpot": "betway-jackpot-predictions-kenya",
        "Betway Kenya Jackpot": "betway-jackpot-predictions-kenya",
        "Betway Tanzania Jackpot": "betway-jackpot-predictions-tanzania",
        "Betsafe Daily Jackpot": "betsafe-daily-jackpot-predictions",
        "Betsafe Mita Tano Jackpot": "betsafe-mita-tano-jackpot-predictions",
        "22 Bet Toto Jackpot": "22-bet-toto-jackpot-predictions",
        "Bet9ja Supa9ja Jackpot": "bet9ja-supa9ja-jackpot-predictions",
        "1XBet Toto 15 Jackpot": "1xbet-toto-15-jackpot-predictions",
        "Merrybet Jackpot": "merrybet-jackpot-predictions",
        "BetKing Jackpot": "betking-jackpot-predictions",
        "Betpawa Pick13 Jackpot": "betpawa-pick13-jackpot-predictions-kenya",
        "Betpawa Pick 17 Jackpot": "betpawa-pick17-jackpot-predictions-kenya",
        "Unknown Jackpot": "", 
    };
        
    return jackpotSlugMapping[jackpotName] || "";
}

export default ReturnSlugFromJackpotName;