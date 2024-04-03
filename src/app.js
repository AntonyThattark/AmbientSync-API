//const express= require('express')
// const getDBConnection=require('./util/mongoDB.js')
// const { userRegisterHandler } = require('./handlers/user.js')
//import { getDBConnection } from './util/mongoDB.js';



import express from 'express';
import cors from 'cors';
import {
    getRoomDetailsHandler, getRoomSettingsHandler, updateSettingsHandler, userPreferenceHandler,
} from './handlers/preference.js';
import { checkDatabaseConnection } from './util/MySQL.js';
import env from './config/keys.js';
import { sendVerificationHandler, userLoginHandler, userRegisterHandler, verifyKeyHandler } from './handlers/user.js';

const app = express()
app.use(cors());

//let client
// app.get('/users', async (req, res) => {

//     const db = await getDBConnection()
//     let dtl = []
//     console.log("reached")

//     db.collection('user_preference')
//         .find()
//         .forEach(dtls => dtl.push(dtls))
//         .then(() => {
//             console.log(dtl)
//             res.status(200).json(dtl)
//         })
//         .catch(() => {
//             res.status(500).json({ error: 'not fetched' })
//         })
// })

app.post('/user/register', express.json(), userRegisterHandler)
app.post('/user/login', express.json(), userLoginHandler)
app.get('/user/verifykey/:productkey', verifyKeyHandler)
app.get('/user/:id/verification', sendVerificationHandler)

app.put('/user/preferrence', express.json(), userPreferenceHandler)

app.get('/user/:id/rooms', getRoomDetailsHandler)

app.put('/rooms/:room_id/users/:user_id/scan', updateSettingsHandler)
app.get('/rooms/:room_id/settings', getRoomSettingsHandler)



app.use((req, res, next) => {
    res.status(404).json({ errorMessage: "URL not found" })
})


const startServerIfHealthy = async () => {
    try {
        await checkDatabaseConnection()
        app.listen(env.serverPort, () => {
            console.log("Listening on port: ", env.serverPort);
        })
    } catch (exception) {
        console.log("Error while starting server ", exception.message)
    }
}

startServerIfHealthy();