import nodemailer from 'nodemailer';

export const createMailTransporter = async () => {
    const transporter = nodemailer.createTransport({
        service: 'hotmail',
        auth: {
            user: 'ambientsync@hotmail.com',
            pass: 'Ambient@sync',
        },
    })
    return transporter;
}
