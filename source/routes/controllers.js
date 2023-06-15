const express = require('express');
const router = express.Router();
const controllers = require('require.all')('../controllers');

router
    .all('/:controller', (req, res, next) => {
        (new controllers[req.params.controller]).index(req, res, next);
    })
    .all('/:controller/:action', (req, res, next) => {
        (new controllers[req.params.controller])[req.params.action](req, res, next);
    })
    .all('/:controller/:action/:id', (req, res, next) => {
        (new controllers[req.params.controller])[req.params.action](req, res, next);
    });

module.exports = router;