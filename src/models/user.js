
import { pool } from "../util/MySQL.js";


export const getUserByUsername = async (email) => {

    const [rows, fields] = await pool.query("SELECT * FROM user WHERE email= ?",
        [email]);
    if (rows)
        return rows[0];
    return {};
}

export const updateUserDetails = async (user, id) => {
    const { name, email, password } = user;

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

    const whereQuery = " WHERE user_id = ?"
    values.push(id)

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


export const verifyUser = async (user) => {
    const verify =await pool.query(
        "UPDATE user SET verified = 1 WHERE user_id = ?",
        [user]
    );
    if(verify)
        return 1
    return 0
}

