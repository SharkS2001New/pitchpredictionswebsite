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
            {/* Empty cell for star column - desktop shows empty, mobile shows empty with font size */}
            <div className="responsive-cell">
                <span className="hide-on-mobile"></span>
                <span className="hide-on-desktop" style={{fontSize: "12px"}}></span>
            </div>
            
            {/* Team names column */}
            <div className="responsive-cell team-link" style={{ textAlign: "left", fontWeight:"bold" }}>
                <span>Home Team</span><br />
                <span>Away Team</span><br />
            </div>
            
            {/* Desktop odds - shown on desktop only */}
            <div className="responsive-cell team-link-y hide-on-mobile" title="Odds 1  X  2" style={{textAlign: "center"}}>
                <br/>
                <span className="p-3"> &nbsp;&nbsp;1 </span>
                <span className="p-3">&nbsp; X &nbsp;</span>
                <span className="p-3"> 2 &nbsp; </span>
            </div>
            
            {/* Mobile odds - shown on mobile only */}
            <div className="responsive-cell team-link-probability hide-on-desktop" style={{whiteSpace:"pre-wrap"}}>
                <span>1&nbsp;&nbsp;X&nbsp;&nbsp;2</span>
            </div>
            
            {/* Average Goals - desktop only */}
            <div className="responsive-cell team-link-average hide-on-mobile" style={{textAlign: "left"}}>Avg<br/>goals</div>
            
            {/* Empty spacer - desktop only */}
            <div className="responsive-cell hide-on-mobile"></div>
            
            {/* Probability - desktop only */}
            <div className="responsive-cell hide-on-mobile">Prob</div>
            
            {/* Empty spacer - desktop only */}
            <div className="responsive-cell hide-on-mobile"></div>
            
            {/* Scores - all devices */}
            <div className="responsive-cell"><br/>Scores</div>
        </div>
    </React.Fragment>
    )
}

export default FixturesHeaderBar;