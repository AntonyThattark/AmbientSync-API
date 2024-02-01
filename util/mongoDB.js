// import mysql2 from 'mysql2';
//import env from './config/keys.js';


const { MongoClient } = require('mongodb')

let dbConnection

module.exports = {
    checkDatabaseConnection: (cb) => {
        MongoClient.connect('mongodb://localhost:27017/AmbientSync')
            .then((client) => {
                dbConnection = client.db('AmbientSync')

                let det = dbConnection.collection('user_preference').findOne()
                console.log('success conn :', det)
                return
            })
            .catch(err => {
                console.log(err)
                return err
            })
    },
    getDb: () => { return dbConnection }
}


