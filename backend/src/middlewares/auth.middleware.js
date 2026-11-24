const foodPartnerModel = require('../models/foodpartner.model')
const jwt = require('jsonwebtoken')
const userModel = require('../models/user.model')

function readToken(req) {
  const token = req.cookies?.token
  if (!token) return null
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not configured')
  return jwt.verify(token, process.env.JWT_SECRET)
}

async function authFoodPartnerMiddleware(req, res, next) {
  try {
    const decoded = readToken(req)
    if (!decoded) {
      return res.status(401).json({ message: 'Please sign in as a food partner first.' })
    }
    const foodPartner = await foodPartnerModel.findById(decoded.id)
    if (!foodPartner) {
      res.clearCookie('token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax' })
      return res.status(401).json({ message: 'Food partner account not found. Please sign in again.' })
    }
    req.foodPartner = foodPartner
    return next()
  } catch (error) {
    return res.status(401).json({ message: 'Your session is invalid or has expired. Please sign in again.' })
  }
}

async function authUserMiddleware(req, res, next) {
  try {
    const decoded = readToken(req)
    if (!decoded) {
      return res.status(401).json({ message: 'Please sign in to continue.' })
    }
    const user = await userModel.findById(decoded.id)
    if (!user) {
      res.clearCookie('token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax' })
      return res.status(401).json({ message: 'User account not found. Please sign in again.' })
    }
    req.user = user
    return next()
  } catch (error) {
    return res.status(401).json({ message: 'Your session is invalid or has expired. Please sign in again.' })
  }
}

module.exports = { authFoodPartnerMiddleware, authUserMiddleware }
