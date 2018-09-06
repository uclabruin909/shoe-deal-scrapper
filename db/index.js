const mongoose = require('mongoose');
const dbKeys = require('./dbKeys.json');

let serverOpts = {
	server: {
		socketOptions: {keepAlive: 1}
	}
};

//Build connection string
let dbURI = `mongodb://${dbKeys.username}:${dbKeys.pswd}@ds053320.mlab.com:53320/node`;

//connect to database
mongoose.connect(dbURI, opts);

//define connection event handlers
mongoose.connection.on('connected', function () {
  console.log('Mongoose connected to ' + dbURI);
});

mongoose.connection.on('error',function (err) {
  console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
  console.log('Mongoose disconnected');
});

process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    console.log('Mongoose disconnected through app termination');
    process.exit(0);
  });
});