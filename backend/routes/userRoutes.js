const express = require('express')
const { store, forgetPassword, verifyOtp, login, resetPassword, getUser } = require('../controllers/userController');
const { auth, isAuthorizedRole } = require('../middleware/authentication');

const router = express.Router()

/**Create hotel route */
router.post('/', store)

/*Owner login route */

router.post('/login', login)

router.get('/me',auth,isAuthorizedRole(['owner','receptionist']),getUser)
// forget password
router.post('/forgetPasword', forgetPassword);

//verify otp
router.post('/verifyOtp', verifyOtp);

//reset PPassowrd
router.post('/resetPassowrd', resetPassword);

module.exports = router