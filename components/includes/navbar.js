import React, { useState, useEffect, useRef } from "react";
import CountNoOfmyMatches from "../functions/CountMyMatches";
import nookies from 'nookies';
import SearchModal from "../shared/SearchModal";

function Navbar(){
    const [user, setUser] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [search_query, setSearchQuery] = useState();
    const [noofMyMatches,setNumberOfMymatches] = useState(0);
    const [favMatchesUpdateCounter, setfavMatchesUpdateCounter] = useState(0);
    const [showSearchModal, setShowSearchModal] = useState(false);
   
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

    const openSearchModal = () => {
        setShowSearchModal(true);
        // Prevent body scrolling when modal is open (optional)
        document.body.style.overflow = 'hidden';
    };

    const closeSearchModal = () => {
        setShowSearchModal(false);
        // Restore body scrolling
        document.body.style.overflow = 'unset';
    };

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

            <nav className="navbar navbar-expand-lg navbar-dark sideNavCustom1" style={{backgroundColor:"#202c3c"}}>
                <div className="container desktop-container-resize mb-2">
                    <div className="d-none d-xl-block d-lg-block mt-2" style={{height: "100%", width:"21%",display: "block"}}>
                        <a className="navbar-brand" href="/">
                            <img src="/pitch-predictions-logo.png" style={{height:"100%", width:"100%"}} alt="logo"/>
                        </a>
                    </div>
                    
                    <button className="btn btn-primary d-lg-none" aria-label="menu" id="sidebarToggle" onClick={openSidemenu} style={{backgroundColor: "#00000000",borderColor: "#ffffff1a"}}>
                        <span className="navbar-toggler-icon" role="button" aria-label="Toggle navigation"></span>
                    </button>
                    
                    <div className="d-lg-none" style={{height: "100%", width:"60%",objectFit: "contain"}}>
                        <a className="navbar-brand d-lg-none" href="/">
                            <img src="/pitch-predictions-logo.png" height="100%" width="100%" alt="logo"/>
                        </a> 
                    </div>

                    <button className="navbar-toggler" type="button" onClick={openSearchModal}>
                        <i className="bi bi-search" role="button" aria-hidden="true"></i>
                    </button>

                    {/**Navbar Links and Search - Keep original layout */}
                    <div className="collapse navbar-collapse" id="navbarContent">
                        <ul className="navbar-nav text-center me-auto">
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
                                <a className="nav-link text-light" href="/my-favourite-predictions">
                                    <i className="bi bi-star"></i> Favourites&nbsp;
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

                        {/* Desktop Search Button */}
                        <button 
                            className="btn btn-light d-none d-lg-block ms-2" 
                            onClick={openSearchModal}
                            style={{
                                borderColor: "#ffffff1a",
                                padding: "3px 16px"
                            }}>
                            <i className="bi bi-search me-1" aria-hidden="true"></i>
                            Search
                        </button>
                    </div>
                </div>
            </nav>

            {/* Search Modal Component - No ref needed */}
            <SearchModal 
                isOpen={showSearchModal} 
                onClose={closeSearchModal} 
            />
        </React.Fragment>
    )
}

export default Navbar;