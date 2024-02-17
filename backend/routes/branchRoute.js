const express = require('express')
const {auth, isAuthorizedRole} = require('../middleware/authentication');
const { store, get, index, update, destroy } = require('../controllers/branchController');
const router = express.Router()

router.post('/store',auth,isAuthorizedRole("owner"),store);

/**Single branch route */
router.get("/get/:id",auth,isAuthorizedRole("owner"),get);

/**Get all branches */
router.get("/index",auth,isAuthorizedRole("owner"),index)

/**update a branch */
router.put("/update/:id",auth,isAuthorizedRole("owner"),update);

/**delete a branch */
router.delete("/delete/:id",auth,isAuthorizedRole("owner"),destroy);

module.exports = router