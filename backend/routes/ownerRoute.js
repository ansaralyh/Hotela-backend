const express = require('express')
const { createOwner, ownerLogin, forgetPassword, verifyOtp, logout } = require('../controllers/ownerController');

const router = express.Router()

/**Create hotel route */
router.route('/create').post(createOwner);

/*Owner login route */

router.route('/owner/login').post(ownerLogin);

// Owner logout
router.route('/owner/logout').get(logout);

// forget password
router.route('/admin/forgetPasword').post(forgetPassword)

//verify otp
router.route('/admin/verifyOtp').post(verifyOtp)

module.exports = router