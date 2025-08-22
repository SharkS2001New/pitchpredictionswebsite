import React, { useState, useEffect } from 'react';
import getJackpotNameFromSlug from '../components/functions/GetJackpotName';
import getGithubSiteContent from '../components/functions/GithubPagesContent';
import SeoContentDisplay from '../components/shared/seo_content_display';
import ReturnSlugFromJackpotName from '../components/functions/getJackpotNameFromSlug';
import { Adsense } from "@ctrl/react-adsense";

function JackpotPages() {
    const slugs = [
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
    
  const handleSearchChange = (event) => {
    const searchTerm = event.target.value.trim();
    setSearchTerm(searchTerm);

    if (searchTerm !== '') {
        setActiveJackpots([]);
        const filteredActiveJackpots = activeJackpots.filter((jackpot) =>
            jackpot.jackpot_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setActiveJackpots(filteredActiveJackpots);
    } else {
        getActiveJackpots();
    }
  };

  
  const filteredSlugs = slugs.filter((slug) =>
      getJackpotNameFromSlug(slug).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [activeJackpots, setActiveJackpots] = useState([]);
  const [seoContent, setSeoContent] = useState([]);

  const headers = { "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2" }; // This is the authorization header from the api.pitchpredictions.com

  useEffect(() => {
    if (searchTerm.trim() === '') {
      getActiveJackpots();
    }
    getGithubSiteContent("jackpots/jackpots-landing-page.md").then((data) => {
      setSeoContent(data.page_content);
    });
  }, [searchTerm]);

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
          {activeJackpots.length > 0 ? (
              <div>
                <h3>Active Jackpots</h3>
                {activeJackpots.map((jackpot, index) => (
                  <div key={jackpot.jackpot_tips_id} className="m-1">
                    <a href={`/jackpot-predictions/${ReturnSlugFromJackpotName(jackpot.jackpot_name.toSentenceCase())}`}>
                      {index + 1}. {jackpot.jackpot_name.toSentenceCase() + " Predictions"} &nbsp;&nbsp; (<span className="fixturesTextSize" style={{color: "#212529"}}>No of Games: {jackpot.numberOfGames}</span>)
                    </a>
                    <div className="m-1">
                      <p className="fixturesTextSize ml-5" style={{color: "gray"}}>(Start Date: {formatDate(jackpot.startDate)} - End Date: {formatDate(jackpot.endDate)})</p>
                    </div>
                  </div>
                ))}
              </div>
          ) : null}
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
          <h3>All Jackpots</h3>
          {filteredSlugs.map((slug, index) => {
            const jackpotName = getJackpotNameFromSlug(slug);
            const displayIndex = index + 1;
            return (
              <div key={slug} className="m-2">
                <a href={`/jackpot-predictions/${slug}`}>
                  {displayIndex}. {jackpotName}
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
          <SeoContentDisplay props={seoContent} />
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

