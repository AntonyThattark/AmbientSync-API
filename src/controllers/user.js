import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { addAccess, addRoom, addSecondaryUser, addUser, checkUserInRoom, getUserByUsername, getUserList, insertPassword, updateUserDetails, validateKey, verifyKey, verifyToken, verifyUser } from "../models/user.js";
import { sendSecondaryUserVerificationMail, sendVerificationMail } from "../util/sendMail.js";
import env from "../config/keys.js";




export const userRegisterController = async (user) => {

    user.password = await bcrypt.hash(user.password, 10);
    user.verificationKey = Math.trunc((Math.random() * 100000))
    const userExists = await getUserByUsername(user.email)
    if (userExists) {
        if (userExists.verified)
            return 0
        user.id = userExists.user_id
        await updateUserDetails(user)
    }
    else
        await addUser(user)
    const regUser = await getUserByUsername(user.email)
    const token = jwt.sign(
        { userId: regUser.user_id, verificationKey: user.verificationKey, key: user.key },
        env.authTokenKey,
        { expiresIn: env.authTokenExpiry }
    );
    //console.log(regUser,token)
    await sendVerificationMail(user, token);
    return true;
}


export const emailVerificationController = async (decoded, roomName) => {

    const verify = await verifyToken(decoded)
    if (verify) {
        await verifyUser(decoded.userId)
        const roomID = await addRoom(roomName, decoded.userId)
        await addAccess(decoded.userId, roomID)
        await validateKey(decoded.key)
        return 1
    }
    return 0
}


export const loginController = async (loginDetails) => {
    const user = await getUserByUsername(loginDetails.email);
    const username = loginDetails.email;
    if (loginDetails && user && (await bcrypt.compare(loginDetails.password, user.password))) {
        const token = jwt.sign(
            { username, userId: user.user_id },
            env.authTokenKey,
            { expiresIn: env.authTokenExpiry }
        );
        const response = {
            token: `Bearer ${token}`, email: loginDetails.email, name: user.name,
        }
        return response;
    }
    return false;
}


export const verifyKeyController = async (key) => {

    const verify = await verifyKey(key)
    if (!verify[0].verified)
        return 1
    return 0
}


export const getUserListController = async (user) => {
    const list = getUserList(user)
    return list
}


export const secondaryRegisterController = async (user) => {

    user.verificationKey = Math.trunc((Math.random() * 100000))
    const userExists = await getUserByUsername(user.email)
    if (userExists) {
        if (!userExists.verified) {
            user.id = userExists.user_id
            await updateUserDetails(user)
        }
        const check= await checkUserInRoom(user)
            if(check)
                return 0;
    }
    else
        await addSecondaryUser(user)
    const regUser = await getUserByUsername(user.email)
    const token = jwt.sign(
        { userId: regUser.user_id, verificationKey: user.verificationKey, room_id: user.room_id },
        env.authTokenKey,
        { expiresIn: env.authTokenExpiry }
    );
    //console.log(regUser,token)
    await sendSecondaryUserVerificationMail(user, token);
    return true;
}


export const secondaryEmailVerificationController = async (decoded, password) => {

    const verify = await verifyToken(decoded)
    if (verify) {
        password = await bcrypt.hash(password, 10);
        await insertPassword(password, decoded.userId)
        await addAccess(decoded.userId, decoded.room_id)
        return 1
    }
    return 0
}