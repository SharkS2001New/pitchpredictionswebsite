const getJackpotNameFromSlug = (slug) => {
    const slugToJackpotName = {
      'sportpesa-mega-jackpot-predictions': 'Sportpesa Mega Jackpot Predictions',
      'sportpesa-midweek-jackpot-predictions': 'Sportpesa Midweek Jackpot Predictions',
      'sportpesa-supa-jackpot-17-predictions-tz': 'Sportpesa Tanzania Supa Jackpot 17 Predictions',
      'sportpesa-supa-jackpot-13-predictions-tz': 'Sportpesa Tanzania Supa Jackpot 13 Predictions',
      // 'betika-sababisha-jackpot-predictions': 'Betika Sababisha Jackpot Predictions',
      'betika-midweek-jackpot-predictions': 'Betika Midweek Jackpot Predictions',
      'betika-grand-jackpot-predictions': 'Betika Grand Jackpot Predictions',
      'betika-kitonga-jackpot-tz': 'Betika Kitonga Jackpot Tanzania',
      'mozzart-super-grand-jackpot-predictions': 'Mozzart Super Grand Jackpot Predictions',
      'mozzart-super-daily-jackpot-predictions': 'Mozzart Super Daily Jackpot Predictions',
      'shabiki-jackpot-predictions': 'Shabiki Jackpot Predictions',
      'odibet-laki-tatu-daily-jackpot-predictions': 'Odibet Laki Tatu Daily Jackpot Predictions',
      'sportybet-jackpot-predictions': 'Sportybet Jackpot Predictions',
      'betlion-daily-jp-jackpot-predictions': 'Betlion Daily JP Jackpot Predictions',
      'betlion-goliath-jackpot-predictions': 'Betlion Goliath Jackpot Predictions',
      'betpawa-pick13-jackpot-predictions-uganda': 'Betpawa Pick 13 Jackpot Predictions Uganda',
      'betpawa-pick17-jackpot-predictions-uganda': 'Betpawa Pick 17 Jackpot Predictions Uganda',
      'betpawa-pick13-jackpot-predictions-nigeria': 'Betpawa Pick 13 Jackpot Predictions Nigeria',
      'betpawa-pick17-jackpot-predictions-nigeria': 'Betpawa Pick 17 Jackpot Predictions Nigeria',
      'betpawa-pick13-jackpot-predictions-kenya': 'Betpawa Pick 13 Jackpot Predictions Kenya',
      'betpawa-pick17-jackpot-predictions-kenya': 'Betpawa Pick 17 Jackpot Predictions Kenya',
      'betpawa-pick13-jackpot-predictions-tanzania': 'Betpawa Pick 13 Jackpot Predictions Tanzania',
      'betpawa-pick17-jackpot-predictions-tanzania': 'Betpawa Pick 17 Jackpot Predictions Tanzania',
      'betpawa-pick13-jackpot-predictions-zambia': 'Betpawa Pick 13 Jackpot Predictions Zambia',
      'betpawa-pick17-jackpot-predictions-zambia': 'Betpawa Pick 17 Jackpot Predictions Zambia',
      'betpawa-pick13-jackpot-predictions-ghana': 'Betpawa Pick 13 Jackpot Predictions Ghana',
      'betpawa-pick17-jackpot-predictions-ghana': 'Betpawa Pick 17 Jackpot Predictions Ghana',
      'betpawa-pick13-jackpot-predictions-cameroon': 'Betpawa Pick 13 Jackpot Predictions Cameroon',
      'betpawa-pick17-jackpot-predictions-cameroon': 'Betpawa Pick 17 Jackpot Predictions Cameroon',
      'betpawa-pick13-jackpot-predictions-dr-congo': 'Betpawa Pick 13 Jackpot Predictions DR Congo',
      'betpawa-pick17-jackpot-predictions-dr-congo': 'Betpawa Pick 17 Jackpot Predictions DR Congo',
      'betway-jackpot-predictions-uganda': 'Betway Jackpot Predictions Uganda',
      'betway-jackpot-predictions-kenya': 'Betway Jackpot Predictions Kenya',
      'betway-jackpot-predictions-tanzania': 'Betway Jackpot Predictions Tanzania',
      '22-bet-toto-jackpot-predictions': '22 Bet Toto Jackpot Predictions',
      'bet9ja-super9ja-jackpot-predictions': 'Bet9ja Super9ja Jackpot Predictions',
      '1xbet-toto-15-jackpot-predictions': '1XBet Toto 15 Jackpot Predictions',
      'merrybet-jackpot-predictions': 'MerryBet Jackpot Predictions',
      'betking-jackpot-predictions': 'BetKing Jackpot Predictions',
      'betsafe-daily-jackpot-predictions': 'Betsafe Daily Jackpot Predictions',
      'betsafe-mita-tano-jackpot-predictions': 'Betsafe Mita Tano Jackpot Predictions'
    };
  
    return slugToJackpotName[slug] || null;
};

export default getJackpotNameFromSlug;
