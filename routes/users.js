'use strict';
var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var user = require('mongoose').model('User');
var auth = jwt({
    secret: process.env.JSON_TOKEN_STRING || 'MY_SECRET',
    userProperty: 'payload'
});
var obj = require('../controllers/authentication');
/* GET users listing. */
router.get('/:id', auth, function (req, res) {
    if (!req.payload._id)
        res.status(401).json({
            "message": 'user not authorized'
        });
    else {
        user.findById(req.params.id, (err, item) => {
            if (err) res.status(400).json(err);
            if (item) {
                res.status(200)
                res.json({
                    user: item
                });
            }

        });
    }
});
router.get('/', auth, function (req, res) {
    if (!req.payload._id)
        res.status(401).json({
            "message": 'user not authorized'
        });
    else {
        user.findById(req.payload._id, (err, item) => {
            if (err) res.status(400).json(err);
            if (item)
                user.find((err1, list) => {
                    if (err1)
                        res.status(400).json(err1);
                    res.status(200)
                    res.json({
                        users: list
                    });
                });
        });
    }
});

router.post('/login', obj.login);
router.post('/register', obj.register);
module.exports = router;