
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

                // The backend returns foodItems populated from saveModel
                const savedFoods = response.data.foodItems || [];

                setVideos(
                    savedFoods
                        .filter((food) => food && food._id)
                        .map((food) => ({
                            ...food,
                            likeCount: Number(food.likeCount) || 0,
                            savesCount: Number(food.savesCount) || 0,
                            commentsCount: Number(food.commentsCount) || 0,
                        }))
                );
            } catch (err) {
                console.error(
                    'Failed to fetch saved videos:',
                    err.response?.data || err.message
                );
                setError('Failed to load saved videos. Please try again.');
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
                setVideos((prev) =>
                    prev.filter((video) => video._id !== item._id)
                );
            }
        } catch (err) {
            console.error(
                'Failed to unsave video:',
                err.response?.data || err.message
            );
        }
    };

    if (loading) {
        return <div className="empty-state">Loading saved videos...</div>;
    }

    if (error) {
        return <div className="empty-state">{error}</div>;
    }

    return (
        <ReelFeed
            items={videos}
            onSave={removeSaved}
            emptyMessage="No saved videos yet."
        />
    );
};

export default Saved;
