# COMP3133_101413047_Assignment1 - Employee Management System

This project implements a GraphQL API for an Employee Management System using Node.js, Express, GraphQL, and MongoDB. It adheres to the assignment specifications for COMP 3133 - Full Stack Development II.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Testing](#testing)
- [Deployment](#deployment)
- [Screenshots](#screenshots)
- [Postman Collection](#postman-collection)
- [Sample User Details](#sample-user-details)
- [GitHub Repository](#github-repository)
- [Comments](#comments)

## Introduction

This project provides a backend API for managing employees and users within an organization. It utilizes GraphQL for defining the API structure and MongoDB for data persistence. The project also includes input validation, error handling, and is designed for easy deployment.

## Features

- User authentication (signup and login)
- Employee management (add, get, update, delete, search)
- Input validation using `express-validator`
- Error handling with custom error responses
- JWT for API security

## Technologies Used

- Node.js
- Express.js
- GraphQL (`express-graphql`)
- MongoDB
- `express-validator`
- `bcrypt` (for password hashing)
- `jsonwebtoken` (Optional - for JWT)
- `multer` (for file uploads)

## Installation

1. Clone the repository: `git clone https://github.com/ZaveriAum/COMP3133_101413047_Assignment1.git`
2. Navigate to the project directory: `cd COMP3133_101413047_Assignment1`
3. Install dependencies: `npm install`
4. Create a `.env` file in the root directory and add your environment variables (e.g., MongoDB connection string, JWT secret).
   Example:
   - MONGODB_URI=
   - SERVER_PORT=
   - ACCESS_TOKEN_SECRET=
   - REFRESH_TOKEN_SECRET=
   - AWS_ACCESS_KEY=
   - AWS_SECRET_KEY=
   - AWS_REGION=
   - AWS_BUCKET_NAME=

## Usage

1. Start the server: `npm start`
2. Access the GraphQL API: `http://localhost:4000/graphql`
3. Use GraphiQL or Postman to interact with the API.

## API Endpoints

| Method   | Operation                               | Description                                        |
| -------- | --------------------------------------- | -------------------------------------------------- |
| Mutation | Signup                                  | Create a new user account.                         |
| Query    | Login                                   | Authenticate a user and receive an access token.   |
| Query    | getAllEmployees                         | Retrieve a list of all employees.                  |
| Mutation | addEmployee                             | Create a new employee.                             |
| Query    | searchEmployeeById                      | Retrieve an employee by their ID.                  |
| Mutation | updateEmployeeById                      | Update an existing employee's information.         |
| Mutation | deleteEmployeeById                      | Delete an employee by their ID.                    |
| Query    | searchEmployeeByDesignationOrDepartment | Search for employees by designation or department. |

_(Detailed request/response examples for each endpoint will be included in the Postman collection and screenshots.)_

## Database Schema

**MongoDB Database Name:** `comp3133__StudentID_assigment1`

**Users Collection:**

| Field Name | Type     | Constraint     |
| ---------- | -------- | -------------- |
| \_id       | ObjectId | Auto-generated |
| username   | String   | Primary Key    |
| email      | String   | Unique         |
| password   | String   | Encrypted      |
| created_at | Date     |                |
| updated_at | Date     |                |

**Employee Collection:**

| Field Name      | Type     | Constraint         |
| --------------- | -------- | ------------------ |
| \_id            | ObjectId | Auto-generated     |
| first_name      | String   | Required           |
| last_name       | String   | Required           |
| email           | String   | Unique             |
| gender          | String   | Male/Female/Other  |
| designation     | String   | Required           |
| salary          | Float    | Required (>= 1000) |
| date_of_joining | Date     | Required           |
| department      | String   | Required           |
| employee_photo  | String   | Image name/path    |
| created_at      | Date     |                    |
| updated_at      | Date     |                    |
