function CountNoOfmyMatches() {
    if(window !=undefined){
        if(JSON.parse(localStorage.getItem("myselectedfavoritematchesdata")) !== null){
            var numberOfSelectedMatches = JSON.parse(localStorage.getItem("myselectedfavoritematchesdata")).length;
    
            return numberOfSelectedMatches;
        }else{
            return 0;
        }  
    }
}
export default CountNoOfmyMatches;
