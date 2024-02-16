const express = require('express')
const {store, forgetPassword, verifyOtp, logout, login, resetPassword  } = require('../controllers/ownerController');

const router = express.Router()

/**Create hotel route */
router.post('/create',store)

/*Owner login route */

router.post('/login',login)

// Owner logout
router.get('/logout',logout)

// forget password
router.post('/forgetPasword',forgetPassword);

//verify otp
router.post('/verifyOtp',verifyOtp);

//reset PPassowrd
router.post('/resetPassowrd',resetPassword);

module.exports = router