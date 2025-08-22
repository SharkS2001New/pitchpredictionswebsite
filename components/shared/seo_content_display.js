import React, {useState} from 'react';

function SeoContentDisplay(props) {
    const [expanded, setExpanded] = useState(false);
  
    // const toggleContent = () => {
    //   setExpanded(!expanded);
    // };
  
    // Extract the rest of the content starting from the second position
    const restContent = props.props.slice(0).map((item, index) => (
      <div key={index + 2}>
        <div dangerouslySetInnerHTML={{ __html: item.title }} />
        <div dangerouslySetInnerHTML={{ __html: item.body }} />
      </div>
    ));
  
    // Ensure at least 2 paragraphs and 2 titles are shown
    // const displayContent = expanded
    //   ? [...restContent]//Display the first 2 titles and paragraphs
    //   : [...restContent.slice(0, 2)]; //Display when read more is clicked
  
    return ( 
    <React.Fragment>
      <div>
        {restContent}
        {/* <div className="text-center">
        {props.props.length > 2 && !expanded && (
          <button className="btn btn-link fixturesTextSize"
          style={{ color: "#B11111", textDecoration: "underline", fontWeight: "bold",border: "none", textAlign: "left" }} 
          onClick={toggleContent}>Read More&nbsp;&nbsp;<i className="bi bi-arrow-down-circle-fill"></i></button>
        )}
        </div> */}
      </div>
      <br/>
    </React.Fragment>
    );
  }
  
export default SeoContentDisplay;