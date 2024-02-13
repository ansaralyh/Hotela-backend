const express = require('express')
const {auth} = require('../middleware/authentication');
const { store, get, index, update, destroy } = require('../controllers/branchController');
const router = express.Router()

router.post('/branch/create',auth,store);

/**Single branch route */
router.get("/branch/view/:id",auth,get);

/**Get all branches */
router.get("/branch/view",auth,index)

/**update a branch */

router.put("/branch/update/:id",auth,update);

/**delete a branch */
router.delete("/branch/delete/:id",auth,destroy);
module.exports = router