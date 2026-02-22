import React from 'react';
import { useState,useEffect } from 'react';
import PreLoader from '../includes/loader';

function  LeaguesDetailsTop(props){    
    const [isMobile, setIsMobile] = useState(false);

    useEffect(()=>{
      window.screen.width <= 768 ? setIsMobile(true) : setIsMobile(false);
    })

    let league_details = props

    console.log(league_details.league_logo)
    if(league_details  !=undefined){
       // form the dynamic url     
        return (
            <React.Fragment>
                <div className="col-sm-12 text-left text-nowrap pb-1 pt-1 mb-2">
                    <div className='container'>
                        <img src={league_details.country_logo}  className="img-fluid league-logo" alt={league_details.country_name + "-football-predictions"} loading="lazy" />&nbsp;

                        <span style={{fontWeight:"bold",whiteSpace:"break-spaces"}} className="fixturesTextSize">
                            <a href={encodeURI("/country/football-predictions-for-" + league_details.country_name.toLowerCase()+"/fixtures")} className="ml-2 linkTxt">{league_details.country_name.toUpperCase()}</a>
                        </span>
                    </div>
                </div>
                <div className="row mb-3">                   
                    <div className="col-md-6 col-sm-12" style={{textAlign:"left"}}>  
                        <div className="row container">
                            <div className="col-3">
                                <img src={league_details.league_logo} alt={league_details.league_name +  "-predictions-and-fixtures"} className="heading__logo" style={{ height: 'auto', width: 'auto', maxWidth: '100%', maxHeight: '100%' }}/>
                            </div>
                            <div className="col-9">
                                <span style={{fontWeight:"bold",whiteSpace:"pre-wrap"}}>{league_details.league_name}</span><br/><br/>
                            </div>
                        </div>              
                    </div>
                    <div className="col-md-3 col-sm-0"></div>                   
                </div>    
            </React.Fragment>
        )
    }else{
        <PreLoader/>
    }

}

export default LeaguesDetailsTop;