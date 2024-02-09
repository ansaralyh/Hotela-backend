const express = require('express')
const {auth} = require('../middleware/authentication');
const { createBranch, getSingleBranch, getAllBranches, updateBranch, deleteBranch } = require('../controllers/branchController');
const router = express.Router()

router.route('/branch/create').post(auth,createBranch);

/**Single branch route */
router.route("/branch/view/:id").get(auth,getSingleBranch);

/**Get all branches */
router.route("/branch/view").get(auth,getAllBranches);

/**update a branch */

router.route("/branch/update/:id").put(auth,updateBranch);

/**delete a branch */
router.route("/branch/delete/:id").delete(auth,deleteBranch);
module.exports = router