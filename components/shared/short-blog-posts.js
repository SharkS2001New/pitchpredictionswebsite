import React, { useEffect, useState } from 'react';

const ShortBlogPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const fetchPosts = async () => {
      try {
        const response = await fetch('https://api.pitchpredictions.com/api/fetch_blog_posts', {
          headers: {
            Authorization: "R9TxV3PbOEu7qZnJKgydC5LmX2",
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        setPosts(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const formatDate = (dateString) => {
    if (!mounted) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (e) {
      return dateString;
    }
  };

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
      <div className="row">
        {posts.map((post) => {
          // Generate a reliable key
          const itemKey = post.ID || post.id || `post-${Math.random()}`;
          
          return (
            <div key={itemKey} className="col-md-6 col-12">
              <div className="post-item p-3 m-1">
                <h6 className="post-title linkTxt3 mb-3">
                  <a href={post.post_link || post.link || '#'}>{post.title || 'Untitled'}</a>
                </h6>
                <p className="post-date">{formatDate(post.post_date || post.date)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ShortBlogPosts;