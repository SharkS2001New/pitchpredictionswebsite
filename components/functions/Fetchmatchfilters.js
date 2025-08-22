const headers = { "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2" }; // This is the authorization header from the backend.sokapedia.com

 //Fetch filters
 async function getFilters(url_for_filters) {
    //Fetch fixtures 
    const response = await fetch(url_for_filters,{
        headers:headers
    });

    var data = await response.json();  

    var processing_data = data.data;

    return processing_data[0];
}

export default getFilters;