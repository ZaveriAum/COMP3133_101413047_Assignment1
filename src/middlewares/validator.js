const { validationResult } = require('express-validator');
const AppError = require('../utilities/AppError');

const validator = async (input, validations) => {
    for (const validation of validations) {
      await validation.run(input);
    }
  
    const errors = validationResult({ body: input });
  
    if (!errors.isEmpty()) {
      throw new AppError(errors.array()[0].msg, 400);
    }
};

module.exports = validator
