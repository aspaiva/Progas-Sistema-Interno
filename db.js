async function connnectMongoDB() {
    const { MongoClient } = require('mongodb');
    const client = new MongoClient("mongodb://127.0.0.1:27017"); //Não use localhost
    await client.connect();
    console.log('MongoDB connected successfully');
    global.connection = client.db('users');
}

connnectMongoDB();

module.exports = {};