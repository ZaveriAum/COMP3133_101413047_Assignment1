//helper function to connect to MongoDB asychronously
require('dotenv').config()

const mongoose = require('mongoose')
const connectDB = () => {
    try{
        mongoose.connect(process.env.MONGODB_URI)
        .then( () => {
            console.log(`Connected To DB`)
        }).catch( (err) => {
            console.log(`Error while connecting to MongoDB : ${JSON.stringify(err)}`)
        });
    }catch(error){
        console.log(`Unable to connect to DB : ${error.message}`);
        
    }
}

module.exports = connectDB