// import mysql2 from 'mysql2';
//import env from './config/keys.js';
// const MongoClient = require('mongodb').MongoClient
// const env=require('../config/keys.js')






import { MongoClient } from 'mongodb';
import env from '../config/keys.js';

const url = env.MONGO_DB_URL
console.log(url)
export const getDBConnection = async () => {
    const client = await MongoClient.connect(url)
    const db = client.db('AmbientSync')
    return db
}







// const url = env.MONGO_DB_URL
//const url = "mongodb://localhost:27017"
// console.log(url)
// const getDBConnection = async () => {
//     const client = await MongoClient.connect(url)
//     return client
// }

// module.exports = getDBConnection






// const { MongoClient } = require('mongodb')

// let dbConnection

// module.exports = {
//     checkDatabaseConnection: (cb) => {
//         MongoClient.connect('mongodb://localhost:27017/AmbientSync')
//             .then((client) => {
//                 dbConnection = client.db('AmbientSync')

//                 let det = dbConnection.collection('user_preference').findOne()
//                 console.log('success conn :', det)
//                 return
//             })
//             .catch(err => {
//                 console.log(err)
//                 return err
//             })
//     },
//     getDb: () => { return dbConnection }
// }


