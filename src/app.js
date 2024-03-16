//const express= require('express')

// const getDBConnection=require('./util/mongoDB.js')
// const { userRegisterHandler } = require('./handlers/user.js')
//import { getDBConnection } from './util/mongoDB.js';



import express from 'express';
import cors from 'cors';
import { getRoomSettingsHandler, updateSettingsHandler, userLoginHandler, userPreferenceHandler, userRegisterHandler } from './handlers/user.js';
import { checkDatabaseConnection } from './util/MySQL.js';
import env from './config/keys.js';

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

app.get('/user/preferrence', express.json(), userPreferenceHandler)

//app.put('/user/updateRoomSettings', express.json(), updateSettingsHandler)
app.put('/rooms/:room_id/users/:user_id/scan', updateSettingsHandler)
app.get('/rooms/:room_id/settings', getRoomSettingsHandler)



app.use((req, res, next) => {
    res.status(404).json({ errorMessage: "URL not found" })
})

// app.listen(5000, () => {
//     console.log("listening")
// })


const startServerIfHealthy = async () => {
    try {
        await checkDatabaseConnection()
        app.listen(env.serverPort, () => {
            console.log("Listening on port ", env.serverPort);
        })
    } catch (exception) {
        console.log("Error while starting server ", exception.message)
    }
}

startServerIfHealthy();