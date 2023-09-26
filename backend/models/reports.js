const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    userID: String,
    type: String,
    date: String,
    desc: String,
    location: String,
    lat: Number,
    lon: Number,
    file: String
});

module.exports = mongoose.model('reports', schema);