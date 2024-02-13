const express = require('express')
const {store, forgetPassword, verifyOtp, logout, login  } = require('../controllers/ownerController');

const router = express.Router()

/**Create hotel route */
router.post('/create',store)

/*Owner login route */

router.post('/owner/login',login)

// Owner logout
router.get('/owner/logout',logout)

// forget password
router.post('/admin/forgetPasword',forgetPassword);

//verify otp
router.post('/admin/verifyOtp',verifyOtp);

module.exports = router