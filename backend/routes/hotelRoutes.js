const { store } = require("../controllers/hotelControllers");
const express = require('express');
const router = express.Router();

router.post('/store',store)


module.exports = router;