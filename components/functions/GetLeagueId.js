function GetLeagueId(router){
    let leagueId = "";
    let league_name = "";
    let country_name = "";

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

    if(router.isReady){
        if(router.pathname.substring(1).includes("league/[country-name]/[football-prediction-for-league]")){
            let league_name_url = router.query["football-prediction-for-league"];  
       

            //if url has no id, redirect to homepage
            if(league_name_url.match(/-(\d+)$/)){
                league_name = removeLastIntegerPart(league_name_url); //get league name from url
                //country name
                const query_link = router.query["country-name"];
                const prefix = "football-predictions-for-";
                country_name = query_link.substring(prefix.length);
    
                leagueId = parseInt(league_name_url.match(/-(\d+)$/)[1]);//get league id from the url
            }else{
                router.push('/', undefined, { 
                    statusCode: 301
                })
            } 
        }else{
            leagueId =0;
        }        
    }

    return leagueId;
}

export default GetLeagueId;