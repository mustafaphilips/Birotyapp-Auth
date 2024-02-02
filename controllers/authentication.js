var mongoose = require('mongoose');
var user = mongoose.model('User');
var passport = require('passport');
var createError = require('http-errors');
const createHttpError = require('http-errors');
var sendJSONresponse = function (res, status, content) {

    res.status(status);

    res.json(content);

};
module.exports.register = function (req,res,next) {
    if (!req.body.name || !req.body.email || !req.body.password) {
        next(createHttpError(400, {
            "message": "All fields required"
        }));
    }
    var email = req.body.email;
    var newUser = new user();
    newUser.email = email;
    newUser.name = req.body.name;
    newUser.setPassword(req.body.password);
    newUser.sa
    newUser.save().then(usr=>{
        var token = newUser.generateWebToken();
        res.status(200);
        res.json({
            "token": token
        });
    }).catch((err) => {
         next(createError(400, err)); //res.status(400).json(err);
    });
};



module.exports.login = function (req, res,next) {
    if (!req.body.email || !req.body.password) {
        createError(400, {
            "message": "All fields required"
        });
        return;
    }
    passport.authenticate('local', function (err, user, info) {
        if (err){
            next(err);
            //res.status(404).json(err)
        }
        if (!user)
            res.status(400).json(info)
        else {
            let token = user.generateWebToken();
            res.status(200);
            res.json({
                "token": token
            });
        }

    })(req, res,next);
};