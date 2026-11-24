import React, { useEffect, useState } from 'react';
import '../../styles/reels.css';
import axios from 'axios';
import ReelFeed from '../../components/ReelFeed';

const Saved = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSavedVideos = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.Frontend_URL}/api/food/save`,
          { withCredentials: true }
        );
        const savedFoods = response.data.foodItems || [];
        setVideos(savedFoods
          .filter(food => food && food._id)
          .map(food => ({
            ...food,
            likeCount: Number(food.likeCount) || 0,
            savesCount: Number(food.savesCount) || 0,
            commentsCount: Number(food.commentsCount) || 0,
          })));
      } catch (err) {
        console.error('Failed to fetch saved videos:', err.response?.data || err.message);
        setError('Could not load your saved reels. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchSavedVideos();
  }, []);

  const removeSaved = async (item) => {
    try {
      const response = await axios.post(
        `${import.meta.env.Frontend_URL}/api/food/save`,
        { foodId: item._id },
        { withCredentials: true }
      );
      if (response.data.save === false) {
        setVideos(prev => prev.filter(video => video._id !== item._id));
      }
    } catch (err) {
      console.error('Failed to unsave video:', err.response?.data || err.message);
    }
  };

  return (
    <main className="foodreels-app">
      <header className="topbar">
        <a className="brand" href="/" aria-label="FoodReels home">
          <span className="brand-mark"><span /></span>
          <span>Food<span className="brand-accent">Reels</span><small>YOUR CITY. YOUR NEXT BITE.</small></span>
        </a>
        <a className="saved-back-link" href="/">Back to discover <span aria-hidden="true">↗</span></a>
      </header>
      <section className="discover-bar saved-discover">
        <div className="discover-copy">
          <span className="eyebrow">YOUR PERSONAL MENU</span>
          <h1>Saved <em>cravings.</em></h1>
          <p>All the bites you bookmarked, in one place.</p>
        </div>
        <div className="discover-stamp"><span>KEEP</span><strong>THE<br/>GOOD<br/>STUFF</strong><span>✳ SAVED ✳</span></div>
      </section>
      <div className="feed-heading"><div><span className="live-dot" /> YOUR COLLECTION</div><span>{videos.length} saved</span></div>
      {loading ? <div className="saved-message">Loading your saved reels…</div>
        : error ? <div className="saved-message">{error}</div>
        : <ReelFeed items={videos} onSave={removeSaved} emptyMessage="Nothing saved just yet. Find something delicious and tap the bookmark." />}
    </main>
  );
};

export default Saved;
