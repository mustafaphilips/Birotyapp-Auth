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
router.get('/:id', auth, function (req, res,next) {
    if (!req.payload._id)
        res.status(401).json({
            "message": 'user not authorized'
        });
    else {
        user.findById(req.params.id).then(item => {
            if (item) {
                res.status(200)
                res.json({
                    user: item
                });
            }
        })
        .catch(err=>next(err));
    }
});
router.get('/', auth, function (req, res) {
    if (!req.payload._id)
        res.status(401).json({
            "message": 'user not authorized'
        });
    else {
        user.findById(req.payload._id).then(item=> {
            if (item)
                user.find({}).then(list => {
                    res.status(200)
                    res.json({
                        users: list
                    });
                })
                .catch(err=>next(err));//error getting users lists
        })
        .catch(err=>next(err));//could not find loggedin user in db
    }
});

router.post('/login', obj.login);
router.post('/register', obj.register);
module.exports = router;