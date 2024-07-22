const mongoose = require('mongoose');

const connectDB = (url) =>
  mongoose.connect(url).then(() => console.log('connected to the db...'));

module.exports = connectDB;
