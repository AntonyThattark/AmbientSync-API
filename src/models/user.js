
import { pool } from "../util/MySQL.js";


export const getUserByUsername = async (email) => {

    const [rows, fields] = await pool.query("SELECT * FROM user WHERE email= ?",
        [email]);
    if (rows)
        return rows[0];
    return {};
}

export const updateUserDetails = async (user) => {
    const { name, email, password, verificationKey } = user;

    const basicQuery = "UPDATE user SET ";
    let fields = [];
    let values = [];
    if (user.name) {
        fields.push("name = ?")
        values.push(name)
    }
    if (user.email) {
        fields.push("email = ?")
        values.push(email)
    }
    if (user.password) {
        fields.push("password = ?")
        values.push(password)
    }
    if (user.verificationKey) {
        fields.push("verification_key = ?")
        values.push(verificationKey)
    }

    const whereQuery = " WHERE user_id = ?"
    values.push(user.id)

    const sqlQuery = basicQuery + fields.join(",") + whereQuery;

    const result = await pool.query(sqlQuery, values);
    if (result[0].affectedRows === 0) {
        return false
    }
    return true
}

export const addUser = async (user) => {
    const { name, email, password } = user;
    const [result] = await pool.query(
        "INSERT INTO user (name, email, password) VALUES (?,?,?)",
        [name, email, password]
    );
    return result.insertId;
}


export const verifyToken = async (token) => {
    const verify =await pool.query(
        "SELECT * FROM user WHERE user_id= ? and verification_key= ?",
        [token.userId, token.verificationKey]
    );
    if(verify)
        return 1
    return 0
}


export const verifyUser = async (user) => {
    const verify =await pool.query(
        "UPDATE user SET verified = 1 WHERE user_id = ?",
        [user]
    );
    if(verify)
        return 1
    return 0
}


export const verifyKey = async (key) => {
    const verify =await pool.query(
        "SELECT * FROM pkeys where product_key = ?",
        [key]
    );
    if(verify)
        return verify[0]
    return 0
}


export const addRoom = async (roomName, id) => {
    const add =await pool.query(
        "INSERT INTO room (room_name, primary_user_id) VALUES (?, ?)",
        [roomName, id]
    );
    const roomId=await pool.query(
        "SELECT * FROM room WHERE primary_user_id = ?",
        [id]
    );
    if(add)
        return roomId
    return 0
}

export const addAccess = async (id, room_id) => {
    const add =await pool.query(
        "INSERT INTO access (user_id, room_id) VALUES (?, ?)",
        [id, room_id]
    );
    if(add)
        return 1
    return 0
}

export const validateKey = async (key) => {
    const validate =await pool.query(
        "UPDATE pkeys SET verified = 1 WHERE product_key = ?",
        [key]
    );
    if(validate)
        return 1
    return 0
}