   //Fetch filters
   const headers =  {
    "Content-type": "application/json; charset=UTF-8",
    Origin: "https://www.pitchpredictions.com", Authorization: `Bearer ${process.env.ACCESS_TOKEN || "UJlhuDILIR1Lc2IEwZDIKOln9d"}`
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