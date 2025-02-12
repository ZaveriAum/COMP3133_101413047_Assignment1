const { buildSchema } = require('graphql');

const userSchema = buildSchema(`
  type User {
    id: ID!
    username: String!
    email: String!
  }

  type AuthPayload {
    accessToken: String!
  }

  input SignupInput {
    username: String!
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type Query {
    login(input: LoginInput!): AuthPayload!
  }

  type Mutation {
    signup(input: SignupInput!): AuthPayload!
  }

`);

module.exports = userSchema;