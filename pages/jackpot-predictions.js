// pages/jackpot-predictions.js
import React, { useState } from 'react';
import { Adsense } from "@/components/shared/client-adsense";
import JackpotPredictionsContent from '../components/seo-content/jackpots/jackpots-landing-page';
import { useRouter } from 'next/router';
import getJackpotNameFromSlug from '../components/functions/GetJackpotName';
import ReturnSlugFromJackpotName from '../components/functions/getJackpotNameFromSlug';
import fs from 'fs';
import path from 'path';
import { writeCacheFileAtPath } from "../components/functions/file_cache";
import { normalizeDateInput } from "../components/functions/DatetimeToUsersTimezone";
import { getJackpotServerHeaders } from "../lib/api/server-headers";

function JackpotPages({ activeJackpots = [], allSlugs = [], isBot = false, serverSearchTerm = '', structuredData, cacheInfo }) {
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

  // Helper function to convert string to sentence case
  const toSentenceCase = (str) => {
    if (!str) return '';
    return str.replace(/\b\w+/g, function(match) {
      return match.charAt(0).toUpperCase() + match.slice(1).toLowerCase();
    });
  };

  // Determine if jackpot has started based on start_datetime_formatted
  const hasJackpotStarted = (jackpot) => {
    if (!jackpot.start_datetime_formatted) return false;
    
    const now = new Date();
    const startDate = normalizeDateInput(jackpot.start_datetime_formatted);
    return startDate ? now >= startDate : false;
  };

  // Determine if jackpot is completed based on completed_games and total_games
  const isJackpotCompleted = (jackpot) => {
    return jackpot.completed_games === jackpot.total_games && jackpot.total_games > 0;
  };

  // Get jackpot status text
  const getJackpotStatus = (jackpot) => {
    if (isJackpotCompleted(jackpot)) return 'Completed';
    if (hasJackpotStarted(jackpot)) return 'In Progress';
    return 'Not Started';
  };

  // Get status badge color
  const getStatusBadgeColor = (jackpot) => {
    if (isJackpotCompleted(jackpot)) return 'secondary';
    if (hasJackpotStarted(jackpot)) return 'warning';
    return 'success';
  };

  const formatStartTime = (dateTimeString) => {
    if (!dateTimeString) return '';

    try {
      const date = normalizeDateInput(dateTimeString);
      if (!date) return '';

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const options = { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false
      };

      const timeStr = date.toLocaleTimeString('en-US', options);

      if (date.toDateString() === now.toDateString()) {
        return `Today at ${timeStr}`;
      } else if (date.toDateString() === tomorrow.toDateString()) {
        return `Tomorrow at ${timeStr}`;
      } else {
        return `${formatDateShort(dateTimeString)} at ${timeStr}`;
      }
    } catch (e) {
      return dateTimeString;
    }
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

  // Map active jackpots to include their matching slugs
  const activeJackpotsWithSlugs = Array.isArray(activeJackpots) 
    ? activeJackpots
        .filter(jackpot => jackpot && jackpot.jackpot_name)
        .map(jackpot => {
          const slug = ReturnSlugFromJackpotName(jackpot.jackpot_name);
          return {
            ...jackpot,
            slug: slug,
            displayName: jackpot.jackpot_name.includes('Predictions') 
              ? toSentenceCase(jackpot.jackpot_name)
              : `${toSentenceCase(jackpot.jackpot_name)} Predictions`,
            hasStarted: hasJackpotStarted(jackpot),
            isCompleted: isJackpotCompleted(jackpot),
            statusText: getJackpotStatus(jackpot),
            statusColor: getStatusBadgeColor(jackpot),
            startTimeFormatted: !hasJackpotStarted(jackpot) ? formatStartTime(jackpot.start_datetime_formatted) : null,
            endTimeFormatted: hasJackpotStarted(jackpot) && !isJackpotCompleted(jackpot) ? formatStartTime(jackpot.end_datetime_formatted) : null
          };
        })
    : [];

  // Safely filter active jackpots by search term
  const filteredActiveJackpots = searchTerm
    ? activeJackpotsWithSlugs.filter((jackpot) =>
        jackpot.jackpot_name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : activeJackpotsWithSlugs;

  // Get active jackpot names for filtering inactive slugs
  const activeJackpotNames = filteredActiveJackpots
    .map(j => j.jackpot_name?.toLowerCase().replace(/ predictions$/, '') || '')
    .filter(Boolean);
  
  // Filter all slugs based on search term
  let filteredSlugs = Array.isArray(allSlugs) ? allSlugs : [];
  if (searchTerm) {
    filteredSlugs = filteredSlugs.filter((slug) =>
      getJackpotNameFromSlug(slug).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  // Filter out slugs that match active jackpots
  const filteredInactiveSlugs = filteredSlugs.filter(slug => {
    const slugName = getJackpotNameFromSlug(slug).toLowerCase();
    return !activeJackpotNames.some(activeName => 
      slugName.includes(activeName) || activeName.includes(slugName.replace(/ predictions$/, ''))
    );
  });

  return (
    <>
      {/* Structured Data Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="sites-card jackpot-sites-card">
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
                                href={`/jackpot-predictions/${jackpot.slug}`}
                                className="text-decoration-none text-dark"
                              >
                                {jackpot.displayName}
                              </a>
                            </h3>
                            <span className={`badge bg-${jackpot.statusColor} ms-2`}>
                              {jackpot.statusText}
                            </span>
                          </div>
                          
                          {/* Key Stats Row */}
                          <div className="mb-3">
                            <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                              <span className="badge bg-light text-dark border">
                                <i className="bi bi-trophy me-1"></i>
                                {jackpot.total_games || 0} Games
                              </span>
                              <span className="badge" style={{ 
                                backgroundColor: jackpot.confidence_level === 'high' ? '#28a745' : 
                                               jackpot.confidence_level === 'medium' ? '#ffc107' : 
                                               jackpot.confidence_level === 'low' ? '#dc3545' : '#6c757d',
                                color: jackpot.confidence_level === 'high' ? 'white' : 
                                       jackpot.confidence_level === 'medium' ? 'black' : 'white'
                              }}>
                                {jackpot.confidence_level?.toUpperCase() || 'MEDIUM'} Confidence
                              </span>
                              {accuracy > 0 && (
                                <span className="badge bg-info text-white">
                                  <i className="bi bi-graph-up me-1"></i>
                                  {accuracy}% Accuracy
                                </span>
                              )}
                            </div>
                            
                            {/* Date & Time Info - Updated */}
                            <div className="d-flex flex-wrap align-items-center gap-2">
                              <small className="text-muted">
                                <i className="bi bi-calendar-event me-1"></i>
                                {formatDateShort(jackpot.start_date)} - {formatDateShort(jackpot.end_date)}
                              </small>
                              
                              {!jackpot.hasStarted && jackpot.startTimeFormatted && (
                                <span className="badge bg-info text-white">
                                  <i className="bi bi-clock me-1"></i>
                                  Starts: {jackpot.startTimeFormatted}
                                </span>
                              )}
                              
                              {jackpot.hasStarted && !jackpot.isCompleted && jackpot.endTimeFormatted && (
                                <span className="badge bg-warning text-dark">
                                  <i className="bi bi-clock me-1"></i>
                                  Ends: {jackpot.endTimeFormatted}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {/* Stats Grid */}
                          <div className="bg-light p-2 rounded mb-3">
                            <div className="d-flex flex-wrap align-items-center justify-content-around">
                              <div className="d-flex flex-column align-items-center px-2">
                                <span className="h6 mb-0 text-primary">{jackpot.total_votes || 0}</span>
                                <small className="text-muted">Total Votes</small>
                              </div>
                              
                              <div className="vr"></div>
                              
                              <div className="d-flex flex-column align-items-center px-2">
                                <span className="h6 mb-0 text-success">{accuracy}%</span>
                                <small className="text-muted">Confidence</small>
                              </div>
                              
                              <div className="vr"></div>
                              
                              <div className="d-flex flex-column align-items-center px-2">
                                <span className="h6 mb-0">
                                  {completedGames === 0 ? '0' : `${completedGames}/${jackpot.total_games || 0}`}
                                </span>
                                <small className="text-muted">Games completed</small>
                              </div>
                            </div>
                            
                            {/* Progress Bar */}
                            {jackpot.progress_percentage > 0 && (
                              <div className="mt-2">
                                <div className="progress" style={{ height: '4px' }}>
                                  <div 
                                    className="progress-bar bg-success" 
                                    style={{ width: `${jackpot.progress_percentage}%` }}
                                    aria-valuenow={jackpot.progress_percentage}
                                    aria-valuemin="0" 
                                    aria-valuemax="100"
                                  />
                                </div>
                                <small className="text-muted mt-1 d-block text-end">
                                  {jackpot.progress_percentage}% Complete
                                </small>
                              </div>
                            )}
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="row g-2 mt-2">
                            <div className="col-6">
                              <button 
                                className="btn btn-outline-secondary btn-sm w-100 d-flex align-items-center justify-content-center"
                                onClick={() => openShareModal(jackpot.displayName, jackpot.slug)}
                              >
                                <i className="bi bi-share me-1"></i>
                                Share
                              </button>
                            </div>
                            <div className="col-6">
                              <a 
                                href={`/jackpot-predictions/${jackpot.slug}`}
                                className="btn btn-primary btn-sm w-100 d-flex align-items-center justify-content-center"
                              >
                                <i className="bi bi-eye me-1"></i>
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
                            href={`/jackpot-predictions/${jackpot.slug}`}
                            className="text-decoration-none text-dark"
                          >
                            {jackpot.displayName}
                          </a>
                        </h3>
                        <span className={`badge bg-${jackpot.statusColor} ms-2`}>
                          {jackpot.statusText}
                        </span>
                      </div>
                      
                      {/* Badges Row */}
                      <div className="d-flex flex-wrap gap-2 mb-2">
                        <span className="badge bg-light text-dark border">
                          {jackpot.total_games || 0} Games
                        </span>
                        <span className="badge" style={{ 
                          backgroundColor: jackpot.confidence_level === 'high' ? '#28a745' : 
                                         jackpot.confidence_level === 'medium' ? '#ffc107' : 
                                         jackpot.confidence_level === 'low' ? '#dc3545' : '#6c757d',
                          color: jackpot.confidence_level === 'high' ? 'white' : 
                                 jackpot.confidence_level === 'medium' ? 'black' : 'white'
                        }}>
                          {jackpot.confidence_level?.toUpperCase() || 'MEDIUM'} Confidence
                        </span>
                      </div>
                      
                      {/* Date and Time - Updated */}
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <small className="text-muted">
                          <i className="bi bi-calendar-event me-1"></i>
                          {formatDateShort(jackpot.start_date)} - {formatDateShort(jackpot.end_date)}
                        </small>
                        
                        {!jackpot.hasStarted && jackpot.startTimeFormatted && (
                          <small className="text-info">
                            <i className="bi bi-clock me-1"></i>
                            {jackpot.startTimeFormatted}
                          </small>
                        )}
                        
                        {jackpot.hasStarted && !jackpot.isCompleted && jackpot.endTimeFormatted && (
                          <small className="text-warning">
                            <i className="bi bi-clock me-1"></i>
                            Ends {jackpot.endTimeFormatted}
                          </small>
                        )}
                      </div>
                      
                      {/* Stats Row */}
                      <div className="bg-light p-2 rounded mb-2">
                        <div className="d-flex justify-content-around">
                          <div className="text-center">
                            <div className="fw-bold text-primary">{jackpot.total_votes || 0}</div>
                            <small>Total Votes</small>
                          </div>
                          <div className="text-center">
                            <div className="fw-bold text-success">{accuracy}%</div>
                            <small>Confidence</small>
                          </div>
                          <div className="text-center">
                            <div className="fw-bold">
                              {completedGames}/{jackpot.total_games || 0}
                            </div>
                            <small>Games completed</small>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="row g-2">
                        <div className="col-6">
                          <button 
                            className="btn btn-outline-secondary btn-sm w-100"
                            onClick={() => openShareModal(jackpot.displayName, jackpot.slug)}
                          >
                            <i className="bi bi-share me-1"></i>Share
                          </button>
                        </div>
                        <div className="col-6">
                          <a 
                            href={`/jackpot-predictions/${jackpot.slug}`}
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
        <div className="seo-content-section">
          <div className="container">
            <JackpotPredictionsContent/>
          </div>
        </div>

        {/* Share Modal */}
        {showShareModal && <ShareModal />}
      </div>
    </>
  );
}

export async function getServerSideProps({ req, query }) {
  const siteUrl = 'https://www.pitchpredictions.com';
  const currentDate = new Date().toISOString().split('T')[0];
  
  const userAgent = req.headers['user-agent'] || '';
  const isBot = /bot|googlebot|crawler|spider|robot|crawling/i.test(userAgent);
  const searchTerm = query.search || '';
  
  // All possible jackpot slugs (original URLs)
  const allSlugs = [
    'sportpesa-mega-jackpot-predictions',
    'sportpesa-midweek-jackpot-predictions',
    'sportpesa-supa-jackpot-17-predictions-tz',
    'sportpesa-supa-jackpot-13-predictions-tz',
    'betika-midweek-jackpot-predictions',
    'betika-kitonga-jackpot-tz',
    'mozzart-super-grand-jackpot-predictions',
    'mozzart-super-daily-jackpot-predictions',
    'shabiki-jackpot-predictions',
    'odibet-laki-tatu-daily-jackpot-predictions',
    'sportybet-jackpot-predictions',
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

  let activeJackpots = [];
  let cacheInfo = {
    fromCache: false,
    generatedAt: null
  };

  // Cache setup
  const cacheDir = path.join(process.cwd(), 'public', 'cache');
  const cacheFilename = `active-jackpots.json`;
  const cachePath = path.join(cacheDir, cacheFilename);

  try {
    // Create cache directory if it doesn't exist
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }

    // Check if we have a valid cache file (30 minutes = 1800000 ms)
    if (fs.existsSync(cachePath)) {
      const cacheContent = fs.readFileSync(cachePath, 'utf8');
      const cache = JSON.parse(cacheContent);
      
      const cacheTime = new Date(cache.generatedAt).getTime();
      const now = new Date().getTime();
      const ageInMinutes = (now - cacheTime) / (1000 * 60);
      
      if (ageInMinutes <= 30) {
        // ✅ Cache is valid - use it!
        activeJackpots = cache.data;
        cacheInfo = {
          fromCache: true,
          generatedAt: cache.generatedAt
        };
      } else {
        // ❌ Cache expired - delete it
        fs.unlinkSync(cachePath);
      }
    }

    // If no valid cache, fetch from API
    if (activeJackpots.length === 0) {      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch('https://api.pitchpredictions.com/api/fetch_active_jackpots_enhanced', {
        headers: getJackpotServerHeaders(),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Ensure we always return an array
      activeJackpots = data.status && Array.isArray(data.data) ? data.data : [];
            
      // Save to cache
      const cacheData = {
        generatedAt: new Date().toISOString(),
        data: activeJackpots,
        count: activeJackpots.length
      };
      
      // Atomic write
      writeCacheFileAtPath(cachePath, cacheData);
      
      cacheInfo = {
        fromCache: false,
        generatedAt: cacheData.generatedAt
      };
      
    }

    // Clean up old cache files (older than 30 minutes)
    await cleanupOldCacheFiles(cacheDir);

  } catch (error) {    
    // If cache exists but API failed, use it as fallback
    if (fs.existsSync(cachePath)) {
      try {
        const cacheContent = fs.readFileSync(cachePath, 'utf8');
        const cache = JSON.parse(cacheContent);
        activeJackpots = cache.data;
        cacheInfo = {
          fromCache: true,
          generatedAt: cache.generatedAt,
          isFallback: true
        };
      } catch (fallbackErr) {
        console.error('Fallback error for active jackpots:', fallbackErr);
      }
    }
  }
  
  // Create structured data for jackpot predictions landing page
  const structuredData = createStructuredData(siteUrl, currentDate, activeJackpots);
  
  return {
    props: {
      activeJackpots,
      allSlugs,
      isBot,
      serverSearchTerm: searchTerm,
      structuredData,
      cacheInfo
    }
  };
}

// Helper function to clean up old cache files
async function cleanupOldCacheFiles(cacheDir) {
  try {
    if (!fs.existsSync(cacheDir)) return;
    
    const files = fs.readdirSync(cacheDir);
    const now = new Date().getTime();
    const maxAge = 30 * 60 * 1000; // 30 minutes
    
    for (const file of files) {
      if (file === 'active-jackpots.json') {
        const filePath = path.join(cacheDir, file);
        const stats = fs.statSync(filePath);
        const fileAge = now - stats.mtimeMs;
        
        if (fileAge > maxAge) {
          fs.unlinkSync(filePath);
        }
      }
    }
  } catch (error) {
    console.error('Error cleaning up cache:', error);
  }
}

// Helper function for date formatting
const formatDateShort = (dateString) => {
  if (!dateString) return '';
  try {
    const date = normalizeDateInput(dateString);
    if (!date) return '';

    const options = { month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  } catch (e) {
    return '';
  }
};

// Helper function to create structured data for jackpot predictions landing page
function createStructuredData(siteUrl, currentDate, activeJackpots) {
  // All jackpot slugs for complete list
  const allJackpotItems = [
    { position: 1, name: "Sportpesa Mega Jackpot Predictions", url: `${siteUrl}/jackpot-predictions/sportpesa-mega-jackpot-predictions` },
    { position: 2, name: "Sportpesa Midweek Jackpot Predictions", url: `${siteUrl}/jackpot-predictions/sportpesa-midweek-jackpot-predictions` },
    { position: 3, name: "Betika Midweek Jackpot Predictions", url: `${siteUrl}/jackpot-predictions/betika-midweek-jackpot-predictions` },
    { position: 4, name: "Mozzart Super Daily Jackpot Predictions", url: `${siteUrl}/jackpot-predictions/mozzart-super-daily-jackpot-predictions` },
    { position: 5, name: "Mozzart Bet Grand Jackpot Predictions", url: `${siteUrl}/jackpot-predictions/mozzart-super-grand-jackpot-predictions` },
    { position: 6, name: "Sportybet Jackpot Predictions", url: `${siteUrl}/jackpot-predictions/sportybet-jackpot-predictions` },
    { position: 7, name: "Odibet Laki Tatu Jackpot Predictions", url: `${siteUrl}/jackpot-predictions/odibet-laki-tatu-daily-jackpot-predictions` },
    { position: 8, name: "Betpawa Pick 17 Kenya Jackpot Predictions", url: `${siteUrl}/jackpot-predictions/betpawa-pick17-jackpot-predictions-kenya` },
    { position: 9, name: "Betpawa Pick 13 Kenya Jackpot Predictions", url: `${siteUrl}/jackpot-predictions/betpawa-pick13-jackpot-predictions-kenya` },
    { position: 10, name: "Betway Jackpot Predictions Kenya", url: `${siteUrl}/jackpot-predictions/betway-jackpot-predictions-kenya` },
    { position: 11, name: "Bet9ja Super9ja Jackpot Predictions", url: `${siteUrl}/jackpot-predictions/bet9ja-super9ja-jackpot-predictions` },
    { position: 12, name: "1xbet Toto 15 Jackpot Predictions", url: `${siteUrl}/jackpot-predictions/1xbet-toto-15-jackpot-predictions` }
  ];

  return {
    "@context": "https://schema.org",
    "@graph": [
      // 1. Organization
      {
        "@type": "Organization",
        "@id": `${siteUrl}#organization`,
        "name": "Pitch Predictions",
        "url": siteUrl,
        "logo": {
          "@type": "ImageObject",
          "url": `${siteUrl}/pitch-predictions-logo.png`,
          "width": 300,
          "height": 60
        },
        "description": "Free, data-driven football prediction platform covering 700+ leagues and jackpots worldwide.",
        "sameAs": ["https://t.me/s/betsassuredkenya"],
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "Customer Support",
          "url": `${siteUrl}/contactus`
        }
      },
      
      // 2. WebPage for jackpot predictions
      {
        "@type": "WebPage",
        "@id": `${siteUrl}/jackpot-predictions#webpage`,
        "name": "Jackpot Predictions – Free Football Jackpot Tips This Week",
        "description": "Free jackpot predictions for Sportpesa Mega, Betika Midweek, Mozzart, Betpawa, Sportybet and more — expert tips for every game on every coupon, updated weekly.",
        "url": `${siteUrl}/jackpot-predictions`,
        "isPartOf": {
          "@type": "WebSite",
          "@id": `${siteUrl}#website`
        },
        "about": {
          "@type": "Thing",
          "name": "Football Jackpot Predictions"
        },
        "dateModified": currentDate,
        "inLanguage": "en",
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": siteUrl
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Jackpot Predictions",
              "item": `${siteUrl}/jackpot-predictions`
            }
          ]
        }
      },
      
      // 3. FAQPage for jackpot predictions
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}/jackpot-predictions#faq`,
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is a football jackpot prediction?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "A football jackpot prediction is an expert analysis for every preselected game in a bookmaker's jackpot coupon. Jackpots require bettors to correctly predict the outcomes of 8–18 games on a single slip to win the grand prize. Pitch Predictions publishes free 1X2 and Double Chance tips for every game on every active jackpot coupon."
            }
          },
          {
            "@type": "Question",
            "name": "Which jackpots does Pitch Predictions cover?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Pitch Predictions covers all major African and international bookmaker jackpots including the Sportpesa Mega Jackpot (17 games), Sportpesa Midweek Jackpot (13 games), Betika Midweek Jackpot (15 games), Mozzart Super Daily Jackpot, Mozzart Grand Jackpot, Sportybet Jackpot, Odibet Laki Tatu, Betpawa Pick 13 and Pick 17 across Kenya, Uganda, Tanzania, Nigeria, Ghana, Zambia and Cameroon, Betway Kenya and Uganda, Bet9ja Super9ja, and more."
            }
          },
          {
            "@type": "Question",
            "name": "Are the jackpot predictions free?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. All jackpot predictions on Pitch Predictions are completely free. We publish expert 1X2 and Double Chance tips for every game on every active jackpot coupon, updated weekly before each deadline. A premium subscription provides access to additional in-depth analysis and bonus picks."
            }
          },
          {
            "@type": "Question",
            "name": "How are jackpot predictions calculated?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Every jackpot game is analysed using each team's recent form (last 12 matches), head-to-head records, current league standings, home and away performance, and squad availability. We also provide Double Chance alternatives for closely contested games to help bettors target bonus prize thresholds."
            }
          },
          {
            "@type": "Question",
            "name": "What is the difference between a Mega Jackpot and a Midweek Jackpot?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "A Mega Jackpot typically runs over the weekend (Saturday–Sunday) and features more games — usually 17 — with a larger grand prize. A Midweek Jackpot runs during the week with fewer games (typically 13–15) and a smaller but still substantial prize. Both require correctly predicting all preselected games to win the top prize."
            }
          }
        ]
      },
      
      // 4. BreadcrumbList
      {
        "@type": "BreadcrumbList",
        "@id": `${siteUrl}/jackpot-predictions#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": siteUrl
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Jackpot Predictions",
            "item": `${siteUrl}/jackpot-predictions`
          }
        ]
      },
      
      // 5. ItemList - all active jackpot pages for Google to index
      {
        "@type": "ItemList",
        "@id": `${siteUrl}/jackpot-predictions#itemlist`,
        "name": "Football Jackpot Predictions",
        "description": "Free jackpot predictions for all major African and international bookmaker jackpots — updated weekly.",
        "url": `${siteUrl}/jackpot-predictions`,
        "itemListElement": allJackpotItems
      },
      
      // 6. WebSite
      {
        "@type": "WebSite",
        "@id": `${siteUrl}#website`,
        "name": "Pitch Predictions",
        "url": siteUrl,
        "publisher": {
          "@id": `${siteUrl}#organization`
        }
      }
    ]
  };
}

export default JackpotPages;