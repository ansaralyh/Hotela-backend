const express = require('express')
const {auth, isAuthorizedRole} = require('../middleware/authentication');
const { store, get, index, update, destroy } = require('../controllers/branchController');
const router = express.Router()

router.post('/',auth,isAuthorizedRole(["owner","receptionist"]),store);

/**Single branch route */
router.get("/:id",auth,isAuthorizedRole("owner","receptionist"),get);

/**Get all branches */
router.get("/",auth,isAuthorizedRole("owner","receptionist"),index)

/**update a branch */
router.put("/:id",auth,isAuthorizedRole("owner","receptionist"),update);

/**delete a branch */
router.delete("/:id",auth,isAuthorizedRole("owner","receptionist"),destroy);

module.exports = router