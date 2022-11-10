const { MongoClient } = require('mongodb');

let dbConnection;
const uri = 'mongodb+srv://saimon:saimon1500@cluster0.4lu8uvf.mongodb.net/?retryWrites=true&w=majority'
module.exports = {
    connectToDb : (cb)=>{
        MongoClient.connect(uri)
        .then(client => {
            dbConnection = client.db()
            return cb()
        })
        .catch(err =>{
            console.log(err)
            return cb()
        })
    },
    getDb : () => dbConnection
}