import React, { useState, useEffect } from 'react';
import getJackpotNameFromSlug from '../components/functions/GetJackpotName';
import ReturnSlugFromJackpotName from '../components/functions/getJackpotNameFromSlug';
import { Adsense } from "@ctrl/react-adsense";
import JackpotPredictionsContent from '../components/seo-content/jackpots/jackpots-landing-page';

function JackpotPages() {
    const allSlugs = [
      'sportpesa-mega-jackpot-predictions',
      'sportpesa-midweek-jackpot-predictions',
      'sportpesa-supa-jackpot-17-predictions-tz',
      'sportpesa-supa-jackpot-13-predictions-tz',
      'betika-sababisha-jackpot-predictions',
      'betika-midweek-jackpot-predictions',
      'betika-grand-jackpot-predictions',
      'betika-kitonga-jackpot-tz',
      'mozzart-super-grand-jackpot-predictions',
      'mozzart-super-daily-jackpot-predictions',
      'shabiki-jackpot-predictions',
      'odibet-laki-tatu-daily-jackpot-predictions',
      'sportybet-jackpot-predictions',
      'betlion-daily-jp-jackpot-predictions',
      'betlion-goliath-jackpot-predictions',
      'betpawa-pick13-jackpot-predictions-uganda',
      'betpawa-pick17-jackpot-predictions-uganda',
      'betpawa-pick13-jackpot-predictions-nigeria',
      'betpawa-pick17-jackpot-predictions-nigeria',
      'betpawa-pick13-jackpot-predictions-kenya',
      'betpawa-pick17-jackpot-predictions-kenya',
      'betpawa-pick13-jackpot-predictions-tanzania',
      'betpawa-pick17-jackpot-predictions-tanzania',
      'betpawa-pick13-jackpot-predictions-zambia',
      'betpawa-pick17-jackpot-predictions-zambia',
      'betpawa-pick13-jackpot-predictions-ghana',
      'betpawa-pick17-jackpot-predictions-ghana',
      'betpawa-pick13-jackpot-predictions-cameroon',
      'betpawa-pick17-jackpot-predictions-cameroon',
      'betpawa-pick13-jackpot-predictions-dr-congo',
      'betpawa-pick17-jackpot-predictions-dr-congo',
      'betway-jackpot-predictions-uganda',
      'betway-jackpot-predictions-kenya',
      'betway-jackpot-predictions-tanzania',
      '22-bet-toto-jackpot-predictions',
      'bet9ja-super9ja-jackpot-predictions',
      '1xbet-toto-15-jackpot-predictions',
      'merrybet-jackpot-predictions',
      'betking-jackpot-predictions',
      'betsafe-daily-jackpot-predictions',
      'betsafe-mita-tano-jackpot-predictions'
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [activeJackpots, setActiveJackpots] = useState([]);
    
  const handleSearchChange = (event) => {
    const value = event.target.value.trim();
    setSearchTerm(value);
  };

  const headers = { "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2" };

  useEffect(() => {
    getActiveJackpots();
  }, []);

  const getActiveJackpots = async () => {
    try {
      const response = await fetch('https://api.pitchpredictions.com/api/fetch_active_jackpots_only', 
      {
        headers: headers
      });
      const data = await response.json();
      if (data.status && data.data) {
        setActiveJackpots(data.data);
      }
    } catch (error) {
      console.error('Error fetching active jackpots:', error);
    }
  };

  // Filter all slugs based on search term
  let filteredSlugs = allSlugs;
  if (searchTerm !== '') {
    filteredSlugs = allSlugs.filter((slug) =>
      getJackpotNameFromSlug(slug).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Filter active jackpots based on search term
  let filteredActiveJackpots = activeJackpots;
  if (searchTerm !== '') {
    filteredActiveJackpots = activeJackpots.filter((jackpot) =>
      jackpot.jackpot_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Remove active jackpots from the "All Jackpots" list
  const activeJackpotNames = filteredActiveJackpots.map(j => 
    j.jackpot_name.toLowerCase().replace(' predictions', '')
  );
  
  const filteredInactiveSlugs = filteredSlugs.filter(slug => {
    const jackpotName = getJackpotNameFromSlug(slug).toLowerCase();
    return !activeJackpotNames.some(activeName => 
      jackpotName.includes(activeName) || activeName.includes(jackpotName.replace(' predictions', ''))
    );
  });

  // Calculate continuous numbering
  let itemCount = 0;

  return (
    <div className="sites-card">
      <br />
      <div className="search-bar container mb-2">
        <input
          type="text"
          placeholder="Search By Jackpot Name"
          className="form-control"
          value={searchTerm}
          onChange={handleSearchChange}
          style={{ color: "black", fontWeight: "bold" }}
        />
      </div>
      <div className="row" style={{ textAlign: 'left', fontWeight: "bold", margin: "0px 5px 5px 5px" }}>
          {filteredActiveJackpots.length > 0 && (
              <div>
                <h3>Active Jackpots ({filteredActiveJackpots.length})</h3>
                {filteredActiveJackpots.map((jackpot) => {
                  itemCount++;
                  return (
                    <div key={jackpot.jackpot_tips_id} className="m-1">
                      <a href={`/jackpot-predictions/${ReturnSlugFromJackpotName(jackpot.jackpot_name.toSentenceCase())}`}>
                        {itemCount}. {jackpot.jackpot_name.toSentenceCase() + " Predictions"} &nbsp;&nbsp; 
                        (<span className="fixturesTextSize" style={{color: "#212529"}}>No of Games: {jackpot.numberOfGames}</span>)
                      </a>
                      <div className="m-1">
                        <p className="fixturesTextSize ml-5" style={{color: "gray"}}>
                          (Start Date: {formatDate(jackpot.startDate)} - End Date: {formatDate(jackpot.endDate)})
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
          )}
          <br/>
          <div className="desktop-container-resize mb-1">
              <div className="col-sm-12 text-center bg-light pt-1">
                  <Adsense
                      client="ca-pub-5665711413000284"
                      slot="7624930534"
                      style={{ display: "block" }}
                      layout="display"
                      format="auto"
                  /> 
              </div>
          </div>
          <br/>
          <h3>Other Jackpots ({filteredInactiveSlugs.length})</h3>
          {filteredInactiveSlugs.map((slug) => {
            itemCount++;
            const jackpotName = getJackpotNameFromSlug(slug);
            return (
              <div key={slug} className="m-2">
                <a href={`/jackpot-predictions/${slug}`}>
                  {itemCount}. {jackpotName}
                </a>
              </div>
            );
          })}
      </div>
      <br />
      <Adsense
          client="ca-pub-5665711413000284"
          slot="3850951453"
          style={{ display: "block" }}
          layout="display"
          format="auto"/> 
      <br/>   
      <div className="">
        <div className="container">
          <JackpotPredictionsContent/>
        </div>
      </div>
    </div>
  );
}

export default JackpotPages;

const formatDate = (dateString) => {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', options);
};

String.prototype.toSentenceCase = function() {
  return this.replace(/\b\w+/g, function(match) {
    return match.charAt(0).toUpperCase() + match.slice(1).toLowerCase();
  });
};