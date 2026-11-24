import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import '../../styles/reels.css'
import ReelFeed from '../../components/ReelFeed'

const categories = ['For you', 'Street food', 'South Indian', 'North Indian', 'Desserts', 'Cafés']

const Home = () => {
  const [videos, setVideos] = useState([])
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('For you')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    axios.get(`${import.meta.env.Frontend_URL}/api/food`, { withCredentials: true })
      .then(response => setVideos(response.data.foodItems || []))
      .catch(() => setVideos([]))
  }, [])

  const filteredVideos = useMemo(() => {
    const term = query.trim().toLowerCase()
    return videos.filter(item => {
      const text = [item.name, item.description, item.foodPartner?.name, item.category, item.location]
        .filter(Boolean).join(' ').toLowerCase()
      const matchesSearch = !term || text.includes(term)
      const category = (item.category || '').toLowerCase()
      const matchesCategory = activeCategory === 'For you' ||
        category.includes(activeCategory.toLowerCase()) ||
        (activeCategory === 'Cafés' && text.includes('cafe'))
      return matchesSearch && matchesCategory
    })
  }, [videos, query, activeCategory])

  async function likeVideo(item) {
    try {
      const response = await axios.post(`${import.meta.env.Frontend_URL}/api/food/like`, { foodId: item._id }, { withCredentials: true })
      setVideos(prev => prev.map(v => v._id === item._id
        ? { ...v, likeCount: Math.max(0, (Number(v.likeCount ?? v.likesCount ?? v.likes) || 0) + (response.data.like ? 1 : -1)) }
        : v))
    } catch (error) { console.error('Unable to update like', error) }
  }

  async function saveVideo(item) {
    try {
      const response = await axios.post(`${import.meta.env.Frontend_URL}/api/food/save`, { foodId: item._id }, { withCredentials: true })
      setVideos(prev => prev.map(v => v._id === item._id
        ? { ...v, savesCount: Math.max(0, (Number(v.savesCount ?? v.bookmarks ?? v.saves) || 0) + (response.data.save ? 1 : -1)) }
        : v))
    } catch (error) { console.error('Unable to save reel', error) }
  }

  return (
    <main className="foodreels-app">
      <header className="topbar">
        <a className="brand" href="/" aria-label="FoodReels home">
          <span className="brand-mark"><span /></span>
          <span>Food<span className="brand-accent">Reels</span><small>YOUR CITY. YOUR NEXT BITE.</small></span>
        </a>
        <div className="topbar-actions">
          <label className="search-box">
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Find a craving..." aria-label="Search food reels" />
            {query && <button type="button" onClick={() => setQuery('')} aria-label="Clear search">×</button>}
          </label>
          <button className="avatar-button" type="button" onClick={() => setMenuOpen(v => !v)} aria-label="Open account menu">P</button>
          {menuOpen && <div className="account-menu"><a href="/user/login">Sign in</a><a href="/register">Create account</a></div>}
        </div>
      </header>

      <section className="discover-bar">
        <div className="discover-copy"><span className="eyebrow">THE TASTE OF BENGALURU</span><h1>Scroll less. <em>Crave more.</em></h1><p>Discover the dishes everyone’s talking about.</p></div>
        <div className="discover-stamp"><span>MADE FOR</span><strong>FOOD<br/>PEOPLE</strong><span>✳ BENGALURU ✳</span></div>
      </section>

      <nav className="category-strip" aria-label="Food categories">
        {categories.map(category => <button key={category} type="button" className={activeCategory === category ? 'category-chip active' : 'category-chip'} onClick={() => setActiveCategory(category)}>{category === 'For you' ? '✦' : '＋'} <span>{category}</span></button>)}
      </nav>

      <div className="feed-heading"><div><span className="live-dot" /> FRESH FROM THE CITY</div><span>{filteredVideos.length} {filteredVideos.length === 1 ? 'reel' : 'reels'}</span></div>
      <ReelFeed items={filteredVideos} onLike={likeVideo} onSave={saveVideo} emptyMessage={query ? 'No reels match that search. Try another dish or place.' : 'The kitchen is warming up. Check back for fresh food reels!'} />
    </main>
  )
}

export default Home
