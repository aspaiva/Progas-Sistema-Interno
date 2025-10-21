// Código para teste
const dotenv = require('dotenv');
dotenv.config();
const nodemailer = require('nodemailer');

async function testConnection() {
    const smtpPass = process.env.SMTP_APP_PASSWORD || process.env.SMTP_PASSWORD;

    const transporter = nodemailer.createTransport({
        host: 'smtp.zoho.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: smtpPass
        }
    });

    console.log('process.env.SMTP_USERNAME:', process.env.SMTP_USERNAME);

    try {
        await transporter.verify();
        console.log('Conexão bem sucedida!');
    } catch (error) {
        console.error('Erro de conexão:', error);
    }
}

testConnection();