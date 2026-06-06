import { useState,useEffect,useRef } from "react";
import useCompatRouter from "../functions/use-compat-router";
import CountNoOfmyMatches from "../functions/CountMyMatches";
import CustomDatePicker from "./CustomDatePicker";

function Scrollnav(){
    var router = useCompatRouter();
    const [noofMyMatches,setNumberOfMymatches] = useState(0);
    const [favMatchesUpdateCounter, setfavMatchesUpdateCounter] = useState(0);
   
   const mounted = useRef(false);
 
   useEffect(()=>{
         // Set an initial value for the counter
         let count = 0;
         // Set up an interval to update the counter every 1 seconds
         const intervalId = setInterval(() => {
           // Update the counter
           count++;
           // Update the liveCounter state with the new count value
           setfavMatchesUpdateCounter(count);
         }, 100);

         // Fetch data on mount only after the first render
        if (mounted.current) {
            setNumberOfMymatches(CountNoOfmyMatches());

        } else {
            mounted.current = true;
        }
      
        // Return a cleanup function to clear the interval
        return () => clearInterval(intervalId);
   },[favMatchesUpdateCounter])

    //Refresh the number of my matches count on click
    const refreshMyMatchesCountOnNavigation  =  () => {
        setNumberOfMymatches(CountNoOfmyMatches())
    }
 
   return ( 
    <div className="row d-block d-lg-none" style={{ margin: "auto", paddingTop: "5px", border: "1px solid white", borderRadius: "3px", backgroundColor: "white" }}>
        <div className="col-lg-12 col-sm-12 o-hidden"> 
        <div onClick={refreshMyMatchesCountOnNavigation} className="nav scrollable nav-fill small position-relative flex-nowrap fixturesTextSize">
            <a href="/football-predictions-today" className={`nav-link scroll-card ${router.pathname.substring(1) === "football-predictions-today" ? "activeElement" : ""}`}>
                Today
            </a> 
            <a href="/live-football-predictions" className={`nav-link scroll-card ${router.pathname.substring(1) === "live-football-predictions" ? "activeElement" : ""}`}>
                Live
            </a>
            <a href="/my-favourite-predictions" className={`nav-link scroll-card ${router.pathname.substring(1) === "my-favourite-predictions" ? "activeElement" : ""}`}>
                My <i className="bi bi-star"></i> &nbsp;
            <span className="number-circle rounded-square fixturesTextSize" style={{ backgroundColor: "white", color: "black", fontWeight: "bold", fontSize: "12px" }}>
                {noofMyMatches}
            </span>
            </a>
            <a href="/top-football-tips-and-predictions/today" className={`nav-link scroll-card ${router.pathname.substring(1) === "top-football-tips-and-predictions/today" ? "activeElement" : ""}`}>
                Top Picks
            </a>
            <a href="/football-predictions-tomorrow" className={`nav-link scroll-card ${router.pathname.substring(1) === "football-predictions-tomorrow" ? "activeElement" : ""}`}>
                Tomorrow
            </a>
            <a href="/football-predictions-yesterday" className={`nav-link scroll-card ${router.pathname.substring(1) === "football-predictions-yesterday" ? "activeElement" : ""}`}>
                Yesterday
            </a>
            <a href="/football-predictions-weekend" className={`nav-link scroll-card ${router.pathname.substring(1) === "football-predictions-weekend" ? "activeElement" : ""}`}>
                Weekend
            </a>
            <a href="/team-comparison" className={`nav-link scroll-card ${router.pathname.substring(1) === "team-comparison" ? "activeElement" : ""}`}>
                Compare Teams
            </a>
            <a href="/jackpot-predictions" className={`nav-link scroll-card ${router.pathname.substring(1) === "jackpots" ? "activeElement" : ""}`}>
                Jackpots
            </a>
        </div>
        </div>
        <div className="col-sm-12 datePicker" id="datePickerT">
            <CustomDatePicker/>
        </div>
    </div>
    )
}

export default Scrollnav;