import React, { useState,useEffect,useRef } from "react";
import FetchSearchResults from "../functions/search";
import Link from "next/link";
import CountNoOfmyMatches from "../functions/CountMyMatches";
import nookies from 'nookies';

function Navbar(){
    const [user, setUser] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [search_query, setSearchQuery] = useState();
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
  
    useEffect(() => {
      const cookies = nookies.get(null);
      if (cookies.user) {
        setUser(JSON.parse(cookies.user));
      }
    }, []);
  
    // Function to include token in request headers
    const setAuthToken = () => {
        const cookies = nookies.get();
        return cookies.token ? { Authorization: `Bearer ${cookies.token}` } : {};
    };

    const handleLogout = async () => {
        try {
            // Use the token for authentication
            const headers = setAuthToken();

            // Perform the POST request to logout from backend
            const response = await fetch('https://api.pitchpredictions.com/api/logout', {
                method: 'POST',
                headers: {
                    ...headers,
                    'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                throw new Error('Logout failed');
            }

            // Destroy the cookies after successful logout
            nookies.destroy(null, 'token', { path: '/' });
            nookies.destroy(null, 'user', { path: '/' });

            // Redirect to main page
            window.location.replace('/');
        } catch (error) {
            alert('Logout failed');
        }
    };

    const openSidemenu = () =>{
        document.body.classList.toggle('sb-sidenav-toggled');
        localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
    }

    //only search when query is greater than 3 characters
    const searchOnChange = (inputed_search_query)=>{
        if(inputed_search_query.length >= 3){
            setSearchQuery(inputed_search_query)
            //Call the search function and execute promise with .then in order to read the results
            FetchSearchResults(inputed_search_query).then(response => {
                setSearchResults(response);
            });
        }
    }
    
    //set array to null on search a select
    const closeForm = ()=> {
        setSearchResults([]);
        //Clear search input
        document.getElementById("searchInput").value = "";
    }

    return( 
        <React.Fragment>
        <div className="d-md-flex d-sm-block align-items-center gap-4" style={{backgroundColor: "#202c3c", color: "white"}}>
        <div className="container">
            <header className="d-flex justify-content-between align-items-center mb-0">
                <div className="d-md-flex">
                    <a
                        className="btn btn-outline-dark btn-floating m-1"
                        href="https://www.facebook.com/profile.php?id=100094600476269"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Facebook"
                        style={{ borderColor: "#05386B" }}>
                        <i className="bi bi-facebook text-light"></i>
                    </a>
                    <a
                        className="btn btn-outline-dark btn-floating m-1"
                        href="https://t.me/betsassuredkenya"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Telegram"
                        style={{ borderColor: "#05386B" }}>
                        <i className="bi bi-telegram text-light"></i>
                    </a>
                    <a
                        className="btn btn-outline-dark btn-floating m-1"
                        href="https://api.whatsapp.com/send/?phone=254111509962&text=Hello&type=phone_number&app_absent=0"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="WhatsApp"
                        style={{ borderColor: "#05386B" }}>
                        <i className="bi bi-whatsapp text-light"></i>
                    </a>
                </div>
                {/* Login and register buttons */}
                <div className="d-md-flex d-sm-block m-2">
                {user ? (
                    // Show Logout button if token exists
                    <>
                    <a href="/auth/dashboard" 
                        className="btn btn-outline-secondary btn-sm p-1 me-3" style={{
                            backgroundColor: '#fff',
                            borderColor: '#000',
                            color: '#000',
                            fontWeight: 'bold',
                        }}>
                        &nbsp;Dashboard&nbsp;
                    </a>
                    <button onClick={handleLogout}
                        className="btn btn-danger btn-sm p-1 me-3" style={{ fontWeight: 'bold' }}>
                        Logout
                    </button>
                    </>                  
                    ) : (
                    // Show Login and Register buttons if no token
                    <>
                        <a href="/auth/login" 
                            className="btn btn-danger btn-sm p-1 me-3" style={{ fontWeight: 'bold' }}>
                            Login
                        </a>
                        <a href="/auth/register"
                            className="btn btn-secondary btn-sm p-1 me-1" style={{ fontWeight: 'bold' }}>
                            Register
                        </a>
                    </>
                    )}                      
                </div>
            </header>
        </div>
    </div>
    <nav className="navbar navbar-expand-lg navbar-dark sideNavCustom1" style={{backgroundColor:"#202c3c"}} onClick={closeForm}> {/**Added on click here in order to allow close form when nav bar is clicked */}
        <div className="container desktop-container-resize mb-2">
            <div className="d-none d-xl-block d-lg-block mt-2" style={{height: "100%", width:"21%",display: "block"}}>
                <a className="navbar-brand" href="/"><img src="/pitch-predictions-logo.png" style={{height:"100%", width:"100%"}}  alt="logo"/></a>
            </div>
            <button className="btn btn-primary d-lg-none"  aria-label="menu" id="sidebarToggle" onClick={openSidemenu} style={{backgroundColor: "#00000000",borderColor: "#ffffff1a"}}><span className="navbar-toggler-icon" role="button" aria-label="Toggle navigation"></span></button>
            <div className="d-lg-none" style={{height: "100%", width:"60%",objectFit: "contain"}}>
                <a className="navbar-brand d-lg-none" href="/"><img src="/pitch-predictions-logo.png" height="100%" width="100%" alt="logo"/></a> 
            </div>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#searchBar"  aria-controls="navbarSupportedContent" aria-expanded="false" role="button" aria-label="Toggle navigation">
                <i className="bi bi-search" role="button" aria-hidden="true"></i>
            </button>
            {/**Navbar Links**/}
            <div className="collapse navbar-collapse d-none d-xl-block d-lg-block">
                <ul className="navbar-nav text-center">
                    <li className="nav-item">
                        &nbsp;&nbsp;&nbsp;
                    </li>
                    <li className="nav-item">
                        &nbsp;&nbsp;&nbsp;
                    </li>
                    <li className="nav-item">
                        <a className="nav-link text-light" href="/">Home</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link text-light" href="/live-football-predictions">Livescores</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link text-light" href="/my-favourite-predictions"><i className="bi bi-star"></i> Favourites&nbsp;
                        <span className="number-circle rounded-square fixturesTextSize" style={{ backgroundColor: "white", color: "red", fontWeight: "bold", fontSize:"14px" }}>
                            {noofMyMatches}
                        </span>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link text-light" href="/team-comparison">Team Comparisons</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link text-light" href="/top-football-tips-and-predictions/today">Top Predictions</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link text-light" href="/jackpot-predictions">Jackpot Predictions</a>
                    </li>
                </ul>
            </div>
            {/* Search form*/}
            <div className="collapse navbar-collapse fixturesTextSize" id="searchBar" style={{flexGrow:"0"}}>
                 <br/>
                 <form className="d-flex" onSubmit={e => { e.preventDefault(); }}>
                    <input className="form-control h-100" type="text" onChange={(e) => searchOnChange(e.target.value)} placeholder="Type Min. 3 charcters to search..." id="searchInput"/>
                    {/* Binding search results as floating div data */}
                    {searchResults.length > 0 ?
                    <div  id="searchResultsForm" style={{backgroundColor: "#202c3c"}}>
                        {searchResults.slice(0, 10).map((result, index) => (
                            <div key={index}>
                                 {result.search_group == "team" ?
                                    <a href={encodeURI("/team/"
                                     + result.search_res_name.toLowerCase().replace(/\s+/g, '-')
                                     +"-"+result.search_res_id)+"/results"}
                                      className="ml-2 searchboxTxt4" onClick={closeForm}>
                                    <div className="responsive-row searchboxTxt2 m-2">                                    
                                        <div className="col-10">                                
                                            {result.search_res_name}
                                        </div>
                                        <div className="col-2">     
                                            {result.search_group}                       
                                        </div>                                   
                                    </div>
                                    </a>
                                 :
                                 result.search_group == "country" ? 
                                    <a 
                                        href={encodeURI("/country/football-predictions-for-" + result.search_res_name.toLowerCase())+"/fixtures"}
                                        className="ml-2 searchboxTxt4" onClick={closeForm}>
                                     <div className="responsive-row searchboxTxt2 m-2">                                    
                                        <div className="col-10">                                
                                            {result.search_res_name}
                                        </div>
                                        <div className="col-2">     
                                            {result.search_group}                       
                                        </div>                                   
                                    </div>                   
                                    </a>
                                 : 
                                 result.search_group == "league" ?
                                 <a
                                    href={"/league/football-predictions-for-"+result.search_country.toLowerCase()+"/"+encodeURIComponent(result.search_res_name.toLowerCase().replace(/\s+/g, '-'))+'-'+result.search_res_id+"/fixtures"}
                                    className="ml-2 searchboxTxt4" onClick={closeForm}>
                                    <div className="responsive-row searchboxTxt2 m-2">                                    
                                        <div className="col-10">                                
                                            {result.search_res_name} <span style={{color:"indianred"}}>({result.search_country})</span>
                                        </div>
                                        <div className="col-2">     
                                            {result.search_group}                       
                                        </div>                                   
                                    </div> 
                                </a>
                                :
                                result.search_group == "fixture" ?
                                <a href={'/match/football-predictions-' + 
                                    encodeURIComponent(result.search_res_name.split(' VS ')[0].replace(/\s+/g, '-').toLowerCase()
                                    +'vs'+result.search_res_name.split(' VS ')[1].replace(/\s+/g, '-').toLowerCase()
                                    +'-'+result.search_res_id)+"/matches"} 
                                    className="ml-2 searchboxTxt4" onClick={closeForm}>
                                      <div className="responsive-row searchboxTxt2 m-2">                                    
                                        <div className="col-10" style={{whiteSpace:"pre-wrap"}}>                                
                                            {result.search_res_name} <span style={{color:"white"}}>({result.search_res_date})</span>
                                        </div>
                                        <div className="col-2">     
                                            {"match"} {/**result.search_group */}                       
                                        </div>                                   
                                    </div> 
                                </a>
                                : ""
                                }                               
                            </div>
                        ))}
                        {searchResults.length > 10 &&
                        <div className="container">                             
                            <div className="row searchboxTxt2">   
                                <Link
                                    className="btn btn-link btn-sm searchboxTxt" 
                                    href={{
                                        pathname: "/showing-all-search-results", 
                                        search: `query=${search_query}`
                                    }} 
                                    style={{borderRadius:"8px",color:"white", fontWeight: "bold"}} onClick={closeForm}>
                                    Show All Results
                                </Link>
                            </div>
                        </div>
                        }
                    </div>
                    : ""
                    }
                </form>
            </div>
        </div>
    </nav>
    </React.Fragment>
    )
}

export default Navbar;