const express = require('express')
const {auth} = require('../middleware/authentication');
const { store, get, index, update, destroy } = require('../controllers/branchController');
const router = express.Router()

router.post('/create',auth,store);

/**Single branch route */
router.get("/get/:id",auth,get);

/**Get all branches */
router.get("/get",auth,index)

/**update a branch */
router.put("/update/:id",auth,update);

/**delete a branch */
router.delete("/delete/:id",auth,destroy);
module.exports = router