// components/shared/short-blog-posts.js
import React, { useEffect, useState } from 'react';
import PredictionGuidesLinks from '../seo-content/shared/prediction-guides-links';

const ShortBlogPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [cacheInfo, setCacheInfo] = useState(null);

  useEffect(() => {
    setMounted(true);
    
    const fetchPosts = async () => {
      try {
        // Call our internal API route that handles caching
        const response = await fetch('/api/blog-posts');
        
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        
        const data = await response.json();
        setPosts(data.data || []);
        setCacheInfo({
          fromCache: data.fromCache,
          generatedAt: data.generatedAt
        });
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '';

    try {
      const normalized = String(dateString).trim().replace(' ', 'T');
      const date = new Date(normalized);

      if (Number.isNaN(date.getTime())) {
        return '';
      }

      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (e) {
      return '';
    }
  };

  const getPostDate = (post) =>
    post.published_at || post.created_at || post.post_date || post.date;

  if (!mounted) {
    return (
      <div className="container-wide">
        <h2 className="sectionTitle text-center">Latest News - Blog</h2>
        <div className="row"></div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container-wide">
        <h2 className="sectionTitle text-center">Latest News - Blog</h2>
        <div className="text-center">Loading blog posts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-wide">
        <h2 className="sectionTitle text-center">Latest News - Blog</h2>
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container-wide">
      <h2 className="sectionTitle text-center">Latest News - Blog</h2>
      {/* Optional: Show cache status */}
      {/* {cacheInfo && cacheInfo.fromCache && (
        <div className="text-center" style={{ fontSize: '0.7rem', color: '#666', marginBottom: '10px' }}>
          ⚡ Cached: {new Date(cacheInfo.generatedAt).toLocaleTimeString()}
        </div>
      )} */}
      <div className="row">
        {posts.map((post) => {
          // Generate a reliable key
          const itemKey = post.ID || post.id || `post-${Math.random()}`;
          
          return (
            <div key={itemKey} className="col-md-6 col-12">
              <div className="post-item p-3 m-1">
                <span className="h6 post-title linkTxt3 mb-3">
                  <a href={post.post_link || (post.slug ? `/blog/${post.slug}` : '#')}>
                    {post.title || 'Untitled'}
                  </a>
                </span>
                <p className="post-date">{formatDate(getPostDate(post))}</p>
              </div>
            </div>
          );
        })}
      </div>
      <br />
      <PredictionGuidesLinks title="Football Prediction Guides" />
    </div>
  );
};

export default ShortBlogPosts;