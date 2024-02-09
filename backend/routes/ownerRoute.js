const express = require('express')
const { createOwner, ownerLogin, forgetPassword, verifyOtp, logout } = require('../controllers/ownerController');

const router = express.Router()

/**Create hotel route */
router.route('/hotel/create').post(createOwner);

/*Owner login route */

router.route('/hotel/owner/login').post(ownerLogin);

// Owner logout
router.route('/hotel/owner/logout').get(logout);

// forget password
router.route('/hotel/admin/forgetPasword').post(forgetPassword)

//verify otp
router.route('/hotel/admin/verifyOtp').post(verifyOtp)

module.exports = router