const mongoose = require('mongoose')

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  video: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  foodPartner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'foodpartner',
    required: true,
  },
  likeCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  savesCount: {
    type: Number,
    default: 0,
    min: 0,
  },
}, { timestamps: true })

const foodModel = mongoose.model('food', foodSchema)

module.exports = foodModel
