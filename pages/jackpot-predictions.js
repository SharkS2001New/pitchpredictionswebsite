// pages/jackpot-predictions.js
import React, { useState } from 'react';
import { Adsense } from "@ctrl/react-adsense";
import JackpotPredictionsContent from '../components/seo-content/jackpots/jackpots-landing-page';
import Head from 'next/head';
import { useRouter } from 'next/router';

function JackpotPages({ activeJackpots = [], allSlugs = [], isBot = false, serverSearchTerm = '' }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(serverSearchTerm || '');
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareData, setShareData] = useState({ name: '', url: '' });
  const [isMobile, setIsMobile] = useState(false);
  
  // Check mobile on client side only
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSearchChange = (event) => {
    const value = event.target.value.trim();
    setSearchTerm(value);
    
    // Update URL with search param for better SEO
    if (value) {
      router.push(`/jackpot-predictions?search=${encodeURIComponent(value)}`, undefined, { shallow: true });
    } else {
      router.push('/jackpot-predictions', undefined, { shallow: true });
    }
  };

  // Get jackpot name from slug
  const getJackpotNameFromSlug = (slug) => {
    if (!slug) return '';
    return slug.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Get slug from jackpot name
  const ReturnSlugFromJackpotName = (jackpotName) => {
    if (!jackpotName) return '';
    return jackpotName.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-');
  };

  const openShareModal = (jackpotName, slug) => {
    setShareData({
      name: jackpotName,
      url: `${window.location.origin}/jackpot-predictions/${slug}`
    });
    setShowShareModal(true);
  };

  const closeShareModal = () => {
    setShowShareModal(false);
  };

  // Generate SEO-friendly analysis
  const generateEEATAnalysis = (jackpot) => {
    if (!jackpot) return '';
    
    const name = jackpot.jackpot_name?.toLowerCase() || '';
    const games = jackpot.numberOfGames || 0;
    const progress = jackpot.progress_percentage || 0;
    const isProgressive = jackpot.is_progressive || false;
    const confidence = jackpot.avg_confidence || 0;
    const completedGames = jackpot.completed_games || 0;
    
    let analysis = `Analysis of ${games}-game jackpot selection. `;
    
    if (games >= 15) {
      analysis += `This extensive selection requires comprehensive match-by-match evaluation. `;
    } else if (games >= 10) {
      analysis += `Multiple fixtures demand careful cross-league analysis. `;
    } else {
      analysis += `Focused selection allows for detailed individual match assessment. `;
    }
    
    if (confidence >= 70) {
      analysis += `Historical data shows consistent patterns in ${games >= 15 ? 'larger jackpots' : 'this format'}. `;
    } else if (confidence >= 50) {
      analysis += `Mixed historical outcomes suggest selective value identification. `;
    } else {
      analysis += `Variable patterns indicate need for cautious selection strategy. `;
    }
    
    analysis += `Our methodology combines statistical models with current team performance data. `;
    
    if (isProgressive) {
      analysis += `Progressive jackpots carry specific risk-reward considerations. `;
    }
    
    if (progress > 0 && completedGames > 0) {
      analysis += `With ${completedGames} games completed, early results provide additional data points. `;
    }
    
    if (name.includes('mega')) {
      analysis += `Mega jackpots require perfect selections - each match demands individual assessment.`;
    } else if (name.includes('daily')) {
      analysis += `Daily formats benefit from up-to-date team news and recent form analysis.`;
    } else if (name.includes('midweek')) {
      analysis += `Midweek fixtures consider squad rotation and player recovery factors.`;
    } else {
      analysis += `Selection strategy focuses on matches with reliable performance data and clear patterns.`;
    }
    
    return analysis;
  };

  const ShareModal = () => {
    if (!showShareModal) return null;

    const { name, url } = shareData;
    const shareText = `Check out ${name} predictions on PitchPredictions!`;
    
    const socialUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(shareText)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + url)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareText)}`,
      email: `mailto:?subject=${encodeURIComponent(name)}&body=${encodeURIComponent(shareText + '\n' + url)}`
    };

    return (
      <div className="modal-backdrop" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}>
        <div className="modal-content" style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          maxWidth: '500px',
          width: '90%'
        }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Share "{name}"</h5>
            <button 
              onClick={closeShareModal}
              className="btn-close"
              aria-label="Close"
            ></button>
          </div>
          
          <div className="share-buttons mb-4">
            <div className="row g-2">
              <div className="col-4">
                <a 
                  href={socialUrls.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary w-100"
                >
                  <i className="bi bi-facebook me-1"></i>Facebook
                </a>
              </div>
              <div className="col-4">
                <a 
                  href={socialUrls.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-info w-100 text-white"
                >
                  <i className="bi bi-twitter me-1"></i>Twitter
                </a>
              </div>
              <div className="col-4">
                <a 
                  href={socialUrls.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-success w-100"
                >
                  <i className="bi bi-whatsapp me-1"></i>WhatsApp
                </a>
              </div>
              <div className="col-4">
                <a 
                  href={socialUrls.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary w-100"
                  style={{ backgroundColor: '#0088cc' }}
                >
                  <i className="bi bi-telegram me-1"></i>Telegram
                </a>
              </div>
              <div className="col-4">
                <a 
                  href={socialUrls.email}
                  className="btn btn-secondary w-100"
                >
                  <i className="bi bi-envelope me-1"></i>Email
                </a>
              </div>
              <div className="col-4">
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(url);
                    alert('Link copied to clipboard!');
                  }}
                  className="btn btn-outline-secondary w-100"
                >
                  <i className="bi bi-link-45deg me-1"></i>Copy Link
                </button>
              </div>
            </div>
          </div>
          
          <button 
            onClick={closeShareModal}
            className="btn btn-outline-danger w-100"
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  // Safely filter active jackpots
  const filteredActiveJackpots = Array.isArray(activeJackpots) 
    ? (searchTerm
        ? activeJackpots.filter((jackpot) =>
            jackpot?.jackpot_name?.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : activeJackpots)
    : [];

  // Safely filter inactive slugs
  const activeJackpotNames = filteredActiveJackpots
    .map(j => j?.jackpot_name?.toLowerCase().replace(' predictions', '') || '')
    .filter(Boolean);
  
  let filteredSlugs = Array.isArray(allSlugs) ? allSlugs : [];
  if (searchTerm) {
    filteredSlugs = filteredSlugs.filter((slug) =>
      getJackpotNameFromSlug(slug).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  const filteredInactiveSlugs = filteredSlugs.filter(slug => {
    const jackpotName = getJackpotNameFromSlug(slug).toLowerCase();
    return !activeJackpotNames.some(activeName => 
      jackpotName.includes(activeName) || activeName.includes(jackpotName.replace(' predictions', ''))
    );
  });

  // Create structured data for SEO (only if there are active jackpots)
  const structuredData = Array.isArray(activeJackpots) && activeJackpots.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": activeJackpots.slice(0, 10).map((jackpot, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": `https://www.pitchpredictions.com/jackpot-predictions/${ReturnSlugFromJackpotName(jackpot?.jackpot_name || '')}`,
      "name": jackpot?.jackpot_name || 'Jackpot'
    }))
  } : null;

  return (
    <>
      <Head>
        <title>Jackpot Predictions 2026 | Football Jackpot Tips & Analysis | PitchPredictions</title>
        <meta name="description" content="Expert football jackpot predictions for SportPesa, Betika, Mozzart, and more. Daily jackpot tips with E-E-A-T compliant analysis. Updated for 2026 season." />
        <meta name="keywords" content="jackpot predictions, football jackpot tips, sportpesa mega jackpot, betika sababisha, mozzart jackpot, daily jackpot tips" />
        {structuredData && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          />
        )}
      </Head>

      <div className="sites-card">
        {/* Search Bar */}
        <div className="container mb-4 mt-2">
          <div className="row">
            <div className="col-12">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  placeholder="Search Jackpot Name..."
                  className="form-control border-start-0"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  style={{ 
                    color: "black", 
                    fontWeight: "500",
                    boxShadow: "none"
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Active Jackpots Section */}
        {filteredActiveJackpots.length > 0 ? (
          <div className="container">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="h5 mb-0">
                <i className="bi bi-lightning-charge-fill text-warning me-2"></i>
                Current Active Jackpots
                <small className="text-muted ms-2">({filteredActiveJackpots.length} running)</small>
              </h2>
            </div>
            
            {/* Desktop Grid */}
            {!isMobile ? (
              <div className="row row-cols-1 row-cols-md-2 g-4">
                {filteredActiveJackpots.map((jackpot, index) => {
                  if (!jackpot) return null;
                  
                  const slug = ReturnSlugFromJackpotName(jackpot.jackpot_name);
                  const analysis = jackpot.expert_analysis || generateEEATAnalysis(jackpot);
                  const jackpotNameWithPredictions = jackpot.jackpot_name?.includes('Predictions') 
                    ? jackpot.jackpot_name 
                    : `${jackpot.jackpot_name || 'Jackpot'} Predictions`;
                  const accuracy = Math.round(jackpot.avg_confidence || 0);
                  const completedGames = jackpot.completed_games || 0;
                  
                  return (
                    <div key={jackpot.jackpot_tips_id || index} className="col">
                      <div className="card h-100 border">
                        <div className="card-body p-3">
                          <div className="d-flex align-items-center mb-3">
                            <div className="me-3" style={{ minWidth: '32px' }}>
                              <span className="badge bg-primary rounded-circle" style={{ 
                                width: '28px', 
                                height: '28px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                fontSize: '0.9rem'
                              }}>
                                {index + 1}
                              </span>
                            </div>
                            <h3 className="h6 mb-0 flex-grow-1">
                              <a 
                                href={`/jackpot-predictions/${slug}`}
                                className="text-decoration-none text-dark"
                              >
                                {jackpotNameWithPredictions}
                              </a>
                            </h3>
                          </div>
                          
                          <div className="mb-3">
                            <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                              <span className="badge bg-light text-dark border">
                                <i className="bi bi-trophy me-1"></i>
                                {jackpot.numberOfGames || 0} Games
                              </span>
                              <span className="badge" style={{ 
                                backgroundColor: jackpot.confidence_level === 'high' ? '#28a745' : 
                                             jackpot.confidence_level === 'medium' ? '#ffc107' : '#dc3545',
                                color: jackpot.confidence_level === 'high' ? 'white' : 'black'
                              }}>
                                {jackpot.confidence_level?.toUpperCase() || 'MEDIUM'} Confidence
                              </span>
                            </div>
                            
                            <div className="d-flex flex-wrap align-items-center gap-2">
                              <small className="text-muted">
                                <i className="bi bi-calendar-event me-1"></i>
                                {formatDateShort(jackpot.startDate)} - {formatDateShort(jackpot.endDate)}
                              </small>
                              
                              {jackpot.is_progressive && (
                                <span className="badge bg-warning text-dark">
                                  <i className="bi bi-arrow-up-circle me-1"></i>Progressive
                                </span>
                              )}
                              
                              {jackpot.progress_percentage > 0 && (
                                <span className="badge bg-info text-white">
                                  <i className="bi bi-graph-up me-1"></i>{jackpot.progress_percentage}% Complete
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="mb-3">
                            <div className="d-flex flex-wrap align-items-center gap-2">
                              <div className="d-flex flex-column align-items-center">
                                <span className="h6 mb-0 text-primary">{jackpot.total_votes || 0}</span>
                                <small className="text-muted">Total Votes</small>
                              </div>
                              
                              <div className="vr"></div>
                              
                              <div className="d-flex flex-column align-items-center">
                                <span className="h6 mb-0 text-success">{accuracy}%</span>
                                <small className="text-muted">Accuracy</small>
                              </div>
                              
                              <div className="vr"></div>
                              
                              <div className="d-flex flex-column align-items-center">
                                <span className="h6 mb-0">
                                  {completedGames === 0 ? 'Not Started' : `${completedGames} of ${jackpot.numberOfGames || 0}`}
                                </span>
                                <small className="text-muted">
                                  {completedGames === 0 ? '' : 'games completed'}
                                </small>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mb-3">
                            <button 
                              className="btn btn-outline-secondary w-100 text-start d-flex justify-content-between align-items-center expert-analysis-btn"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target={`#analysis-${jackpot.jackpot_tips_id || index}`}
                              aria-expanded="false"
                            >
                              <span>
                                <i className="bi bi-clipboard-data me-2" style={{ color: '#000' }}></i>
                                <strong>Expert Analysis</strong>
                              </span>
                              <i className="bi bi-chevron-down" style={{ color: '#000' }}></i>
                            </button>
                            
                            <div className="collapse mt-2" id={`analysis-${jackpot.jackpot_tips_id || index}`}>
                              <div className="card card-body border-0 bg-light p-2">
                                <div className="mb-2" style={{ color: '#000', fontSize: '0.9rem' }}>
                                  <p className="mb-0">{analysis}</p>
                                </div>
                                <div className="border-top pt-2">
                                  <div className="d-flex flex-wrap gap-2">
                                    <small className="text-muted">
                                      <i className="bi bi-shield-check text-success me-1"></i>
                                      Expert Analysis
                                    </small>
                                    <small className="text-muted">
                                      <i className="bi bi-graph-up text-info me-1"></i>
                                      Statistical Models
                                    </small>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="row g-2 mt-3">
                            <div className="col-6">
                              <button 
                                className="btn btn-outline-secondary btn-sm w-100 d-flex align-items-center justify-content-center"
                                onClick={() => openShareModal(jackpotNameWithPredictions, slug)}
                              >
                                <i className="bi bi-share me-1"></i>
                                Share
                              </button>
                            </div>
                            <div className="col-6">
                              <a 
                                href={`/jackpot-predictions/${slug}`}
                                className="btn btn-primary btn-sm w-100 d-flex align-items-center justify-content-center"
                              >
                                View Predictions
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              // Mobile version
              filteredActiveJackpots.map((jackpot, index) => {
                if (!jackpot) return null;
                
                const slug = ReturnSlugFromJackpotName(jackpot.jackpot_name);
                const analysis = jackpot.expert_analysis || generateEEATAnalysis(jackpot);
                const jackpotNameWithPredictions = jackpot.jackpot_name?.includes('Predictions') 
                  ? jackpot.jackpot_name 
                  : `${jackpot.jackpot_name || 'Jackpot'} Predictions`;
                const accuracy = Math.round(jackpot.avg_confidence || 0);
                const completedGames = jackpot.completed_games || 0;
                
                return (
                  <div key={jackpot.jackpot_tips_id || index} className="card mb-3 border">
                    <div className="card-body p-3">
                      <div className="d-flex align-items-center mb-3">
                        <div className="me-3" style={{ minWidth: '32px' }}>
                          <span className="badge bg-primary rounded-circle" style={{ 
                            width: '28px', 
                            height: '28px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            fontSize: '0.9rem'
                          }}>
                            {index + 1}
                          </span>
                        </div>
                        <h3 className="h6 mb-0 flex-grow-1">
                          <a 
                            href={`/jackpot-predictions/${slug}`}
                            className="text-decoration-none text-dark"
                          >
                            {jackpotNameWithPredictions}
                          </a>
                        </h3>
                      </div>
                      
                      <div className="mb-3">
                        <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                          <span className="badge bg-light text-dark border">
                            <i className="bi bi-trophy me-1"></i>
                            {jackpot.numberOfGames || 0} Games
                          </span>
                          <span className="badge" style={{ 
                            backgroundColor: jackpot.confidence_level === 'high' ? '#28a745' : 
                                         jackpot.confidence_level === 'medium' ? '#ffc107' : '#dc3545',
                            color: jackpot.confidence_level === 'high' ? 'white' : 'black'
                          }}>
                            {jackpot.confidence_level?.toUpperCase() || 'MEDIUM'} Confidence
                          </span>
                        </div>
                        
                        <div className="d-flex flex-wrap align-items-center justify-content-between">
                          <small className="text-muted">
                            <i className="bi bi-calendar-event me-1"></i>
                            {formatDateShort(jackpot.startDate)} - {formatDateShort(jackpot.endDate)}
                          </small>
                          
                          {jackpot.is_progressive && (
                            <span className="badge bg-warning text-dark">
                              <i className="bi bi-arrow-up-circle me-1"></i>Progressive
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="d-flex flex-wrap align-items-center justify-content-between">
                          <div className="d-flex flex-column align-items-center">
                            <span className="h6 mb-0 text-primary">{jackpot.total_votes || 0}</span>
                            <small className="text-muted">Total Votes</small>
                          </div>
                          
                          <div className="d-flex flex-column align-items-center">
                            <span className="h6 mb-0 text-success">{accuracy}%</span>
                            <small className="text-muted">Accuracy</small>
                          </div>
                          
                          <div className="d-flex flex-column align-items-center">
                            <span className="h6 mb-0">
                              {completedGames === 0 ? 'Not Started' : `${completedGames} of ${jackpot.numberOfGames || 0}`}
                            </span>
                            <small className="text-muted">
                              {completedGames === 0 ? '' : 'games completed'}
                            </small>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <button 
                          className="btn btn-outline-secondary w-100 text-start d-flex justify-content-between align-items-center expert-analysis-btn"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#analysis-mobile-${jackpot.jackpot_tips_id || index}`}
                        >
                          <span>
                            <i className="bi bi-clipboard-data me-2"></i>
                            <strong>Expert Analysis</strong>
                          </span>
                          <i className="bi bi-chevron-down"></i>
                        </button>
                        
                        <div className="collapse mt-2" id={`analysis-mobile-${jackpot.jackpot_tips_id || index}`}>
                          <div className="card card-body border-0 bg-light p-2">
                            <p className="mb-0" style={{ fontSize: '0.9rem' }}>{analysis}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="row g-2 mt-3">
                        <div className="col-6">
                          <button 
                            className="btn btn-outline-secondary btn-sm w-100"
                            onClick={() => openShareModal(jackpotNameWithPredictions, slug)}
                          >
                            <i className="bi bi-share me-1"></i>Share
                          </button>
                        </div>
                        <div className="col-6">
                          <a 
                            href={`/jackpot-predictions/${slug}`}
                            className="btn btn-primary btn-sm w-100"
                          >
                            View Predictions
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          <div className="container mb-4">
            <div className="alert alert-info text-center">
              <i className="bi bi-info-circle me-2"></i>
              No active jackpots found. Check back later for new jackpot predictions.
            </div>
          </div>
        )}

        {/* Ad Section */}
        <div className="container mb-5">
          <div className="text-center bg-light rounded">
            <Adsense
              client="ca-pub-5665711413000284"
              slot="7624930534"
              style={{ display: "block" }}
              layout="display"
              format="auto"
            />
          </div>
        </div>

        {/* Other Jackpots Section */}
        {filteredInactiveSlugs.length > 0 && (
          <div className="container mb-2">
            <h2 className="h5 mb-4">
              <i className="bi bi-archive-fill text-secondary me-2"></i>
              Other Jackpots ({filteredInactiveSlugs.length})
            </h2>
            
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
              {filteredInactiveSlugs.map((slug, index) => {
                const jackpotName = getJackpotNameFromSlug(slug);
                const jackpotNameWithPredictions = jackpotName.includes('Predictions') 
                  ? jackpotName 
                  : `${jackpotName} Predictions`;
                const continuousNumber = filteredActiveJackpots.length + index + 1;
                
                return (
                  <div key={slug} className="col">
                    <div className="card h-100 border">
                      <div className="card-body p-3 d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <span className="badge bg-secondary">{continuousNumber}</span>
                          <button 
                            className="btn btn-sm btn-outline-secondary border-0 d-flex align-items-center"
                            onClick={() => openShareModal(jackpotNameWithPredictions, slug)}
                          >
                            <i className="bi bi-share me-1"></i>
                            Share
                          </button>
                        </div>

                        <h3 className="h6 mb-3 flex-grow-1">
                          <a 
                            href={`/jackpot-predictions/${slug}`}
                            className="text-decoration-none text-dark"
                          >
                            {jackpotNameWithPredictions}
                          </a>
                        </h3>
                        
                        <div className="mt-auto">
                          <div className="d-flex justify-content-between align-items-center">
                            <small className="text-muted">
                              <i className="bi bi-clock-history me-1"></i>
                              Historical predictions
                            </small>
                            <a 
                              href={`/jackpot-predictions/${slug}`}
                              className="btn btn-outline-primary btn-sm">
                              View
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Bottom Ad */}
        <div className="container mb-5">
          <div className="text-center bg-light p-2 rounded">
            <Adsense
              client="ca-pub-5665711413000284"
              slot="3850951453"
              style={{ display: "block" }}
              layout="display"
              format="auto"
            />
          </div>
        </div>

        {/* SEO Content Section */}
        <div className="container">
          <JackpotPredictionsContent/>
        </div>

        {/* Share Modal */}
        {showShareModal && <ShareModal />}
      </div>

      <style jsx>{`
        .expert-analysis-btn:hover,
        .expert-analysis-btn:focus {
          color: #000 !important;
        }
        .expert-analysis-btn:hover i,
        .expert-analysis-btn:focus i {
          color: #000 !important;
        }
      `}</style>
    </>
  );
}

export async function getServerSideProps({ req, query }) {
  const userAgent = req.headers['user-agent'] || '';
  const isBot = /bot|googlebot|crawler|spider|robot|crawling/i.test(userAgent);
  const searchTerm = query.search || '';
  
  // All possible jackpot slugs
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

  try {
    // Fetch active jackpots server-side
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch('https://api.pitchpredictions.com/api/fetch_active_jackpots_enhanced', {
      headers: { 
        "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2",
        "User-Agent": userAgent
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    const data = await response.json();
    
    // Ensure we always return an array
    let activeJackpots = data.status && Array.isArray(data.data) ? data.data : [];
    
    // Filter active jackpots by search term if provided
    if (searchTerm && activeJackpots.length > 0) {
      activeJackpots = activeJackpots.filter(j => 
        j?.jackpot_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return {
      props: {
        activeJackpots,
        allSlugs,
        isBot,
        serverSearchTerm: searchTerm
      }
    };
  } catch (error) {
    console.error('Error fetching jackpots:', error);
    return {
      props: {
        activeJackpots: [],
        allSlugs,
        isBot,
        serverSearchTerm: searchTerm
      }
    };
  }
}

// Helper function for date formatting
const formatDateShort = (dateString) => {
  if (!dateString) return '';
  try {
    const options = { month: 'short', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  } catch (e) {
    return '';
  }
};

export default JackpotPages;