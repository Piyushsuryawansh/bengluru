const foodPartnerModel = require('../models/foodpartner.model')
const foodModel = require('../models/fooditme.model')

async function getFoodPartnerById(req, res) {
  try {
    const foodPartnerId = req.params.id
    if (!/^[a-f\d]{24}$/i.test(foodPartnerId)) {
      return res.status(400).json({ message: 'Invalid food partner ID.' })
    }

    const foodPartner = await foodPartnerModel.findById(foodPartnerId)
      .select('-password -__v')
      .lean()

    if (!foodPartner) {
      return res.status(404).json({ message: 'Food partner not found.' })
    }

    const foodItems = await foodModel.find({ foodPartner: foodPartnerId })
      .select('-__v')
      .sort({ createdAt: -1 })
      .lean()

    return res.status(200).json({
      message: 'Food partner retrieved successfully.',
      foodPartner: {
        ...foodPartner,
        foodItems,
        totalMeals: foodItems.length,
        customersServed: 0,
      },
    })
  } catch (error) {
    console.error('Get food partner profile error:', error)
    return res.status(500).json({ message: 'Failed to load food partner profile.' })
  }
}

module.exports = { getFoodPartnerById }
