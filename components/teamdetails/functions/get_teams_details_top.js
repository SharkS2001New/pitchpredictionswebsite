   //Fetch filters
   const headers =  {
    "Content-type": "application/json; charset=UTF-8",
    "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2"
}

async function getTeamsDetailsTop(team_details_top_url) {
    //Fetch fixtures 
    const response = await fetch(team_details_top_url,{
        headers: headers
    });

    var data = await response.json();  

    var processing_data = data.data;

    return processing_data;
}

export default getTeamsDetailsTop;