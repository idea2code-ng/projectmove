const {body,query}=require("express-validator")

module.exports={
    fleetv:[    
        body('name').exists().withMessage('Name is required').isString("Name should be a valid string"),
        body('capacity').exists().withMessage("capacity is required").isString("capacity should be a valid string"),
        body('price').exists().withMessage("price is required").isString("price should be a valid string")
    ]
}