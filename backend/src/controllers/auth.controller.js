const userModel = require('../models/user.model')
const foodPartnerModel = require('../models/foodpartner.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const isProduction = process.env.NODE_ENV === 'production'
const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/',
}

function issueToken(id) {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not configured')
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

function clearAuthCookie(res) {
  res.clearCookie('token', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
  })
}

function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim())
}

async function registerUser(req, res) {
  try {
    const fullName = String(req.body.fullName || '').trim()
    const email = String(req.body.email || '').trim().toLowerCase()
    const password = String(req.body.password || '')
    if (!fullName || !validEmail(email) || password.length < 8) {
      return res.status(400).json({ message: 'Enter your name, a valid email and a password of at least 8 characters.' })
    }
    if (await userModel.findOne({ email })) return res.status(409).json({ message: 'An account with this email already exists.' })
    const user = await userModel.create({ fullName, email, password: await bcrypt.hash(password, 10) })
    res.cookie('token', issueToken(user._id), cookieOptions)
    return res.status(201).json({ message: 'Account created successfully.', user: { _id: user._id, email: user.email, fullName: user.fullName } })
  } catch (error) {
    console.error('Register user error:', error)
    return res.status(500).json({ message: 'Could not create your account. Please try again.' })
  }
}

async function loginUser(req, res) {
  try {
    const email = String(req.body.email || '').trim().toLowerCase()
    const password = String(req.body.password || '')
    const user = await userModel.findOne({ email })
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }
    res.cookie('token', issueToken(user._id), cookieOptions)
    return res.status(200).json({ message: 'Signed in successfully.', user: { _id: user._id, email: user.email, fullName: user.fullName } })
  } catch (error) {
    console.error('Login user error:', error)
    return res.status(500).json({ message: 'Could not sign in. Please try again.' })
  }
}

function logoutUser(req, res) {
  clearAuthCookie(res)
  return res.status(200).json({ message: 'Signed out successfully.' })
}

async function registerFoodPartner(req, res) {
  try {
    const name = String(req.body.name || '').trim()
    const contactName = String(req.body.contactName || '').trim()
    const phone = String(req.body.phone || '').trim()
    const address = String(req.body.address || '').trim()
    const email = String(req.body.email || '').trim().toLowerCase()
    const password = String(req.body.password || '')
    if (!name || !contactName || !phone || !address || !validEmail(email) || password.length < 8) {
      return res.status(400).json({ message: 'Complete all partner details and use a valid email and password of at least 8 characters.' })
    }
    if (await foodPartnerModel.findOne({ email })) return res.status(409).json({ message: 'A food partner account with this email already exists.' })
    const foodPartner = await foodPartnerModel.create({ name, contactName, phone, address, email, password: await bcrypt.hash(password, 10) })
    res.cookie('token', issueToken(foodPartner._id), cookieOptions)
    return res.status(201).json({ message: 'Food partner account created successfully.', foodPartner: { _id: foodPartner._id, email: foodPartner.email, name: foodPartner.name, address: foodPartner.address, contactName: foodPartner.contactName, phone: foodPartner.phone } })
  } catch (error) {
    console.error('Register food partner error:', error)
    return res.status(500).json({ message: 'Could not create partner account. Please try again.' })
  }
}

async function loginFoodPartner(req, res) {
  try {
    const email = String(req.body.email || '').trim().toLowerCase()
    const password = String(req.body.password || '')
    const foodPartner = await foodPartnerModel.findOne({ email })
    if (!foodPartner || !(await bcrypt.compare(password, foodPartner.password))) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }
    res.cookie('token', issueToken(foodPartner._id), cookieOptions)
    return res.status(200).json({ message: 'Signed in successfully.', foodPartner: { _id: foodPartner._id, email: foodPartner.email, name: foodPartner.name } })
  } catch (error) {
    console.error('Login food partner error:', error)
    return res.status(500).json({ message: 'Could not sign in. Please try again.' })
  }
}

function logoutFoodPartner(req, res) {
  clearAuthCookie(res)
  return res.status(200).json({ message: 'Food partner signed out successfully.' })
}

module.exports = { registerUser, loginUser, logoutUser, registerFoodPartner, loginFoodPartner, logoutFoodPartner }
