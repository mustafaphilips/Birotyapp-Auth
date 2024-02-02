var mongoose = require('mongoose');
require('dotenv').config();
var gracefulShutdown;

var dbURI = process.env.MONGOLAB_URI;
if (process.env.NODE_ENV === 'production') {

    dbURI = process.env.MONGOLAB_URI;
    //split dburi to get user name and password for db
    //mongoose.connect(dbURI, {
    //    auth: {
    //        user: process.env.MONGOLAB_USER,
    //        password: process.env.MONGOLAB_PWD
    //    },
    //    }
    //});

}
else
    mongoose.connect(dbURI);


// CONNECTION EVENTS

mongoose.connection.on('connected', function () {

    console.log('Mongoose connected to ' + dbURI);

});

mongoose.connection.on('error', function (err) {

    console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {

    console.log('Mongoose disconnected');

});



// CAPTURE APP TERMINATION / RESTART EVENTS

// To be called when process is restarted or terminated

gracefulShutdown = function (msg, callback) {

    mongoose.connection.close().then(function () {

        console.log('Mongoose disconnected through ' + msg);

        callback();

    });

};

// For nodemon restarts

process.once('SIGUSR2', function () {

    gracefulShutdown('nodemon restart', function () {

        process.kill(process.pid, 'SIGUSR2');

    });

});

// For app termination

process.on('SIGINT', function () {

    gracefulShutdown('app termination', function () {

        process.exit(0);

    });

});

// For Heroku app termination

process.on('SIGTERM', function () {

    gracefulShutdown('Heroku app termination', function () {

        process.exit(0);

    });

});



// BRING IN YOUR SCHEMAS & MODELS

require('./users');