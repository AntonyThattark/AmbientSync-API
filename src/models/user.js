
//import { ObjectId } from "mongodb";
//import { getDBConnection } from "../util/mongoDB.js";

import { pool } from "../util/MySQL.js";



export const addUser = async (traineeDetails) => {
    const { name, email, password } = traineeDetails;
    const [result] = await pool.query(
        "INSERT INTO user (name, email, password) VALUES (?,?,?)",
        [name, email, password]
    );
    return result.insertId;
}


export const getUserByUsername = async (email) => {

    const [rows, fields] = await pool.query("SELECT * FROM user WHERE email= ?",
        [email]);
    if (rows)
        return rows[0];
    return {};
}

export const addPreference = async (userId) => {

    const add=await pool.query(
        "INSERT INTO preference (room_id, users, light_color, light_intensity, fan_speed, room_temp) VALUES (?,?,?,?,?,?)",
        []
    );
    if(add)
        return 1
    return 0
}


export const getPreference = async (user) => {

    const get=await pool.query(
        "SELECT * FROM preference WHERE room_id= ? AND users=?",
        [user.room_id, user.id]
    );
    if(get[0][0])
        return get[0]
    return 0
}



export const getUserInRoom = async (user) => {

    const get=await pool.query(
        "SELECT current_room_id FROM user WHERE user_id=?",
        [user.id]
    );
    if(get[0][0].current_room_id==null)
        return 0
    return 1
}


export const getAllUsersInRoom = async (user) => {

    const get=await pool.query(
        "SELECT user_id FROM user WHERE current_room_id=?",
        [user.room_id]
    );
    if(get[0][0])
        return get[0]
    return 0
}


export const mergeUsers = async (user) => {

    const userLeft = await getAllUsersInRoom(user)
        if (userLeft) {
            let users = "";
            for (let i = 0; i < userLeft.length; i++) {
                users += userLeft[i].user_id
                if (i + 1 < userLeft.length) {
                    users += ","
                }
            }
            return users
        }
    return 0
}



export const updateRoomSettings = async (user) => {

    //const { lightColor, lightIntensity, fanSpeed , roomTemp} = user;
    const {room_id, light_color, light_intensity, fan_speed, room_temp}=user

    const basicQuery = "UPDATE room SET ";
    let fields = [];
    let values = [];
    if (light_color) {
        fields.push("light_color = ?")
        values.push(light_color)
    }
    else
        fields.push("light_color = NULL")
    if (light_intensity) {
        fields.push("light_intensity = ?")
        values.push(light_intensity)
    }
    else
        fields.push("light_intensity = NULL")
    if (fan_speed) {
        fields.push("fan_speed = ?")
        values.push(fan_speed)
    }
    else
        fields.push("fan_speed = NULL")
    if (room_temp) {
        fields.push("room_temp = ?")
        values.push(room_temp)
    }
    else
        fields.push("room_temp = NULL")

    const whereQuery = " WHERE id = ?"
    values.push(room_id)

    const sqlQuery = basicQuery + fields.join(",") + whereQuery;


    const result = await pool.query(sqlQuery, values);
    if (result[0].affectedRows === 0) {
        return false
    }
    return true
}



export const setUserIn = async (user) => {

    const set=await pool.query(
        "UPDATE user SET current_room_id = ? WHERE user_id = ?",
        [user.room_id, user.id]
    );
    if(set)
        return 1
    return 0
}


export const setUserOut = async (user) => {

    const set=await pool.query(
        "UPDATE user SET current_room_id = NULL WHERE user_id = ?",
        [user.id]
    );
    if(set)
        return 1
    return 0
}






// export const addUser = async (traineeDetails) => {
//     const { name, password, email } = traineeDetails;
//     const db = await getDBConnection()
//     const result = await db.collection('Authentication')
//         .insertOne(
//             {
//                 User_name: name,
//                 "Password": password,
//                 "email": email
//             }
//         )
//         .catch(() => {
//             res.status(500).json({ error: 'not fetched' })
//         });
//     console.log(result)
//     if (result)
//         return 1;
//     return 0;
// }


// export const getPreference = async (userId) => {
//     const db = await getDBConnection()
//     let dtl = []
//     console.log(userId)
//     const result = await db.collection('Room')
        
//         .find({"Room1.Preferences.id":"User2"})
//         .project({"Room1.Preferences":{ $all: [ "id", "Light_color"  ] } , _id: 0})
//         .project({Room1: {$elemMatch: {Preferences:{"id": "User1"}}}, _id: 0})
//         .toArray();
           
    
//     var re = Object.keys(result).map(e => ({Preferences: e, Light_color: result[e]}))
//     console.log(re)
    
//     if (result)
//         return result;
//     return 0;
// }
