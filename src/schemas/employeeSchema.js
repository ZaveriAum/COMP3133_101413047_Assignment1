const { buildSchema } = require('graphql');

const employeeSchema = buildSchema(`
  type Employee {
    id: ID
    first_name: String!
    last_name: String!
    email: String!
    gender: String!
    designation: String!
    salary: Float!
    date_of_joining: String!
    department: String!
    employee_photo: String
    createdAt: String!
    updatedAt: String!
  }

  input AddEmployeeInput {
    first_name: String!
    last_name: String!
    email: String!
    gender: String!
    designation: String!
    salary: Float!
    date_of_joining: String!
    department: String!
  }

  input UpdateEmployeeInput {
    first_name: String
    last_name: String
    email: String
    gender: String
    designation: String
    salary: Float
    date_of_joining: String
    department: String
  }


  type Query {
    getEmployees: [Employee]
    getEmployee(eid: ID!): Employee
    getEmployeeByDesignationOrDepartment(query: String!): [Employee]
  }

  type Mutation {
    addEmployee(input: AddEmployeeInput!): Employee!
    updateEmployee(eid: ID!, input: UpdateEmployeeInput!): Employee!
    deleteEmployee(eid: ID!): Boolean!
  }
`);

module.exports = employeeSchema;