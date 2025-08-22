function ReturnJackpotNameSavedInDB(current_url) { 
    if (current_url == 'jackpot-predictions/sportpesa-mega-jackpot-predictions') { 
        return "Sportpesa Mega Jackpot";
    } else if (current_url == 'jackpot-predictions/sportpesa-midweek-jackpot-predictions') {
        return "Sportpesa Midweek Jackpot";
    } else if (current_url == 'jackpot-predictions/betika-grand-jackpot-predictions') {
        return "Betika Mega Jackpot";
    } else if (current_url == 'jackpot-predictions/betika-midweek-jackpot-predictions') {
        return "Betika Midweek Jackpot"; 
    } else if (current_url == 'jackpot-predictions/betika-sababisha-jackpot-predictions') {
        return "Betika Sababisha Jackpot";
    } else if (current_url == 'jackpot-predictions/odibet-laki-tatu-daily-jackpot-predictions') {
        return "Odibet Laki Tatu Jackpot";
    } else if (current_url == 'jackpot-predictions/mozzart-super-daily-jackpot-predictions') { 
        return "Mozzart Super Daily Jackpot";
    } else if (current_url == 'jackpot-predictions/mozzart-super-grand-jackpot-predictions') {
        return "Mozzart Bet Grand Jackpot";
    } else if (current_url == 'jackpot-predictions/shabiki-jackpot-predictions') {
        return "Shabiki Midweek Jackpot";
    } else if (current_url == 'jackpot-predictions/sportybet-jackpot-predictions') {
        return "Sporty bet Jackpot";
    } else if (current_url == 'jackpot-predictions/betlion-daily-jp-jackpot-predictions') {
        return "Betlion Daily Jackpot";
    } else if (current_url == 'jackpot-predictions/betlion-goliath-jackpot-predictions') {
        return "Betlion Goliath Jackpot";
    } else if (current_url == 'jackpot-predictions/betika-kitonga-jackpot-tz') {
        return "Betika Kitonga Tanzania";
    } else if (current_url == 'jackpot-predictions/sportpesa-supa-jackpot-13-predictions-tz') {
        return "Sportpesa Midweek Tanzania Jackpot";
    } else if (current_url == 'jackpot-predictions/sportpesa-supa-jackpot-17-predictions-tz') {
        return "Sportpesa Supa Jackpot Tanzania";
    } else if (current_url == 'jackpot-predictions/betway-jackpot-predictions-uganda') {
        return "Betway Uganda Jackpot";
    } else if (current_url == 'jackpot-predictions/betway-jackpot-predictions-kenya') {
        return "Betway Kenya Jackpot";
    } else if (current_url == 'jackpot-predictions/betway-jackpot-predictions-tanzania') {
        return "Betway Tanzania Jackpot";
    } else if (current_url == 'jackpot-predictions/betsafe-daily-jackpot-predictions') {
        return "Betsafe Daily Jackpot";
    } else if (current_url == 'jackpot-predictions/betsafe-mita-tano-jackpot-predictions') { 
        return "Betsafe Mita Tano Jackpot";
    } else if (current_url == 'jackpot-predictions/22-bet-toto-jackpot-predictions') {
        return "22 Bet Toto Jackpot"; 
    } else if (current_url == 'jackpot-predictions/bet9ja-supa9ja-jackpot-predictions') {
        return "Bet9ja Supa9ja Jackpot"; 
    } else if (current_url == 'jackpot-predictions/1xbet-toto-15-jackpot-predictions') {
        return "1XBet Toto 15 Jackpot"; 
    } else if (current_url == 'jackpot-predictions/merrybet-jackpot-predictions') {
        return "MerryBet Jackpot"; 
    } else if (current_url == 'jackpot-predictions/betking-jackpot-predictions') {
        return "BetKing Jackpot"; 
    } else if (current_url == 'jackpot-predictions/betpawa-pick13-jackpot-predictions-uganda' || current_url === "jackpot-predictions/betpawa-pick13-jackpot-predictions-nigeria" || current_url ==="jackpot-predictions/betpawa-pick13-jackpot-predictions-kenya" || current_url ==="jackpot-predictions/betpawa-pick13-jackpot-predictions-dr-congo"
        || current_url==="jackpot-predictions/betpawa-pick13-jackpot-predictions-tanzania" || current_url ==="jackpot-predictions/betpawa-pick13-jackpot-predictions-zambia" || current_url==="jackpot-predictions/betpawa-pick13-jackpot-predictions-ghana" || current_url==="jackpot-predictions/betpawa-pick13-jackpot-predictions-cameroon") {
            
        return "Betpawa Pick13 Jackpot";

    }else if (current_url == 'jackpot-predictions/betpawa-pick17-jackpot-predictions-uganda' || current_url === "jackpot-predictions/betpawa-pick17-jackpot-predictions-nigeria" || current_url ==="jackpot-predictions/betpawa-pick17-jackpot-predictions-kenya" || current_url ==="jackpot-predictions/betpawa-pick17-jackpot-predictions-dr-congo"
    || current_url==="jackpot-predictions/betpawa-pick17-jackpot-predictions-tanzania" || current_url ==="jackpot-predictions/betpawa-pick17-jackpot-predictions-zambia" || current_url==="jackpot-predictions/betpawa-pick17-jackpot-predictions-ghana" || current_url==="jackpot-predictions/betpawa-pick17-jackpot-predictions-cameroon") {
        
        return "Betpawa Pick 17 Jackpot";

    }else {
        return "Unknown Jackpot";
    }
}

export default ReturnJackpotNameSavedInDB;
