var mongoose = require('mongoose');
var crypto = require('crypto');
var token = require('jsonwebtoken');

var userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    hash: String,
    salt: String
});

userSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

userSchema.methods.validatePassword = function (password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    return this.hash === hash;
};

userSchema.methods.generateWebToken = function () {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);
    let secret = process.env.JSON_TOKEN_STRING || "MY_SECRET"
    return token.sign({
        _id: this._id,
        name: this.name,
        email: this.email,
        exp: parseInt(expiry.getTime() / 1000)
    }, secret);
};

mongoose.model('User', userSchema);