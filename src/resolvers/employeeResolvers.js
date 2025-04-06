const Employee = require('../models/Employee');
const AppError = require('../utilities/AppError')
const {uploadFile, deleteFile, getObjectSignedUrl} = require('../services/s3Service')
const employeeValidations = require('../utilities/validations/employeeValidations')
const validator = require('../middlewares/validator')

const employeeResolvers = {
  getEmployees: async ({}, context) => {
      try{
        if(!context.req.user)
          throw new AppError('Forbidden', 403)
        // get all the employees
        const emps = await Employee.find({});
        await Promise.all(
          emps.map(async (emp)=>{
            if(emp.employee_photo)
              emp.employee_photo = await getObjectSignedUrl(emp.employee_photo)
          })
        );
        return emps;
      }catch(e){
        throw new AppError(e.message || 'Failed To Fetch Employees', e.statusCode || 500)
      }
    },

    getEmployee: async({eid}, context) => {
      try{
        if(!context.req.user)
          throw new AppError('Forbidden', 403)

        // get employee by id
        const emp = await Employee.findById(eid);
        if(emp.employee_photo)
          emp.employee_photo = await getObjectSignedUrl(emp.employee_photo);
        return emp
      }catch(e){
        throw new AppError(e.message || 'Failed to Find Employee', e.statusCode || 400)
      }
    },

    getEmployeeDesignationOrDepartment: async({query}, context) => {
      try{

        if(!context.req.user)
          throw new AppError('Forbidden', 403)

        // get employees by designation or department
        const emps = await Employee.find({
            $or: [
                { designation: { $regex: query, $options: 'i' } },
                { department: { $regex: query, $options: 'i' } },
            ],
        });

        await Promise.all(
          emps.map(async (emp)=>{
            if(emp.employee_photo)
              emp.employee_photo = await getObjectSignedUrl(emp.employee_photo)
          })
        );

        return emps;
      }catch(e){
        throw new AppError(e.message || 'Failed to Find Employees', 400)
      }
    },

    addEmployee: async({input}, context)=>{
      try{
        if(!context.req.user)
          throw new AppError('Forbidden', 403)

        await validator(input, employeeValidations.validateAddEmployee)

        if (await Employee.findOne({email: input.email}))
          throw new AppError('Employee with given email already exists', 400);
        
        let employee_photo = null;
        if (context.req.file) {
          const {buffer, originalname, mimetype} = context.req.file;
          employee_photo = await uploadFile(buffer, originalname, mimetype, 'employee-profile-photos')
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

        await validator(input, employeeValidations.validateAddEmployee)

        const emp = await Employee.findById(eid);
        let employee_photo = null;
        if (context.req.file) {
          if(emp.employee_photo)
            await deleteFile(emp.employee_photo)
          
          const {buffer, originalname, mimetype} = context.req.file;
          employee_photo = await uploadFile(buffer, originalname, mimetype, 'employee-profile-photos')
        }

        return await Employee.findByIdAndUpdate(eid, {...input, employee_photo: employee_photo}, { new: true });
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