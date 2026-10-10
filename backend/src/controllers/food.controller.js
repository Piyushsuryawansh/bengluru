const foodModel=require('../models/fooditme.model')
const likeModel=require('../models/likes.model')
const saveModel=require('../models/save.model')
const storageService=require('../services/storage.service')
const { v4:uuid}=require('uuid')

async function createFood(req,res){
    console.log(req.foodPartner)
    console.log(req.file)
    console.log(req.body)
     const fileUploadResult= await storageService.uploadFile(req.file.buffer,uuid())
      
   const foodItem= await foodModel.create({
    name:req.body.name,
    description:req.body.description,
    video:fileUploadResult,
    foodPartner:req.foodPartner._id
   })   
    
   res.status(201).json({
    message:"food created successfully",
    food:foodItem
   })
}
async function getFoodItems(req,res){
    const foodItems=await foodModel.find({})
    res.status(200).json({
        message:"Food items fetched successfully",
        foodItems
    })
}



async function likeFood(req, res) {
    try {
        const { foodId } = req.body;
        const user = req.user;

        if (!user) {
            return res.status(401).json({
                message: "User not authenticated"
            });
        }

        const isAlreadyLiked = await likeModel.findOne({
            user: user._id,
            food: foodId
        });

        if (isAlreadyLiked) {
            await likeModel.deleteOne({
                user: user._id,
                food: foodId
            });

            await foodModel.findByIdAndUpdate(foodId, {
                $inc: { likeCount: -1 }
            });

            return res.status(200).json({
                message: "Food unliked successfully",
                like: false
            });
        }

        await likeModel.create({
            user: user._id,
            food: foodId
        });

        await foodModel.findByIdAndUpdate(foodId, {
            $inc: { likeCount: 1 }
        });

        return res.status(200).json({
            message: "Food liked successfully",
            like: true
        });

    } catch (error) {
        console.error("Like food error:", error);

        return res.status(500).json({
            message: "Failed to like food",
            error: error.message
        });
    }
}



async function saveFood(req, res) {
    try {
        const { foodId } = req.body;
        const user = req.user;

        if (!user) {
            return res.status(401).json({
                message: "User not authenticated"
            });
        }

        const isAlreadySaved = await saveModel.findOne({
            user: user._id,
            food: foodId
        });

        if (isAlreadySaved) {
            await saveModel.deleteOne({
                user: user._id,
                food: foodId
            });

            await foodModel.findByIdAndUpdate(foodId, {
                $inc: { savesCount: -1 }
            });

            return res.status(200).json({
                message: "Food unsaved successfully",
                save: false
            });
        }

        await saveModel.create({
            user: user._id,
            food: foodId
        });

        await foodModel.findByIdAndUpdate(foodId, {
            $inc: { savesCount: 1 }
        });

        return res.status(200).json({
            message: "Food saved successfully",
            save: true
        });

    } catch (error) {
        console.error("Save food error:", error);

        return res.status(500).json({
            message: "Failed to save food",
            error: error.message
        });
    }
}

async function getSavedFood(req, res) {
    try {
        const userId = req.user._id;

        const savedItems = await saveModel
            .find({ user: userId })
            .populate('food');

        const foodItems = savedItems
            .filter(item => item.food)
            .map(item => item.food);

        return res.status(200).json({
            message: "Saved food items fetched successfully",
            foodItems
        });
    } catch (error) {
        console.error("Get saved food error:", error);

        return res.status(500).json({
            message: "Failed to fetch saved food items"
        });
    }
}



module.exports={
    createFood,
    getFoodItems,
    likeFood,
    saveFood,
    getSavedFood
}