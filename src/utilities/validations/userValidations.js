const { check } = require('express-validator');

const userValidations  = {

    validateSignup : [
        check("username").notEmpty().withMessage("Username is required"),
        check("email").isEmail().withMessage("Invalid email format"),
        check("password").notEmpty().withMessage("Last name is required").isLength({min: 8}).withMessage("Confirm Password must be same as Password"),
    ],

};

module.exports = userValidations