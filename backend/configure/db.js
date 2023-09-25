const { MongoClient } = require('mongodb');
require('dotenv').config();

const client = new MongoClient(process.env.DB_CONNECTION);

const dbconnection = client.connect();

const database = client.db('WarnDog');
const userCollection = database.collection(process.env.USERCOLLECTION);
const reportsCollection = database.collection(process.env.REPORTSCOLLECTION);

console.log(`Connected to DB ... `);

module.exports.client = client;
module.exports.dbconnection = dbconnection;
module.exports.database = database;
module.exports.userCollection = userCollection;
module.exports.reportsCollection = reportsCollection;