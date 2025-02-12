const Employee = require('../models/Employee');

const employeeResolvers = {
    getEmployees: async()=>{
      try{
        // get all the employees
        return await Employee.find({});
      }catch(e){
        throw new Error('Failed To Find Employees')
      }
    },

    getEmployee: async({eid}) => {
      try{
        // get employee by id
        return await Employee.findById(eid);
      }catch(e){
        throw new Error('Failed to Find Employee')
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
        throw new Error('No Employees Found')
      }
    },

    addEmployee: async({input})=>{
      try{
        if (await Employee.findOne({email: input.email}))
          throw new Error('Employee with given email already exists');
        const newEmployee = new Employee(input);
        return await newEmployee.save();
      }catch(e){
        throw new Error(e.message || 'Failed to Add Employee')
      }
    },

    updateEmployee: async({eid, input}) => {
      try{
        return await Employee.findByIdAndUpdate(eid, input, { new: true });
      }catch(e){
        throw new Error('Failed to Update Employee')
      }
    },

    deleteEmployee: async({eid}) => {
      try{
        if (! await Employee.findById(eid))
          throw new Error('Employee does not exists');
        if (await Employee.findByIdAndDelete(eid))
          return true
        return false
      }catch(e){
        throw new Error(e.message || 'Failed to Delete Employee')
      }
    }
};

module.exports = employeeResolvers;