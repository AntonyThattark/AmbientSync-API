import env from "../config/keys.js";
import jwt from "jsonwebtoken";



export const userAuth = (req, res, next) => {
    const token = req.headers["authorization"];
    //const userType = req.headers["user-type"]
    if (!token) {
        return res.status(403).json({ errorMessage: 'Invalid token or user-type' });
    }
    try {
        const decoded = jwt.verify(token.split(" ")[1], env.authTokenKey);
        console.log(decoded)
        if (decoded) {
            req.user = decoded;
            return next();
        }
    }
    catch (err) {
        return res.status(401).json({ errorMessage: 'Invalid or expired token' });
    }
    return res.status(403).json({ errorMessage: 'Invalid token or user-type' });
};