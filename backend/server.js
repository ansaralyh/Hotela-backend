const app = require('./app')
const express = require('express')
const dotenv = require('dotenv')
const connectToDb = require('./config/db')
dotenv.config({path:'./.env'})



// handling uncaught errors
process.on("uncaughtException", err => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to uncaught exception`)
    process.exit(1);

});



app.listen(process.env.PORT,()=>{
    console.log(`Server listening to PORT ${process.env.PORT}`)
})

connectToDb();

//unhandled promise rejection
process.on("unhandledRejection", err => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to unhandled promise rejection`)
    server.close(() => {
        process.exit(1);
    });
})