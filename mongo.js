const mongoose = require('mongoose');
require('dotenv').config();
const url = process.env.URL;
const connectTomongo = async () => {
    try {
        await mongoose.connect("mongodb+srv://vinay1000:Vinay2005@cluster0.cwghf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",{
         });
         console.log("We are connected to the MongoDB Server");
    } catch (error) {
       console.log("Something error while connecting to the databse");
    }
}

module.exports = connectTomongo;
