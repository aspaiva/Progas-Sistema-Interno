const dotenv = require('dotenv');
dotenv.config();

const nodeMailer = require('nodemailer');
const { SMTP_SERVER, SMTP_PORT, SMTP_USERNAME, SMTP_APP_PASSWORD, SMTP_PASSWORD, SMTP_FROM } = process.env;
const smtpPass = SMTP_APP_PASSWORD || SMTP_PASSWORD;

const transporter = nodeMailer.createTransport({
    host: SMTP_SERVER,
    port: SMTP_PORT,
    secure: true, // true for 465, false for other ports
    auth: {
        user: SMTP_USERNAME,
        pass: smtpPass
    }
});

module.exports = {
    sendMail: async (recipient, subject, htmlContent) => {
        const mailOptions = {
            from: SMTP_FROM,
            to: recipient,
            subject: subject,
            html: htmlContent
        };

        try {
            let info = await transporter.sendMail(mailOptions);
            // console.log('Email sent: ' + info.response);
            return { success: true, info: info };
        } catch (error) {
            console.error('Error sending email:', error);
            return { success: false, error: error };
        }
    },

    close: () => {
        transporter.close();    // Close the transporter after sending the email
    }
}