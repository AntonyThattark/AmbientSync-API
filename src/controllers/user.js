import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { addAccess, addRoom, addSecondaryUser, addUser, checkOtherAccess, checkUserInRoom, checkVerification, 
    getUserByUsername, getUserList, insertPassword, removeKeyValidation, removeRoom, removeUser, updateUserDetails, 
    updateUserValid, validateKey, verifyKey, verifyToken, verifyUser } from "../models/user.js";
import { sendSecondaryUserVerificationMail, sendVerificationMail } from "../util/sendMail.js";
import env from "../config/keys.js";
import { checkUserPrimary } from "../models/preference.js";
import { getConnection } from "../util/mqtt.js";




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
        const keyDtl = await verifyKey(decoded.key)
        await addRoom(keyDtl.id, roomName, decoded.userId)
        await addAccess(decoded.userId, keyDtl.id)
        await validateKey(decoded.key)

        const mqttClient = getConnection()
        mqttClient.publish("newUser", String(decoded.userId), { qos: 2 }, (err) => {
            console.log("published")
            if (err) throw err
        })
        return 1
    }
    return 0
}


export const loginController = async (loginDetails) => {

    const checkVerified = await checkVerification(loginDetails.email);
    const username = loginDetails.email;
    if (loginDetails && checkVerified && (await bcrypt.compare(loginDetails.password, checkVerified.password))) {
        const token = jwt.sign(
            { username, userId: checkVerified.user_id },
            env.authTokenKey,
            { expiresIn: env.authTokenExpiry }
        );
        const response = {
            token: `Bearer ${token}`, email: loginDetails.email, name: checkVerified.name,
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
    const list = await getUserList(user)
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
        const check = await checkUserInRoom(user)
        if (check)
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
        const mqttClient = getConnection()
        mqttClient.publish("newUser", String(decoded.userId), { qos: 2 }, (err) => {
            console.log("published")
            if (err) throw err
        })
        return 1
    }
    return 0
}


export const removeUserController = async (user) => {

    const popUser = await getUserByUsername(user.email)
    popUser.roomId = user.roomId
    popUser.userId = popUser.user_id
    const checkPrimaryUser = await checkUserPrimary(popUser)
    if (!checkPrimaryUser[0]) {
        const pop = await removeUser(popUser)
        if (pop) {
            const access = await checkOtherAccess(popUser)
            if (!access)
                await updateUserValid(popUser)
            return 1;
        }
    }
    return 0;
}


export const removeValidationController = async (popUser) => {

    const pop = await removeUser(popUser)
    const primary = await checkUserPrimary(popUser)
    if (primary) {
        await removeRoom(popUser.roomId)
        await removeKeyValidation(popUser.roomId)
    }
    if (pop) {
        const access = await checkOtherAccess(popUser)
        if (!access)
            await updateUserValid(popUser)
        return 1;
    }

    return 0
}

export const addRoomController = async (user) => {    
    const check= await verifyKey(user.key)
    if(!check.verified){
        // console.log(user, check)
        await addRoom(check.id, user.roomName, user.userId)
        await addAccess(user.userId, check.id)
        await validateKey(user.key)
        return 1
    }
    return 0
}