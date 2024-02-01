var mongoose = require('mongoose');

var gracefulShutdown;

var dbURI = "mongodb://dbadmin1:dbadmin1@cl1-shard-00-00-gz9xw.mongodb.net:27017,cl1-shard-00-01-gz9xw.mongodb.net:27017,cl1-shard-00-02-gz9xw.mongodb.net:27017/test?ssl=true&replicaSet=cl1-shard-0&authSource=admin&retryWrites=true";
//'mongodb+srv://dbadmin1:admin123@cl1-gz9xw.mongodb.net/db1';
//'mongodb://birotydb@birotydb.documents.azure.com:10255/com_db?ssl=true&replicaSet=globaldb'
//'mongodb://localhost/bucketlist';

if (process.env.NODE_ENV === 'production') {

    dbURI = process.env.MONGOLAB_URI;
    //split dburi to get user name and password for db
    //mongoose.connect(dbURI, {
    //    auth: {
    //        user: 'birotydb',
    //        password: 'GvNlnWXftt5GubOdXDQ3vKf4AyWUG8ZTlFtrNB78tbJi7W4iHxmZTMFCR5gZX23sQpoLE1XYhBSP0Ns73NBhLA=='
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

    mongoose.connection.close(function () {

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