function CheckiffixtureIsSelected(fixtureId) {
    let dataarray  = JSON.parse(localStorage.getItem("myselectedfavoritematchesdata"));

    if(dataarray !== null){
        const containsFixture = dataarray.some(fixture => fixture.fixture_id === parseInt(fixtureId));
        
        return containsFixture;
    }  
}

export default CheckiffixtureIsSelected;