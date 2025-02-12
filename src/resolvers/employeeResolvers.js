const Employee = require('../models/Employee');
const AppError = require('../utilities/AppError')

const employeeResolvers = {
    getEmployees: async()=>{
      try{
        // get all the employees
        return await Employee.find({});
      }catch(e){
        throw new AppError('Failed To Find Employees', 400)
      }
    },

    getEmployee: async({eid}) => {
      try{
        // get employee by id
        return await Employee.findById(eid);
      }catch(e){
        throw new AppError('Failed to Find Employee', 400)
      }
    },

    getEmployeeDesignationOrDepartment: async({query}) => {
      try{
        // get employees by designation or department
        return await Employee.find({
            $or: [
                { designation: { $regex: search_query, $options: 'i' } },
                { department: { $regex: search_query, $options: 'i' } },
            ],
        });
      }catch(e){
        throw new AppError('Failed to Find Employees', 400)
      }
    },

    addEmployee: async({input})=>{
      try{
        if (await Employee.findOne({email: input.email}))
          throw new AppError('Employee with given email already exists', 400);
        const newEmployee = new Employee(input);
        return await newEmployee.save();
      }catch(e){
        throw new AppError(e.message || 'Failed to Add Employee', e.statusCode || 500)
      }
    },

    updateEmployee: async({eid, input}) => {
      try{
        return await Employee.findByIdAndUpdate(eid, input, { new: true });
      }catch(e){
        throw new AppError('Failed to Update Employee', 400)
      }
    },

    deleteEmployee: async({eid}) => {
      try{
        if (! await Employee.findById(eid))
          throw new AppError('Employee does not exists', 400);
        if (await Employee.findByIdAndDelete(eid))
          return true
        return false
      }catch(e){
        throw new AppError(e.message || 'Failed to Delete Employee', e.statusCode || 500)
      }
    }
};

module.exports = employeeResolvers;