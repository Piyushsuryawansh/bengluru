import React, { useEffect, useState } from 'react'
import '../../styles/profile.css'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'

const Profile = () => {
  const { id } = useParams()
  const [profile, setProfile] = useState(null)
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    axios.get(`${import.meta.env.Frontend_URL}/api/food-partner/${id}`, { withCredentials: true })
      .then(response => {
        if (!active) return
        setProfile(response.data.foodPartner)
        setVideos(response.data.foodPartner.foodItems || [])
      })
      .catch(err => {
        if (!active) return
        setError(err.response?.data?.message || 'Could not load this food partner profile.')
      })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [id])

  if (loading) return <main className="profile-page"><p>Loading food partner…</p></main>
  if (error) return <main className="profile-page"><p role="alert">{error}</p><Link to="/">Back to FoodReels</Link></main>
  if (!profile) return null

  return (
    <main className="profile-page">
      <Link to="/" className="profile-back-link">← Back to FoodReels</Link>
      <section className="profile-header">
        <div className="profile-meta">
          <div className="profile-avatar profile-avatar-placeholder" aria-hidden="true">{profile.name?.charAt(0)?.toUpperCase() || 'F'}</div>
          <div className="profile-info">
            <h1 className="profile-pill profile-business" title="Business name">{profile.name}</h1>
            <p className="profile-pill profile-address" title="Address">{profile.address}</p>
          </div>
        </div>
        <div className="profile-stats" role="list" aria-label="Stats">
          <div className="profile-stat" role="listitem">
            <span className="profile-stat-label">Reels published</span>
            <span className="profile-stat-value">{videos.length}</span>
          </div>
          <div className="profile-stat" role="listitem">
            <span className="profile-stat-label">Customer served</span>
            <span className="profile-stat-value">—</span>
          </div>
        </div>
      </section>
      <hr className="profile-sep" />
      <section className="profile-grid" aria-label="Food videos">
        {videos.map(video => (
          <div key={video._id} className="profile-grid-item">
            <video className="profile-grid-video" style={{ objectFit: 'cover', width: '100%', height: '100%' }} src={video.video} muted controls playsInline preload="metadata" />
          </div>
        ))}
        {videos.length === 0 && <p>This partner hasn't published any reels yet.</p>}
      </section>
    </main>
  )
}

export default Profile
