const nodemailer = require('nodemailer');

// Configure nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Generate a random 6-digit OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP via email
async function sendOTP(email, otp) {
    const mailOptions = {
        from: `"TripNest" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'TripNest Email Verification OTP',
        text: `Your verification code for TripNest is: ${otp}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this code, please ignore this email.`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2c3e50;">TripNest Email Verification</h2>
                <p>Your verification code is:</p>
                <h1 style="color: #3498db; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
                <p>This code will expire in 10 minutes.</p>
                <p style="color: #7f8c8d; font-size: 12px;">If you didn't request this code, please ignore this email.</p>
            </div>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        // console.log('Email sent successfully:', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending OTP:', error);
        throw new Error(`Failed to send OTP: ${error.message}`);
    }
}

module.exports = {
    generateOTP,
    sendOTP
};