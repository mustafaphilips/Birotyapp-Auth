var passport = require('passport');
var strategyLocal = require('passport-local').Strategy;
var userModel = require('mongoose').model('User');
passport.use(new strategyLocal({
    usernameField: 'email'
}, function (username, password, done) {
    userModel.findOne({ email: username }, (err, user) => {
        if (err)
            return done(err);
        if (!user)
            return done(null, false, {
                message: `${username} not found. please check email again and send request`
            });
        if (!user.validatePassword(user.password))
            return done(null, false, {
                message: 'password validation failed for user'
            });
        return done(null, user);
    });
    }
));