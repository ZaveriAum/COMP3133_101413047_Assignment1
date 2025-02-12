require('dotenv').config()

const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AppError = require('../utilities/AppError')

const userResolvers = {
  
  getTokens: async(email) => {
    try{
      const accessToken = jwt.sign({email: email}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m",
      });
      const refreshToken = jwt.sign({email: email}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "7d",
      });
      return {accessToken, refreshToken};
    }catch(e){
      console.log(e)
      throw new AppError('Internal Server Error', 500);
    }
  },

  signup : async({input})=>{
    try{
      if (await User.findOne({email: input.email}))
        throw new AppError('User Already Exists', 400);
      
      const hashedPassword = await bcrypt.hash(input.password, 10);
      const newEmployee = new User({username: input.username, email: input.email, password: hashedPassword});
      const tokens = await userResolvers.getTokens(input.email);
      await newEmployee.save();
      return tokens    
    }catch(e){
      throw new AppError(e.message || 'Signup Failed', e.statusCode || 500);
    }
  },
  
  login : async ({input})=> {
    try{
      const existing_user = await User.findOne({email: input.email});
      
      if (!existing_user)
        throw new AppError('User Does Not Exists', 400);

        const isMatch = await bcrypt.compare(input.password, existing_user.password);
      if (!isMatch) {
          throw new AppError("Invalid Credentials", 401);
      }

      return await userResolvers.getTokens(input.email);
    }catch(e){
      throw new AppError(e.message || 'Login Failed', e.statusCode || 500);
    }
  }
};

module.exports = userResolvers;