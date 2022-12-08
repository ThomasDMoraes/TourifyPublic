const tourId = require('./Controller').tourId;
const express = require('express');
const router = express.Router();

router.route('/api/tourId').get(async function (req, res) {
    let tour = await tourId(req, res, null);
    res.json(tour);
});

module.exports = router