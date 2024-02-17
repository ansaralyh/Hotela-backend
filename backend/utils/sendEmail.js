const nodemailer = require('nodemailer');


async function sendEmail(email, subject, message) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'ansaralyh@gmail.com',
            pass: 'wgfu cpye unto qsht',
        },
    });

    const mailOptions = {
        from: 'ansaralyh@gmail.com',
        to: email,
        subject: subject,
        text: message,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email. Please try again later.');
    }
}

module.exports = sendEmail;
