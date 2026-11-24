const express = require('express')
const foodController = require('../controllers/food.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const multer = require('multer')
const router = express.Router()

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024, files: 1 },
  fileFilter(req, file, callback) {
    if (!file.mimetype || !file.mimetype.startsWith('video/')) {
      return callback(new Error('Please upload a valid video file.'))
    }
    return callback(null, true)
  },
})

router.post('/', authMiddleware.authFoodPartnerMiddleware, upload.single('video'), foodController.createFood)
router.get('/', authMiddleware.authUserMiddleware, foodController.getFoodItems)
router.post('/like', authMiddleware.authUserMiddleware, foodController.likeFood)
router.post('/save', authMiddleware.authUserMiddleware, foodController.saveFood)
router.get('/save', authMiddleware.authUserMiddleware, foodController.getSavedFood)

module.exports = router
