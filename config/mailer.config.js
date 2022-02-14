const nodemailer = require('nodemailer');
const template = require('../config/mailtemplate');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.NM_USER,
        pass: process.env.NM_PASSWORD
    }
})

module.exports.sendActivationEmail = (email, token) => {
    transporter.sendMail({
        from: `John Doe ${process.env.NM_USER}`,
        to: email,
        subject: 'Thanks for joining!',
        html: template.generateEmail(token)
    })
}