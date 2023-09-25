const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    userID: String,
    type: String,
    date: String,
    desc: String,
    location: String,
    file: String
});

module.exports = mongoose.model('reports', schema);