const { MongoClient, ObjectId } = require('mongodb');
const DB_COLLECTION = "users";
const bcrypt = require('bcryptjs');

async function connectDB() {
    //se está conectado então só retorna o ponteiro
    if (global.connection) return global.connection;
    // console.log("DBConn: ", process.env.DATABASE_CONNECTION);
    const client = new MongoClient(process.env.DATABASE_CONNECTION); //Não use localhost
    try {
        await client.connect();
        console.log('MongoDB connected successfully');
        global.connection = client.db('progas');
    } catch (error) {
        console.error(error);
        global.connection = null;
    }

    return global.connection;
}

async function findAllUsersCallbackWay(callback) {
    const connection = await connectDB();
    return connection
        .collection(DB_COLLECTION)
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
    return connection.collection(DB_COLLECTION).findOne({ _id: objectId });

}
async function findUserByEmail(email) {
    if (!email) {
        return Promise.reject(new Error('Endereço de email não informado ou inválido'));
    }

    const connection = await connectDB();
    return await connection.collection(DB_COLLECTION).findOne({ email: email })
    .then(user => {
        if (!user) {
            console.error('Usuário não encontrado:', email);
            return null;
        }
        console.log('Usuário encontrado:', user);
        return user;
    })
    .catch(err => {
        console.error('Erro ao buscar usuário por email:', err);
        return null;
    });    
}

async function findAllUsersPromiseWay(currentPage, pageSize) {
    const connection = await connectDB();
    return connection
        .collection(DB_COLLECTION)
        .find()
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize)
        .toArray();
}

async function insertUser(user) {
    user.active = (user.active === 'true' || user.active === 'on'); // Convert checkbox value to boolean

    const connection = await connectDB();
    user.password = bcrypt.hashSync(user.password, 12);

    return connection.collection(DB_COLLECTION).insertOne(user);
}

async function updateUser(userId, userData) {
    if (ObjectId.isValid(userId)) {
        const connection = await connectDB();

        if (userData.password)
            userData.password = bcrypt.hashSync(userData.password);

        return connection.collection(DB_COLLECTION).updateOne(
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
        return connection.collection(DB_COLLECTION).deleteOne({ _id: objectId });
    }
    else {
        console.Error('objectID do usuário inválido');
        return null;
    }

}

async function getCount() {
    const connection = await connectDB();
    return await connection
        .collection(DB_COLLECTION)
        .countDocuments();
}

module.exports = {
    findAllUsersCallbackWay,
    findAllUsersPromiseWay,
    findUserByID,
    findUserByEmail,
    insertUser,
    updateUser,
    deleteUser,
    getCount,
    connectDB
}