import React from 'react';
import PreLoader from '../includes/loader';

function  CountriesDetailsTop(props){    
    let country_details = props.props

    if(country_details  !=undefined){
       // form the dynamic url     
        return (
            <React.Fragment>
                <div className="col-sm-12 text-left text-nowrap">
                    <div className='container'>
                        <img src={country_details.downloaded_country_flag}  className="img-fluid league-logo" alt={country_details.country_name + "-football-predictions"} loading="lazy" />&nbsp;

                        <span style={{fontWeight:"bold",whiteSpace:"break-spaces"}} className="fixturesTextSize">
                            <a href={encodeURI("/country/football-predictions-for-" + country_details.country_name.toLowerCase()+"/fixtures")} className="ml-2 linkTxt">{country_details.country_name.toUpperCase()}</a>
                        </span>
                    </div>
                </div>
            </React.Fragment>
        )
    }else{
        return <PreLoader/>
    }

}

export default CountriesDetailsTop;