const express = require('express')
const errorMiddleware = require('../backend/middleware/error')
const app = express()
app.use(express.json())
const ownerRoutes = require('./routes/ownerRoute')
const receptionistRoutes = require('./routes/receptionistRoute')
const branchRoutes = require('./routes/branchRoute'); 
const  roomRoutes  = require('./routes/roomRoutes')
const employeeRoutes = require('./routes/employeeRoute')
const customerRoutes = require('./routes/customerRoutes')
const reservation = require('./routes/reservedRoom.routes')

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')

// data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser())


app.use('/api/v1',ownerRoutes)
app.use('/api/v1',employeeRoutes)
app.use('/api/v1', branchRoutes);
app.use('/api/v1',receptionistRoutes)
app.use('/api/v1',customerRoutes)
app.use('/api/v1',roomRoutes)
app.use('/api/v1',reservation)
/**Error handling middlerware */
app.use(errorMiddleware);
module.exports = app