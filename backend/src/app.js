const express = require('express')
const cookieParser = require('cookie-parser')
const authRoutes = require('./routes/auth.routes')
const foodRoutes = require('./routes/food.routes')
const foodPartnerRoutes = require('./routes/food-partner.routes')
const cors = require('cors')

const app = express()
const allowedOrigins = (process.env.FRONTEND_ORIGINS || 'http://localhost:5173,http://localhost:3000,https://bengluru-azure.vercel.app')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean)

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true)
    return callback(new Error('Origin is not allowed by CORS'))
  },
  credentials: true,
}))
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true, limit: '1mb' }))
app.use(cookieParser())

app.get('/', (req, res) => res.status(200).send('FoodReels API is running'))

app.use('/api/auth', authRoutes)
app.use('/api/food', foodRoutes)
app.use('/api/food-partner', foodPartnerRoutes)

app.use((err, req, res, next) => {
  console.error('API error:', err)
  if (err && err.message === 'Please upload a valid video file.') {
    return res.status(400).json({ message: err.message })
  }
  if (err && err.name === 'MulterError') {
    return res.status(400).json({ message: err.code === 'LIMIT_FILE_SIZE' ? 'Video is too large.' : err.message })
  }
  if (err && err.message === 'Origin is not allowed by CORS') {
    return res.status(403).json({ message: err.message })
  }
  return res.status(500).json({ message: 'Something went wrong. Please try again.' })
})

module.exports = app
