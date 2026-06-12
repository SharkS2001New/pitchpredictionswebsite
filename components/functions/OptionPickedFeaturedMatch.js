function OptionPickedFeaturedMatch(percent_pred_home, percent_pred_draw, percent_pred_away, average_goals) {
    let optionPicked = "";

    // Check average goals for Over/Under prediction
    if (average_goals > 3.3) {
        optionPicked = "Over2.5";
    } else if (average_goals < 1.8) {
        optionPicked = "Under2.5";
    } else {
        // If Over/Under conditions are not met, determine 1X2 options
        // Convert percentages to numbers (remove the "%" sign)
        const homeWin = parseFloat(percent_pred_home);
        const draw = parseFloat(percent_pred_draw);
        const awayWin = parseFloat(percent_pred_away);

        // Determine the most likely outcome
        if (homeWin > draw && homeWin > awayWin) {
            optionPicked = "1"; // Home Win
        } else if (draw > homeWin && draw > awayWin) {
            optionPicked = "X"; // Draw
        } else if (awayWin > homeWin && awayWin > draw) {
            optionPicked = "2"; // Away Win
        } else {
            // If probabilities are equal or unclear, apply Double Chance logic
            if (homeWin + draw > awayWin + draw && homeWin + draw > homeWin + awayWin) {
                optionPicked = "1X"; // Home Win or Draw
            } else if (awayWin + draw > homeWin + draw && awayWin + draw > homeWin + awayWin) {
                optionPicked = "X2"; // Draw or Away Win
            } else {
                optionPicked = "12"; // Home Win or Away Win
            }
        }

        // Double Chance logic if no single outcome is above 55%
        if (homeWin < 55 && draw < 55 && awayWin < 55) {
            if (homeWin + draw > awayWin + draw && homeWin + draw > homeWin + awayWin) {
                optionPicked = "1X"; // Home Win or Draw
            } else if (awayWin + draw > homeWin + draw && awayWin + draw > homeWin + awayWin) {
                optionPicked = "X2"; // Draw or Away Win
            } else {
                optionPicked = "12"; // Home Win or Away Win
            }
        }
    }

    return optionPicked;
}

export default OptionPickedFeaturedMatch;