import FetchSearchResults from "../components/functions/search";
import { useRouter } from "next/router";
import React,{useState,useEffect} from "react";
import PreLoader from "../components/includes/loader";
import { Adsense } from "@ctrl/react-adsense";

function SearchResults(){
    var router = useRouter();
    const [searchResults, setSearchResults] = useState([]);

    useEffect(()=> {
        if(router.query.query != undefined && router.query.query != "") {
            if(router.query.query.length >=3){
                //Call the search function and execute promise with .then in order to read the results
                FetchSearchResults(router.query.query).then(response => {
                    setSearchResults(response);
                });
            }
        }
    },[router])
  

    if(searchResults.length >0){
        return (
        <div className="container">
            {searchResults.some((result) => result.search_group === 'country' && result.search_res_name !== null) && (
            <React.Fragment>
            <div className="row  sites-card mb-1">
                <div className="col-12 text-left mb-1" style={{backgroundColor: "lavender"}}>
                    <h2 className="sectionTitle" style={{marginTop: "5px", marginLeft:"10px"}}>Countries</h2>
                </div>
            {/* Loop through the search results and display the country names in columns */}
            {searchResults.map((result,index) => {
                if (result.search_group === 'country' && result.search_res_name !== null) {
                return (
                    <div key={index} className="col-lg-4 col-md-6 col-6 mb-3 fixturesTextSize">
                        <a 
                            href={encodeURI("/country/football-predictions-for-" + result.search_res_name.toLowerCase()+"/fixtures" )}
                            className="ml-2 aTxt">
                            <div className="responsive-row" style={{border:"none"}}>                                    
                            <div className="col-9">                                
                                {result.search_res_name}
                            </div>
                            <div className="col-3">     
                                {/* {result.search_group*/}
                            </div>                                   
                        </div>                   
                        </a>
                    </div>
                );
                }
            })}
            </div>
            </React.Fragment>
            )}

            {searchResults.some((result) => result.search_group === 'league' && result.search_res_name !== null) && (
            <React.Fragment>
            <div className="row  sites-card mb-2">
                <div className="col-12 text-left mb-2" style={{backgroundColor: "lavender"}}>
                    <h2 className="sectionTitle" style={{marginTop: "10px", marginLeft:"10px"}}>Leagues</h2>
                </div>
            {/* Loop through the search results and display the league names in columns */}
            {searchResults.map((result) => {
                if (result.search_group === 'league' && result.search_res_name !== null) {
                return (
                    <div key={result.search_res_id} className="col-lg-4 col-md-6 col-6 mb-3 fixturesTextSize">
                        <a
                            href={"/league/football-predictions-for-"+result.search_country.toLowerCase()+"/"+encodeURIComponent(result.search_res_name.toLowerCase().replace(/\s+/g, '-'))+'-'+result.search_res_id+"/fixtures"}
                            className="ml-2 aTxt">
                            <div className="responsive-row" style={{border:"none"}}>                                    
                                <div className="col-9">                                
                                    {result.search_res_name} 
                                </div>
                                <div className="col-3" style={{color:"indianred"}}>     
                                    {result.search_country}                       
                                </div>                                   
                            </div> 
                        </a>
                    </div>
                );
                }
            })}
            </div>
            </React.Fragment>
            )}
            {searchResults.some((result) => result.search_group === 'team' && result.search_res_name !== null) && (
            <React.Fragment>
                <div className="row sites-card mb-2">
                    <div className="col-12 text-left mb-2" style={{backgroundColor: "lavender"}}>
                        <h2 className="sectionTitle" style={{marginTop: "10px", marginLeft:"10px"}}>Teams</h2>
                    </div>
                    {/* Loop through the search results and display the team names in columns */}
                    {searchResults.map((result) => {
                    if (result.search_group === 'team' && result.search_res_name !== null) {
                        return (
                        <div key={result.search_res_id} className="col-lg-4 col-md-6 col-6 mb-3 fixturesTextSize">
                            <a href={encodeURI("/team/"
                            + result.search_res_name.toLowerCase().replace(/\s+/g, '-')
                            +"-"+result.search_res_id+"/results")}
                            className="ml-2 aTxt">
                            <div className="responsive-row" style={{border:"none"}}>                                    
                                <div className="col-9">                                
                                {result.search_res_name}
                                </div>
                                <div className="col-3">     
                                {/* {result.search_group} */}                       
                                </div>                                   
                            </div>
                            </a>
                        </div>
                        );
                    }
                    })}
                </div>
                <br/>
                <Adsense
                    client="ca-pub-5665711413000284"
                    slot="3850951453"
                    style={{ display: "block" }}
                    layout="display"
                    format="auto"
                /> 
                </React.Fragment>
            )}

            {searchResults.some((result) => result.search_group === 'fixture' && result.search_res_name !== null) && (
            <React.Fragment>
            <div className="row  sites-card mb-2">
                <div className="col-12 text-left mb-2" style={{backgroundColor: "lavender"}}>
                    <h2 className="sectionTitle" style={{marginTop: "10px", marginLeft:"10px"}}>Fixtures</h2>
                </div>
            {/* Loop through the search results and display the fixture details in columns */}
            {searchResults.map((result) => {
                if (result.search_group === 'fixture' && result.search_res_name !== null) {
                return (
                    <div key={result.search_res_id} className="col-lg-4 col-md-6 col-sm-6 mb-3 fixturesTextSize">
                        <a href={'/match/football-predictions-' + 
                            encodeURIComponent(result.search_res_name.split(' VS ')[0].replace(/\s+/g, '-').toLowerCase()
                            +'vs'+result.search_res_name.split(' VS ')[1].replace(/\s+/g, '-').toLowerCase()
                            +'-'+result.search_res_id)+"/matches"} 
                            className="ml-2 aTxt">
                                <div className="responsive-row" style={{border:"none"}}>                                    
                                <div className="col-9" style={{whiteSpace:"pre-wrap"}}>                                
                                    {result.search_res_name} 
                                </div>
                                <div className="col-3" style={{color:"indianred"}}>     
                                    {result.search_res_date}                       
                                </div>                                   
                            </div> 
                        </a>
                    </div>
                );
                }
            })}
            </div>
            </React.Fragment>
            )}
        </div>
        )
    }else{
        return <PreLoader/>
    }
}

export default SearchResults;