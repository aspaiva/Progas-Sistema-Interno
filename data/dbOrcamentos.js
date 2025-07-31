/// ADAPTAR PARA ORCAMENTOS
const { MongoClient, ObjectId } = require('mongodb');
const DB_COLLECTION = "solicitacaoOrcamento";

async function connectDB() {
    //se está conectado então só retorna o ponteiro
    if (global.connection) return global.connection;
    // console.log("DBConn: ", process.env.DATABASE_CONNECTION);
    const client = new MongoClient(process.env.DATABASE_CONNECTION); //Não use localhost
    try {
        await client.connect();
        console.log('MongoDB connected successfully');
        global.connection = client.db("progas");
    } catch (error) {
        console.error(error);
        global.connection = null;
    }

    return global.connection;
}

async function getOrcamentoById(ID) {
    const objectId = ObjectId.createFromHexString(ID);
    if (!ObjectId.isValid(objectId)) {
        return Promise.reject(new Error('Invalid user ID'));
    }

    const connection = await connectDB();
    return connection.collection(DB_COLLECTION).findOne({ _id: objectId });
}

async function getSolicitacoesOrcamentos(currentPage, pageSize) {
    const connection = await connectDB();

    const skipRecs = (currentPage - 1) * pageSize;

    if (connection) {
        const data = await connection
            .collection(DB_COLLECTION)
            .find()
            .skip(skipRecs)
            .limit(pageSize)
            .toArray();

        //console.log("Dados: ", data);
        return data;
    } else {
        console.error("Não foi possível conectar ao banco");
        return null;
    }
}

async function insertUser(user) {
    user.active = (user.active === 'true' || user.active === 'on'); // Convert checkbox value to boolean

    const connection = await connectDB();

    if (connection) {
        return connection.collection(DB_COLLECTION).insertOne(user);
    } else {
        console.error("Não foi possível conectar ao banco");
        return null;
    }
}

async function updateUser(userId, userData) {
    if (ObjectId.isValid(userId)) {
        const connection = await connectDB();
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
    const counter = await connection
        .collection(DB_COLLECTION)
        .countDocuments();
    console.log('counter: ', counter);
    return counter;
}

module.exports = {
    getOrcamentoById,
    getSolicitacoesOrcamentos,
    insertUser,
    updateUser,
    deleteUser,
    connectDB,
    getCount
}