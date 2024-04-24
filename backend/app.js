const express = require('express');
const errorMiddleware = require('../backend/middleware/error');
const app = express();
const adminRoutes = require('./routes/index')
const bodyParser = require('body-parser');
const fileUpload  = require('express-fileupload');
const cookieParser = require('cookie-parser');
const cors = require('cors');

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

app.use(cors("*"));

// file uplaod
app.use(fileUpload());

// Serve static files from the 'uploads' directory
app.use(express.static("uploads/branch_image"))
app.use(express.static("uploads/room_images"))

// Routes
app.use('/api/v1', adminRoutes );

//middleware
app.use(errorMiddleware);

module.exports = app;

