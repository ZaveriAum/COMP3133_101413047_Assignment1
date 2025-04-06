require('dotenv').config()

const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AppError = require('../utilities/AppError');
const userValidations = require('../utilities/validations/userValidations');
const validator = require('../middlewares/validator');

const getTokens = (email) => {
  try{
    const accessToken = jwt.sign({email: email}, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign({email: email}, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "7d",
    });
    return {accessToken, refreshToken};
  }catch(e){
    throw new AppError('Internal Server Error', 500);
  }
}

const userResolvers = {

  signup : async({input}, {res})=>{
    try{
      if (await User.findOne({email: input.email}))
        throw new AppError('User Already Exists', 400);
      
      const hashedPassword = await bcrypt.hash(input.password, 10);
      const newEmployee = new User({username: input.username, email: input.email, password: hashedPassword});
      const tokens = getTokens(input.email);
      await newEmployee.save();
      res.cookie("jwt", tokens.refreshToken, {
        httpOnly: true,
        domain: undefined,
        secure: true,
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
      });
      return { accessToken : tokens.accessToken }
    }catch(e){
      throw new AppError(e.message || 'Signup Failed', e.statusCode || 500);
    }
  },
  
  login : async ({input}, {res})=> {
    try{
      const existing_user = await User.findOne({email: input.email});
      
      if (!existing_user)
        throw new AppError('User Does Not Exists', 400);

        const isMatch = await bcrypt.compare(input.password, existing_user.password);
      if (!isMatch) {
          throw new AppError("Invalid Credentials", 401);
      }

      const tokens = getTokens(input.email);
      res.cookie("jwt", tokens.refreshToken, {
        httpOnly: true,
        domain: undefined,
        secure: true,
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
      });
      return { accessToken : tokens.accessToken }
    }catch(e){
      throw new AppError(e.message || 'Login Failed', e.statusCode || 500);
    }
  },

  refreshToken: async ({ req, res }) => {
    const token = req.cookies.refreshToken;

    if (!token)
      throw new Error("Unauthorized - No refresh token");

    try {
      const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
      const user = await User.findOne({email: decoded.email});
      if (!user) {
        throw new Error("User not found");
      }

      const tokens = getTokens(email);

      res.cookie("jwt", tokens.refreshToken, {
        httpOnly: true,
        domain: undefined,
        secure: true,
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
      });

      return { accessToken: tokens.accessToken };
    } catch (error) {
      throw new Error("Invalid refresh token");
    }
  },
};

module.exports = userResolvers;