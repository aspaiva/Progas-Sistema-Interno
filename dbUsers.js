const { MongoClient, ObjectId } = require('mongodb');

async function connnectMongoDB() {
    console.log("DBConn: ", process.env.DATABASE_CONNECTION);
    const client = new MongoClient(process.env.DATABASE_CONNECTION); //Não use localhost
    await client.connect();
    console.log('MongoDB connected successfully');
    global.connection = client.db('users');
    // // Test the connection by fetching all users
    // const array = await global.connection.collection('users').find().limit(2).toArray(); // Fetching only 2 users for testing
    // if (!array || array.length === 0) {
    //     console.log('No users found in the database');
    //     return;
    // }
}

connnectMongoDB();

function findAllUsersCallbackWay(callback) {
    return global.connection
        .collection('users')
        .find()
        .toArray((err, result) => {
            console.clear();
            if (err) {
                console.error('Error fetching users:', err);
                return callback(err, null);
            }
            // console.log('Users fetched successfully:', result);
            // Assuming result is an array of user objects  
            callback(null, result);
        }
    );
}

function findUserByID(userId) {
    const objectId = ObjectId.createFromHexString(userId);
    if (!ObjectId.isValid(objectId)) {
        return Promise.reject(new Error('Invalid user ID'));
    }
    return global.connection.collection('users').findOne({ _id: objectId });
}

function findAllUsersPromiseWay() {
    return global.connection.collection("users").find().toArray();
}

function insertUser(user) {
    user.active = (user.active === 'true' || user.active === 'on'); // Convert checkbox value to boolean
    return global.connection.collection('users').insertOne(user);
}

function updateUser(userId, userData) {
    if (ObjectId.isValid(userId))
        return global.connection.collection('users').updateOne(
            { _id: userId },
            { $set: userData }
        );
}

function deleteUser(userId) {
    const objectId = ObjectId.createFromHexString(userId);
    if (ObjectId.isValid(objectId))
        return global.connection.collection('users').deleteOne({ _id: objectId });
    else
        console.Error('objectID do usuário inválido');

}

module.exports = {
    findAllUsersCallbackWay,
    findAllUsersPromiseWay,
    findUserByID,
    insertUser,
    updateUser,
    deleteUser
}