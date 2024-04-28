
import { pool } from "../util/MySQL.js";


export const getUserByUsername = async (email) => {

    const [rows, fields] = await pool.query("SELECT * FROM user WHERE email= ?",
        [email]);
    if (rows)
        return rows[0];
    return {};
}


export const checkVerification = async (email) => {

    const [rows, fields] = await pool.query("SELECT * FROM user WHERE email= ? AND verified = 1",
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
    const { name, email, password, verificationKey } = user;
    const [result] = await pool.query(
        "INSERT INTO user (name, email, password, verification_key) VALUES (?,?,?,?)",
        [name, email, password, verificationKey]
    );
    return result.insertId;
}


export const addSecondaryUser = async (user) => {
    const { name, email } = user;
    const [result] = await pool.query(
        "INSERT INTO user (name, email, verification_key) VALUES (?,?,?)",
        [name, email, verificationKey]
    );
    return result.insertId;
}

export const checkUserInRoom = async (user) => {
    const check = await pool.query(
        "SELECT * FROM access WHERE user_id = ? AND room_id = ?",
        [user.user_id, user.room_id]
    );
    console.log(check[0])
    if (check[0][0])
        return 1
    return 0
}

export const verifyToken = async (token) => {
    const verify = await pool.query(
        "SELECT * FROM user WHERE user_id= ? and verification_key= ?",
        [token.userId, token.verificationKey]
    );
    if (verify)
        return 1
    return 0
}


export const verifyUser = async (user) => {
    const verify = await pool.query(
        "UPDATE user SET verified = 1 WHERE user_id = ?",
        [user]
    );
    if (verify)
        return 1
    return 0
}


export const verifyKey = async (key) => {
    const verify = await pool.query(
        "SELECT * FROM pkeys where product_key = ?",
        [key]
    );
    if (verify)
        return verify[0]
    return 0
}


export const addRoom = async (room_id, roomName, id) => {
    const add = await pool.query(
        "INSERT INTO room (id, room_name, primary_user_id) VALUES (?, ?, ?)",
        [room_id, roomName, id]
    );
    // const roomId = await pool.query(
    //     "SELECT * FROM room WHERE primary_user_id = ?",
    //     [id]
    // );
    if (add)
        return 1
    // return roomId
    return 0
}

export const addAccess = async (id, room_id) => {
    const check = await pool.query(
        "SELECT * FROM access WHERE room_id = ? AND user_id = ?",
        [room_id, id]
    );
    if (check) return 1
    else {
        const add = await pool.query(
            "INSERT INTO access (user_id, room_id) VALUES (?, ?)",
            [id, room_id]
        );
        if (add)
            return 1
    }
    return 0
}

export const validateKey = async (key) => {
    const validate = await pool.query(
        "UPDATE pkeys SET verified = 1 WHERE product_key = ?",
        [key]
    );
    if (validate)
        return 1
    return 0
}

export const getUserList = async (user) => {
    const list = await pool.query(
        "SELECT access.user_id, user.name FROM access, user WHERE access.room_id = ? AND access.user_id = user.user_id",
        [user.room_id]
    );
    // const details = await pool.query(
    //     "SELECT access.user_id, user.name FROM access, user WHERE access.room_id = ? AND access.user_id = user.user_id",
    //     [user.room_id]
    // );
    if (list)
        return list[0]
    else
        return {}
}

export const insertPassword = async (password, user) => {
    const insert = await pool.query(
        "UPDATE user SET password = ?, verified = 1 WHERE user_id = ?",
        [password, user]
    );
    if (insert)
        return 1
    return 0
}


export const removeUser = async (user) => {
    const pop = await pool.query(
        "DELETE FROM access WHERE user_id = ? AND room_id = ?",
        [user.userId, user.roomId]
    );
    if (pop[0].affectedRows)
        return 1
    return 0
}


export const checkOtherAccess = async (user) => {
    const check = await pool.query(
        "SELECT * FROM access WHERE user_id = ?",
        [user.userId]
    );
    if (check[0][0])
        return 1
    return 0
}


export const updateUserValid = async (user) => {
    const update = await pool.query(
        "UPDATE user SET verified = 0 WHERE user_id = ?",
        [user.userId]
    );
    if (update)
        return 1
    return 0
}

export const removeRoom = async (room_id) => {
    const pop = await pool.query(
        "DELETE FROM room WHERE id = ? ",
        [room_id]
    );
    if (pop[0].affectedRows)
        return 1
    return 0
}

export const removeKeyValidation = async (room_id) => {
    const update = await pool.query(
        "UPDATE pkeys SET verified = NULL WHERE id = ?",
        [room_id]
    );
    if (update)
        return 1
    return 0
}
