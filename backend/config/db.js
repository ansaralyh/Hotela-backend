const mongoose = require('mongoose')


const connectToDb = ()=>{
    mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log('MongoDB connected successfully')
    }).catch((err)=>{
        console.log(err)
    })
}

module.exports = connectToDb