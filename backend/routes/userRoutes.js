const express = require('express')
const { store, forgetPassword, verifyOtp, logout, login, resetPassword } = require('../controllers/userController');

const router = express.Router()

/**Create hotel route */
router.post('/', store)

/*Owner login route */

router.post('/login', login)


// forget password
router.post('/forgetPasword', forgetPassword);

//verify otp
router.post('/verifyOtp', verifyOtp);

//reset PPassowrd
router.post('/resetPassowrd', resetPassword);

module.exports = router