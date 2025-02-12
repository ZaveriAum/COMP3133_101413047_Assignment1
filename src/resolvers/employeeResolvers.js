const Employee = require('../models/Employee');
const AppError = require('../utilities/AppError')
const {uploadFile, deleteFile} = require('../services/s3Service')

const employeeResolvers = {
  getEmployees: async ({}, context) => {
      try{
        if(!context.req.user)
          throw new AppError('Forbidden', 403)
        // get all the employees
        return await Employee.find({});
      }catch(e){
        throw new AppError(e.message || 'Failed To Fetch Employees', e.statusCode || 500)
      }
    },

    getEmployee: async({eid}, context) => {
      try{
        if(!context.req.user)
          throw new AppError('Forbidden', 403)

        // get employee by id
        return await Employee.findById(eid);
      }catch(e){
        throw new AppError(e.message || 'Failed to Find Employee', e.statusCode || 400)
      }
    },

    getEmployeeDesignationOrDepartment: async({query}, context) => {
      try{

        if(!context.req.user)
          throw new AppError('Forbidden', 403)

        // get employees by designation or department
        return await Employee.find({
            $or: [
                { designation: { $regex: query, $options: 'i' } },
                { department: { $regex: query, $options: 'i' } },
            ],
        });
      }catch(e){
        throw new AppError(e.message || 'Failed to Find Employees', 400)
      }
    },

    addEmployee: async({input}, context)=>{
      try{
        if(!context.req.user)
          throw new AppError('Forbidden', 403)

        if (await Employee.findOne({email: input.email}))
          throw new AppError('Employee with given email already exists', 400);
        
        let employee_photo = null;
        if (context.req.file) {
          const {buffer, originalname, mimetype} = context.req.file;
          employee_photo = await uploadFile(buffer, originalname, mimetype, 'employee-profile-photos')
        }else {
          throw new AppError('Unexpected Error', 500)
        }
        const newEmployee = new Employee({...input, employee_photo: employee_photo});
        return await newEmployee.save();
      }catch(e){
        throw new AppError(e.message || 'Failed to Add Employee', e.statusCode || 500)
      }
    },

    updateEmployee: async({eid, input}, context) => {
      try{
        if(!context.req.user)
          throw new AppError('Forbidden', 403)
        return await Employee.findByIdAndUpdate(eid, input, { new: true });
      }catch(e){
        throw new AppError(e.message ||'Failed to Update Employee',e.statusCode || 400)
      }
    },

    deleteEmployee: async({eid}, context) => {
      try{
        if(!context.req.user)
          throw new AppError('Forbidden', 403)
        
        const emp = await Employee.findById(eid) 
        
        if (!emp)
          throw new AppError('Employee does not exists', 400);
        
        if(emp.employee_photo)
          await deleteFile(emp.employee_photo)
        
        if (await Employee.findByIdAndDelete(eid))
          return true
        return false
      }catch(e){
        throw new AppError(e.message || 'Failed to Delete Employee', e.statusCode || 500)
      }
    }
};

module.exports = employeeResolvers;