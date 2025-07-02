const express = require('express');
const router = express.Router();
const { notificar, getStatus } = require('../controller/notify.controller');

router.post('/notificar', notificar);
router.get('/notificar/status/:id', getStatus);

module.exports = router;