const express = require('express');
const errorMiddleware = require('../backend/middleware/error');
const app = express();
const adminRoutes = require('./routes/index')
const cookieParser = require('cookie-parser');
const cors = require('cors');
app.use(express.json());
app.use(cookieParser());
app.use(cors("*"));



// Routes
app.use('/api/v1', adminRoutes );



//middleware
app.use(errorMiddleware);

module.exports = app;
