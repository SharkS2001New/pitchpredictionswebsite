function OverUnderProbabilitiesScale(avgGoals){
    let over_under_prob_prediction = [];

    const probability_ = 90;

    let division_factor = 0;

    if(avgGoals > 10){
        division_factor = 11.0;
    }else if(avgGoals > 5.0) {
        division_factor = 8.0;
    }else {
        division_factor = 5.0;
    }

    const probability_1 = parseInt(probability_/(division_factor/avgGoals)) + 5;

    const probability_2 = (100 - probability_1);

    //push value to array
    over_under_prob_prediction.push(probability_1,probability_2);

    return over_under_prob_prediction;
}

export default OverUnderProbabilitiesScale;