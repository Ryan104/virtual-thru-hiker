const mongoose = require('mongoose');

// connect to db - *remember mongod*
mongoose.connect( process.env.MONGODB_URI || 
                  process.env.MONGOLAB_URI || 
                  process.env.MONGOHQ_URL || 
                  "mongodb://localhost/virtual-thru-hiker",
                  {useMongoClient: true}
                  );

module.exports.Trailmark = require('./trailmark');
module.exports.User = require('./user');
