//Fetch  top details data
async function getMatchDetailsTopData(url) {
    const headers =  {
        "Content-type": "application/json; charset=UTF-8",
        "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2"
    }

    //Fetch fixtures 
    const response = await fetch(url,{
        headers:headers
    });

    var data = await response.json();  

    var processing_data = data.data;
    
    return processing_data;
}

export default getMatchDetailsTopData;