
import express from 'express';
import cors from 'cors';
import {
    checkUserPrimaryHandler,
    getPreferenceHandler,
    getRoomDetailsHandler, getRoomSettingsHandler, updateSettingsHandler, userPreferenceHandler,
} from './handlers/preference.js';
import { checkDatabaseConnection } from './util/MySQL.js';
import env from './config/keys.js';
import { emailVerificationHandler, getUserListHandler, removeUserHandler, secondaryEmailVerificationHandler, secondaryRegisterHandler, userLoginHandler, userRegisterHandler, verifyKeyHandler } from './handlers/user.js';
import { userAuth } from './middleware/auth.js';
import { createConnection } from './util/mqtt.js';

const app = express()
app.use(cors());


createConnection()

app.post('/user/register', express.json(), userRegisterHandler)
app.post('/user/login', express.json(), userLoginHandler)
app.get('/user/verifykey/:productkey', verifyKeyHandler)
app.post('/user/emailverification', express.json(), emailVerificationHandler)
app.post('/user/secondary/add', express.json(), userAuth, secondaryRegisterHandler)
app.post('/user/remove',express.json(), removeUserHandler)
app.post('/user/secondaryUser/emailverification',express.json(), secondaryEmailVerificationHandler)

app.put('/user/preferrence', express.json(), userAuth, userPreferenceHandler)

app.get('/userslist/room/:room_id', getUserListHandler)
app.get('/user/rooms',userAuth, getRoomDetailsHandler)
app.get('/user/checkPrimary/:roomId',userAuth, checkUserPrimaryHandler)
app.get('/users/:users_id/room/:room_id', getPreferenceHandler )

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




//const express= require('express')
// const getDBConnection=require('./util/mongoDB.js')
// const { userRegisterHandler } = require('./handlers/user.js')
//import { getDBConnection } from './util/mongoDB.js';



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