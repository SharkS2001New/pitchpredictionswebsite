//create the first myselectedfavoritematchesdata data based on the fixture id's selections
async function FetchFixtureByIdMyFav(myselectedids) {
    const headers =  {
        "Content-type": "application/json; charset=UTF-8",
        "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2"
    }

    try {            
        const response1 = await fetch("https://api.pitchpredictions.com/api/fetch_fixtures_by_id",{
            method: 'POST',
            body: JSON.stringify({fixture_id:  myselectedids}),
            headers: headers
        });
        
        const data1 = await response1.json();  
        
        if(data1.status === true){
            const selected_f_data = data1.data;

            //store favorite prediction matches in a local storage array
            localStorage.setItem("myselectedfavoritematchesdata", JSON.stringify(selected_f_data))
        }
    } catch (error) {
        console.error(error);
    }
}

export default FetchFixtureByIdMyFav;
