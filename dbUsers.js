const { MongoClient, ObjectId } = require('mongodb');

async function connectDB() {
    //se está conectado então só retorna o ponteiro
    if (global.connection) return global.connection;
    // console.log("DBConn: ", process.env.DATABASE_CONNECTION);
    const client = new MongoClient(process.env.DATABASE_CONNECTION); //Não use localhost
    try {
        await client.connect();
        console.log('MongoDB connected successfully');
        global.connection = client.db('users');
    } catch (error) {
        console.error(error);
        global.connection = null;
    }
    // // Test the connection by fetching all users
    // const array = await global.connection.collection('users').find().limit(2).toArray(); // Fetching only 2 users for testing
    // if (!array || array.length === 0) {
    //     console.log('No users found in the database');
    //     return;
    // }

    return global.connection;
}

async function findAllUsersCallbackWay(callback) {
    const connection = await connectDB();
    return connection
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

async function findUserByID(userId) {
    const objectId = ObjectId.createFromHexString(userId);
    if (!ObjectId.isValid(objectId)) {
        return Promise.reject(new Error('Invalid user ID'));
    }

    const connection = await connectDB();
    return connection.collection('users').findOne({ _id: objectId });
}

async function findAllUsersPromiseWay() {
    const connection = await connectDB();
    return connection.collection("users").find().toArray();
}

async function insertUser(user) {
    user.active = (user.active === 'true' || user.active === 'on'); // Convert checkbox value to boolean

    const connection = await connectDB();
    return connection.collection('users').insertOne(user);
}

async function updateUser(userId, userData) {
    if (ObjectId.isValid(userId)) {
        const connection = await connectDB();
        return connection.collection('users').updateOne(
            { _id: userId },
            { $set: userData }
        );
    }

    return null;
}

async function deleteUser(userId) {
    const objectId = ObjectId.createFromHexString(userId);
    if (ObjectId.isValid(objectId)) {
        const connection = await connectDB();
        return connection.collection('users').deleteOne({ _id: objectId });
    }
    else {
        console.Error('objectID do usuário inválido');
        return null;
    }

}

module.exports = {
    findAllUsersCallbackWay,
    findAllUsersPromiseWay,
    findUserByID,
    insertUser,
    updateUser,
    deleteUser,
    connectDB
}