const express = require('express');
const { store,index, get,update ,destroy} = require('../controllers/receptionistController');
const {auth,isAuthorizedRole} = require('../middleware/authentication');
const router = express.Router();

/**Register receptionist  */
router.post('/',auth,isAuthorizedRole(['owner']),store);

/**get all recptionist */
router.get('/',auth,isAuthorizedRole(['owner']),index);

/**Get single receptionist by id */
router.get('/:id',auth,isAuthorizedRole(['owner']),get);

/**update receptionist */
router.put('/:id',auth,isAuthorizedRole(['owner']),update);

/**Delete a receptionist */
router.delete('/:id',auth,isAuthorizedRole(['owner']),destroy)
module.exports = router