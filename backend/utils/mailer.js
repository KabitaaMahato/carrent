import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_HOST_USER,
        pass: process.env.EMAIL_HOST_PASSWORD,
    },
});

export const sendOtpEmail = async (to, otp) => {
    await transporter.sendMail({
        from: process.env.DEFAULT_FROM_EMAIL || process.env.EMAIL_HOST_USER,
        to,
        subject: "Verify your email",
        html: `
            <div style="font-family:sans-serif;max-width:480px;margin:auto">
                <h2>Email Verification</h2>
                <p>Your one-time verification code is:</p>
                <p style="font-size:32px;font-weight:bold;letter-spacing:8px">${otp}</p>
                <p>This code expires in 10 minutes. If you didn't request this, you can ignore this email.</p>
            </div>
        `,
    });
};

export default sendOtpEmail;
