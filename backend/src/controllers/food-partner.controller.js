const foodPartnerModel=require('../models/foodpartner.model')
const foodModel=require('../models/fooditme.model')


async function getFoodPartnerById(req,res){
    const foodPartnerId= req.params.id;

    const foodPartner= await foodPartnerModel.findById(foodPartnerId)
    const foodItemsByFoodPartner= await foodModel.find({foodPartner:foodPartnerId})

    if(!foodPartner){
        return res.status(404).json({
            message:"food partner not found"

    })
    }
    res.status(200).json({
        message:"food partner retrived successfully",
        foodPartner:{
            ...foodPartner.toObject(),
            foodItems:foodItemsByFoodPartner
        }
    
    })

}

module.exports={
    getFoodPartnerById
}