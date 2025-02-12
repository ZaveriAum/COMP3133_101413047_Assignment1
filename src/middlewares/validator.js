const { validationResult } = require('express-validator');
const AppError = require('../utilities/AppError');

const validator = (req) => {
    console.log("Here")
    console.log(req)
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        throw new AppError (errors.array()[0].msg, 400);
    }
}

module.exports = validator
