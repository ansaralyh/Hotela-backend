const { store, index, get, update,destroy } = require("../controllers/hotelControllers");
const express = require('express');
const router = express.Router();


// Register hotel
router.post('/',store);

/** Get all hotels ---- index */
router.get('/',index)

/** Get single hotel ---- index */
router.get('/:id',get)

/**  Update a hotel ---- update */
router.put('/:id',update)

/**Delete hotel --- destroy */

router.delete('/:id',destroy)
module.exports = router;