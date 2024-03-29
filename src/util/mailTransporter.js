import nodemailer from 'nodemailer';

export const createMailTransporter = async () => {
    const transporter = nodemailer.createTransport({
        service: 'hotmail',
        auth: {
            user: '',
            pass: '',
        },
    })
    return transporter;
}
