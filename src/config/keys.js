import dotenv from 'dotenv';

// const dotenv = require('dotenv')

dotenv.config();

const envMap = {
    serverPort: "API_HOST_PORT",
    hostIP: "HOST_IP",
    clientPort: "CLIENT_HOST_PORT",

    authTokenKey: "TOKEN_KEY",
    authTokenExpiry: "TOKEN_EXPIRY",


    MONGO_DB_URL: "DB_LINK",
    dbHost: "DB_HOST",
    dbName: "DB_DATABASE",
    dbUser: "DB_USER",
    dbPassword: "DB_PASSWORD",
    dbPort: "DB_PORT",
    stripeAPIKey: "STRIPE_API_KEY",
    stripeWebhookSecret: "STRIPE_WEBHOOK_SECRET",
    traineeFeHost: "TRAINEE_FE_HOST"
}

let env = {};

for (const envKey in envMap) {
    env[envKey] = process.env[envMap[envKey]];
    if (!env[envKey]) throw new Error(`Environment variable ${envMap[envKey]} is not defined`);
}

//module.exports = env
export default env;