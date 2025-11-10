import React, { useEffect, useState } from 'react';

const ShortBlogPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
        setPosts(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div className="loading text-center">Loading blog posts...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="container-wide">
      <h2 className="sectionTitle text-center">Latest News - Blog</h2>
      <div className="row">
        {posts.map((post, index) => ( 
          <div key={post.ID} className="col-md-6 col-12">
            <div className="post-item p-3 m-1">
              <h6 className="post-title linkTxt3 mb-3"><a href={post.post_link}>{post.title}</a></h6>
              <p className="post-date">{new Date(post.post_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
          ))}
      </div>
    </div>
  );
};

export default ShortBlogPosts;