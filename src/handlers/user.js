import { addRoomController, emailVerificationController, getUserListController, loginController, 
            removeUserController, 
            removeValidationController, 
            secondaryEmailVerificationController, 
            secondaryRegisterController, 
            userRegisterController, verifyKeyController } from "../controllers/user.js";
import env from "../config/keys.js";
import jwt from "jsonwebtoken";
//import { sendVerificationMail } from "../util/sendMail.js";




export const userRegisterHandler = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!(name && password && email)) {
            res.status(400).json({ errorMessage: "All input is required" });
            return;
        }

        const register = await userRegisterController(req.body); 
        if (register) {
            res.status(200).json({ successMessage: "OTP was successfully send" })
            return;
        }
        res.status(500).json({ Message: "Username already taken" })
    }
    catch (error) {
        console.log("An unexpected error occured while registering user ", error.message)
        res.status(500).json({ errorMessage: 'An unexpected error occured. Check server logs' });
    }

}

export const userLoginHandler = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!(email && password)) {
            res.status(400).json("All input is required");
            return;
        }
        const success = await loginController(req.body);
        if (success) {
            res.status(200).json(success)
            return success;
        }
        res.status(401).json({ Message: "Login Failed" })
    }
    catch (e) {
        console.log("An unexpected error occured while login ", e.message)
        res.status(500).json({ errorMessage: 'An unexpected error occured. Check server logs' });
    }

}


export const emailVerificationHandler = async (req, res) => {

    const {token, roomName}=req.body
    if (!token || !roomName) {
        return res.status(403).json({ errorMessage: "Insufficient details" });
    }
    try {
        //console.log(req.body)
        const decoded = jwt.verify(token, env.authTokenKey);
        //console.log(decoded)
        const verify= await emailVerificationController(decoded, roomName)
        if(verify)
            res.status(200).json("Verification Successfull")
    }
    catch (err) {
        console.log(err)
        return res.status(401).json({ errorMessage: "Invalid Token" });
    }

}



export const verifyKeyHandler = async (req, res) => {

    try {
        const verify = await verifyKeyController(req.params.productkey)
        if (verify)
            res.status(200).json({ successMessage: "Key Verification Successfull" })
        else
            res.status(500).json({ Message: "Key already taken or not found" })
    }
    catch (e) {
        console.log("An unexpected error occured while verifying key ", e.message)
        res.status(500).json({ errorMessage: 'An unexpected error occured. Check server logs' });
    }
}


export const getUserListHandler = async (req, res) => {

    try {
        const list = await getUserListController(req.params)
        if (list!={})
            res.status(200).json(list)
        else
            res.status(500).json(list)
    }
    catch (e) {
        console.log("An unexpected error occured while verifying key ", e.message)
        res.status(500).json({ errorMessage: 'An unexpected error occured. Check server logs' });
    }
}


export const secondaryRegisterHandler = async (req, res) => {
    try {
        const { name, email } = req.body;
        if (!(name && email)) {
            res.status(400).json({ errorMessage: "All input is required" });
            return;
        }

        const register = await secondaryRegisterController(req.body); 
        if (register) {
            res.status(200).json({ successMessage: "OTP was successfully send" })
            return;
        }
        res.status(500).json({ Message: "Username already taken" })
    }
    catch (error) {
        console.log("An unexpected error occured while registering secondary user ", error.message)
        res.status(500).json({ errorMessage: 'An unexpected error occured. Check server logs' });
    }
}


export const secondaryEmailVerificationHandler = async (req, res) => {

    const {token, password}=req.body
    if (!token || !password) {
        return res.status(403).json({ errorMessage: "Insufficient details" });
    }
    try {
        //console.log(req.body)
        const decoded = jwt.verify(token, env.authTokenKey);
        //console.log(decoded)
        const verify= await secondaryEmailVerificationController(decoded, password)
        if(verify)
            res.status(200).json("Verification Successfull")
    }
    catch (err) {
        console.log(err)
        return res.status(401).json({ errorMessage: "Invalid Token" });
    }
}

export const removeUserHandler = async (req, res) => {

    try {
        const { roomId, email } = req.body;
        if (!(roomId && email)) {
            res.status(400).json({ errorMessage: "All input is required" });
            return;
        }

        const remove = await removeUserController(req.body); 
        if (remove) {
            res.status(200).json({ successMessage: "access removed successfully" })
            return;
        }
        res.status(500).json({ Message: "couldn't find user" })
    }
    catch (error) {
        console.log("An unexpected error occured while registering secondary user ", error.message)
        res.status(500).json({ errorMessage: 'An unexpected error occured. Check server logs' });
    }
}


export const removeValidationHandler = async (req, res) => {

    try {
        const body = { roomId: req.params.room_id, userId: req.params.user_id }
        const verify = await removeValidationController(body)
        if (verify)
            res.status(200).json({ successMessage: "Validation removed Successfull" })        
    }
    catch (e) {
        console.log("An unexpected error occured while removing verification ", e.message)
        res.status(500).json({ errorMessage: 'An unexpected error occured. Check server logs' });
    }
}

export const addRoomHandler = async (req, res) => {

    try {
        req.body.userId=req.user.userId;
        const add = await addRoomController(req.body)
        if (add){
            res.status(200).json({ successMessage: "New room added" })
            return;
        }
        res.status(500).json({ Message: "Product Key not found" })  
    }
    catch (e) {
        console.log("An unexpected error occured adding room ", e.message)
        res.status(500).json({ errorMessage: 'An unexpected error occured. Check server logs' });
    }
}