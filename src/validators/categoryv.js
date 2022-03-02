const {body,query}=require("express-validator")

module.exports={
    categoryv:[    
        body('name').exists().withMessage('Name is required').isString("Name should be a valid string"),
    ]
}