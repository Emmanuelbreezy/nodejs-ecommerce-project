const nodemailer = require("nodemailer");
const asyncHandler = require('express-async-handler');

const sendMail = asyncHandler(async (data, req, res) => {
    let transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for port:465, false for other ports
        auth: {
            // TODO: replace `user` and `pass` values from <https://forwardemail.net>
            user: process.env.Mail_ID,
            pass: process.env.Mail_PASSWORD,
        }
        });

        // send mail with defined transport object
        const info = await transporter.sendMail({
            from: '"Fred Foo 👻" <emmazurglasumeh@gmail.com>', // sender address
            to: data.to, // list of receivers
            subject: data.subject, // Subject line
            text: data.text, // plain text body
            html: data.htm, // html body
        });

    });


module.exports  = sendMail;