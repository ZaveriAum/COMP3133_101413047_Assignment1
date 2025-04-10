const express = require('express');
const { mergeSchemas } = require('@graphql-tools/schema');
const { graphqlHTTP } = require('express-graphql');
const connectDB = require('./config/db');
const multer = require('multer');
const userSchema = require('./schemas/userSchema');
const userResolvers = require('./resolvers/userResolvers');
const employeeSchema = require('./schemas/employeeSchema');
const employeeResolvers = require('./resolvers/employeeResolvers');
const authenticateToken = require('./middlewares/jwtAuth')
const cors = require('cors')
const app = express();

app.use(express.json());

app.use(cors({
  origin: "https://101413047-comp3133-assignment2.vercel.app",
  credentials: true,
}));

app.use(authenticateToken);

connectDB();

const mergedSchema = mergeSchemas({
  schemas: [userSchema, employeeSchema],
});

const rootResolvers = {
  ...userResolvers,
  ...employeeResolvers,
};

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(
  "/graphql",
  upload.single('employee_photo'),
  graphqlHTTP((req, res)=>({
    schema: mergedSchema,
    rootValue: { ... rootResolvers},
    context: {req, res},
    graphiql: true,
    customFormatErrorFn: (e) => {
      return {
        message: e.message || "Internal Server Error",
        statusCode: e.originalError?.statusCode || 500
      };
    }
  }))
);

module.exports = app;
