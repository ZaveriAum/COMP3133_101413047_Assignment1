const express = require('express');
const { mergeSchemas } = require('@graphql-tools/schema');
const { graphqlHTTP } = require('express-graphql');
const connectDB = require('./config/db');

const userSchema = require('./schemas/userSchema');
const userResolvers = require('./resolvers/userResolvers');
const employeeSchema = require('./schemas/employeeSchema');
const employeeResolvers = require('./resolvers/employeeResolvers');

const app = express();
app.use(express.json());

connectDB();

const mergedSchema = mergeSchemas({
  schemas: [userSchema, employeeSchema],
});

const rootResolvers = {
  ...userResolvers,
  ...employeeResolvers,
};

app.use(
  "/graphql",
  graphqlHTTP({
    schema: mergedSchema,
    rootValue: rootResolvers,
    graphiql: true,
  })
);

module.exports = app;
