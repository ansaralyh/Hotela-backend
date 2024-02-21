const express = require('express');
const errorMiddleware = require('../backend/middleware/error');
const app = express();
const adminRoutes = require('./routes/index')
const bodyParser = require('body-parser');
const fileUpload  = require('express-fileupload');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

app.use(cors("*"));

// file uplaod
app.use(fileUpload());

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/v1', adminRoutes );

//middleware
app.use(errorMiddleware);

module.exports = app;
