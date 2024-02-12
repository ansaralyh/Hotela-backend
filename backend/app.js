const express = require('express');
const errorMiddleware = require('../backend/middleware/error');
const app = express();
const ownerRoutes = require('./routes/ownerRoute');
const receptionistRoutes = require('./routes/receptionistRoute');
const branchRoutes = require('./routes/branchRoute');
const roomRoutes = require('./routes/roomRoutes');
const employeeRoutes = require('./routes/employeeRoute');
const customerRoutes = require('./routes/customerRoutes');
const reservation = require('./routes/reservedRoom.routes');
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/v1', ownerRoutes);
app.use('/api/v1', employeeRoutes);
app.use('/api/v1', branchRoutes);
app.use('/api/v1', receptionistRoutes);
app.use('/api/v1', customerRoutes);
app.use('/api/v1', roomRoutes);
app.use('/api/v1', reservation);

//middleware
app.use(errorMiddleware);

module.exports = app;
