import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { addUser, getUserByUsername, updateUserDetails, verifyKey, verifyUser } from "../models/user.js";
import { sendVerificationMail } from "../util/sendMail.js";
import env from "../config/keys.js";




export const userRegisterController = async (user) => {

    user.password = await bcrypt.hash(user.password, 10);
    user.verificationKey=Math.trunc((Math.random() * 100000))
    const userExists = await getUserByUsername(user.email)
    if (userExists) {
        if (userExists.verified)
            return 0
        user.id = userExists.user_id
        await updateUserDetails(user)
    }
    else
        await addUser(user)
    const regUser= await getUserByUsername(user.email)
    const token = jwt.sign(
        { userId: regUser.id, verificationKey: user.verificationKey },
        env.authTokenKey,
        { expiresIn: env.authTokenExpiry }
    );
    //console.log(regUser,token)
    await sendVerificationMail(user, token);
    return true;
}


export const verifyUserController = async (user) => {

    const verify = await verifyUser(user)
    if (verify)
        return 1
    return 0
}


export const loginController = async (loginDetails) => {
    const trainee = await getUserByUsername(loginDetails.email);
    const username = loginDetails.email;
    if (loginDetails && trainee && (await bcrypt.compare(loginDetails.password, trainee.password))) {
        const token = jwt.sign(
            { username, userId: trainee.id },
            env.authTokenKey,
            { expiresIn: env.authTokenExpiry }
        );
        const response = {
            token: `Bearer ${token}`, email:loginDetails.email, name: trainee.name,
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