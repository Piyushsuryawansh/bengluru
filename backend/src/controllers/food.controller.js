const mongoose = require('mongoose')
const foodModel = require('../models/fooditme.model')
const likeModel = require('../models/likes.model')
const saveModel = require('../models/save.model')
const storageService = require('../services/storage.service')
const { v4: uuid } = require('uuid')

async function createFood(req, res) {
  try {
    if (!req.foodPartner) {
      return res.status(401).json({ message: 'Please sign in as a food partner.' })
    }
    if (!req.file) {
      return res.status(400).json({ message: 'Please select a video to upload.' })
    }
    const name = String(req.body.name || '').trim()
    const description = String(req.body.description || '').trim()
    if (!name) return res.status(400).json({ message: 'Food name is required.' })

    const videoUrl = await storageService.uploadFile(req.file.buffer, `${uuid()}-${req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, '-')}`)
    const foodItem = await foodModel.create({
      name,
      description,
      video: videoUrl,
      foodPartner: req.foodPartner._id,
    })

    return res.status(201).json({ message: 'Food created successfully.', food: foodItem })
  } catch (error) {
    console.error('Create food error:', error)
    return res.status(500).json({ message: 'Video upload failed. Check storage configuration and try again.' })
  }
}

async function getFoodItems(req, res) {
  try {
    const foodItems = await foodModel.find({})
      .select('-__v')
      .populate('foodPartner', 'name address')
      .sort({ createdAt: -1 })
      .lean()
    return res.status(200).json({ message: 'Food items fetched successfully.', foodItems })
  } catch (error) {
    console.error('Get food items error:', error)
    return res.status(500).json({ message: 'Failed to fetch food items.' })
  }
}

async function likeFood(req, res) {
  try {
    const { foodId } = req.body
    if (!mongoose.isValidObjectId(foodId)) return res.status(400).json({ message: 'Invalid food item.' })
    const food = await foodModel.findById(foodId)
    if (!food) return res.status(404).json({ message: 'Food item not found.' })

    const existing = await likeModel.findOne({ user: req.user._id, food: foodId })
    if (existing) {
      await likeModel.deleteOne({ _id: existing._id })
      await foodModel.updateOne({ _id: foodId, likeCount: { $gt: 0 } }, { $inc: { likeCount: -1 } })
      return res.status(200).json({ message: 'Food unliked successfully.', like: false })
    }
    try {
      await likeModel.create({ user: req.user._id, food: foodId })
    } catch (error) {
      if (error.code === 11000) return res.status(200).json({ message: 'Food already liked.', like: true })
      throw error
    }
    await foodModel.updateOne({ _id: foodId }, { $inc: { likeCount: 1 } })
    return res.status(200).json({ message: 'Food liked successfully.', like: true })
  } catch (error) {
    console.error('Like food error:', error)
    return res.status(500).json({ message: 'Failed to update like.' })
  }
}

async function saveFood(req, res) {
  try {
    const { foodId } = req.body
    if (!mongoose.isValidObjectId(foodId)) return res.status(400).json({ message: 'Invalid food item.' })
    const food = await foodModel.findById(foodId)
    if (!food) return res.status(404).json({ message: 'Food item not found.' })

    const existing = await saveModel.findOne({ user: req.user._id, food: foodId })
    if (existing) {
      await saveModel.deleteOne({ _id: existing._id })
      await foodModel.updateOne({ _id: foodId, savesCount: { $gt: 0 } }, { $inc: { savesCount: -1 } })
      return res.status(200).json({ message: 'Food removed from saved items.', save: false })
    }
    try {
      await saveModel.create({ user: req.user._id, food: foodId })
    } catch (error) {
      if (error.code === 11000) return res.status(200).json({ message: 'Food is already saved.', save: true })
      throw error
    }
    await foodModel.updateOne({ _id: foodId }, { $inc: { savesCount: 1 } })
    return res.status(200).json({ message: 'Food saved successfully.', save: true })
  } catch (error) {
    console.error('Save food error:', error)
    return res.status(500).json({ message: 'Failed to update saved items.' })
  }
}

async function getSavedFood(req, res) {
  try {
    const savedItems = await saveModel.find({ user: req.user._id })
      .populate({ path: 'food', populate: { path: 'foodPartner', select: 'name address' } })
      .sort({ createdAt: -1 })
    const foodItems = savedItems.filter(item => item.food).map(item => item.food)
    return res.status(200).json({ message: 'Saved food items fetched successfully.', foodItems })
  } catch (error) {
    console.error('Get saved food error:', error)
    return res.status(500).json({ message: 'Failed to fetch saved food items.' })
  }
}

module.exports = { createFood, getFoodItems, likeFood, saveFood, getSavedFood }
