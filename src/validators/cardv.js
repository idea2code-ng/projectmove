const {body,query}=require("express-validator")

module.exports={
    cardv:[
        body('card_number').exists().withMessage('Cardnumber is required').isLength({ min: 12, max:12}).withMessage("CardNumber should be a 12 digit").isNumeric().withMessage('Only Decimals allowed'),    
        body('card_holder_name').exists().withMessage('CardHolderName is required').isString("CardholderName should be a valid string"),
        body('expiry_date').exists().withMessage('Expire Date  is required').isString("Expire date should be a valid string"),
        body('cvv').exists().withMessage('Cvv is required').isLength({ min: 3, max:3 }).withMessage("Cvv should be a 3 digit").isNumeric().withMessage('Only Decimals allowed'),    
    ]
}