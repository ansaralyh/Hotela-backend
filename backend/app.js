const express = require('express');
const errorMiddleware = require('../backend/middleware/error');
const app = express();
const adminRoutes = require('./routes/index')
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/v1', adminRoutes );



//middleware
app.use(errorMiddleware);

module.exports = app;
