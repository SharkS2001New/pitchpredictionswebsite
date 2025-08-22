import MetaContent from "../../functions/determine_meta_content_and_titles";
import React from "react";

function FixturesHeaderBar(props){
    var meta_content_data = MetaContent();
    
    return (
    <React.Fragment>
        {/** Title bar */}
        {props.showtitlebar ? (
        <div className="responsive-row" style={{textAlign:"center",backgroundColor:"rgb(238, 247, 255)",marginLeft:"1px",borderRadius:"5px", cursor: "auto"}}>
                <h1 className="h1headerTitle">{meta_content_data[3]}</h1>
        </div>                 
        ) : (
            <div className="responsive-row"></div>
        )}
        
        {/**Header columns **/}
        <div  className="responsive-row header-size"  style={{fontWeight: "bold",textAlign:"left", cursor: "auto"}}>
            {props.mobile_device == false ? 
                //desktop device
                <div className="responsive-cell" ></div>
            : 
                //mobile device
                <div className="responsive-cell">
                    <span style={{fontSize: "12px"}}></span>               
                </div>
            }
            <div className="responsive-cell team-link" style={{ textAlign: "left", fontWeight:"bold" }}>
                <span>Home Team</span><br />
                <span>Away Team</span><br />
            </div>
            {props.mobile_device==false ?
                <div className="responsive-cell team-link-y hide-on-mobile" title="Odds 1  X  2" style={{textAlign: "center"}}><br/>
                   <span className="p-3"> &nbsp;&nbsp;1 </span>
                   <span className="p-3">&nbsp; X &nbsp;</span>
                   <span className="p-3"> 2 &nbsp; </span>
                </div>
            
                : 
                <div className="responsive-cell team-link-probability" style={{whiteSpace:"pre-wrap"}}>
                    <span>1&nbsp;&nbsp;X&nbsp;&nbsp;2</span>
                </div>
            }
            <div className="responsive-cell team-link-average hide-on-mobile" style={{textAlign: "left"}}>Avg<br/>goals</div>
            <div className="responsive-cell hide-on-mobile"></div>
            <div className="responsive-cell hide-on-mobile">Prob</div>
            <div className="responsive-cell hide-on-mobile"></div>
            <div className="responsive-cell"><br/>Scores</div>
        </div>
    </React.Fragment>
    )
}

export default FixturesHeaderBar;