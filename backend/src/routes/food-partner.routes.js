const express = require('express')
const foodPartnerController = require('../controllers/food-partner.controller')

const router = express.Router()

// Public restaurant/food partner profiles are viewable without an account.
router.get('/:id', foodPartnerController.getFoodPartnerById)

module.exports = router
