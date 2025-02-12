require('dotenv').config()

const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
      throw new Error('Internal Server Error');
    }
  },

  signup : async({input})=>{
    try{
      if (await User.findOne({email: input.email}))
        throw new Error('User Already Exists');
      
      const hashedPassword = await bcrypt.hash(input.password, 10);
      const newEmployee = new User({username: input.username, email: input.email, password: hashedPassword});
      const tokens = await userResolvers.getTokens(input.email);
      await newEmployee.save();
      return tokens    
    }catch(e){
      throw new Error(e.message || 'Signup Failed');
    }
  },
  
  login : async ({input})=> {
    try{
      const existing_user = await User.findOne({email: input.email});
      
      if (!existing_user)
        throw new Error('User Does Not Exists');

        const isMatch = await bcrypt.compare(input.password, existing_user.password);
      if (!isMatch) {
          throw new Error("Invalid Credentials");
      }

      return await userResolvers.getTokens(input.email);
    }catch(e){
      throw new Error(e.message || 'Login Failed');
    }
  }
};

module.exports = userResolvers;