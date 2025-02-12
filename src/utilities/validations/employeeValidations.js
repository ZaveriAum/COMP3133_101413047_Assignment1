const { check } = require('express-validator');

const employeeValidations  = {
    validateAddEmployee : [
        check("first_name").notEmpty().withMessage("First name is required"),
        check("last_name").notEmpty().withMessage("Last name is required"),
        check("email").isEmail().withMessage("Invalid email format"),
        check("gender").isIn(["Male", "Female", "Other"]).withMessage("Invalid gender"),
        check("designation").notEmpty().withMessage("Designation is required"),
        check("salary").isFloat({ min: 0 }).withMessage("Salary must be a positive number"),
        check("date_of_joining").isISO8601().withMessage("Invalid date format"),
        check("department").notEmpty().withMessage("Department is required")
      ]
};

module.exports = employeeValidations