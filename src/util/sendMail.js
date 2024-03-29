// const { createMailTransporter} = require("./createMailTransporter");

import env from "../config/keys.js";
import { createMailTransporter } from "./mailTransporter.js";

export const sendVerificationMail = async (user) => {
    let str=env.serverIP+":"+env.serverPort+"/user/"+user.id+"/verification"
    console.log(str)
    const transporter =await createMailTransporter();
    const mailOptions = {
        from: '"Ambient Sync" <ambientsync@hotmail.com>',
        to: user.email,
        subject: "Verify your email...",
        text: "This is a test email sent using Nodemailer.",
        html: `<p>Hello ${user.name}, verify your email by clicking this link...</p>
        <a href='http://${env.serverIP}:${env.serverPort}/user/${user.id}/verification'>Click here to Verify Your Email</a>`,
        
    };
    await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("error occured", error);
        } else {
            console.log("Verification email sent");
        }
    });
    return 1
}

