// let fs = require("fs");
let path = require('path');
let nodemailer = require("nodemailer");
let ejs = require("ejs");
let mailConfig = require('@config/mail');

module['exports'] = class Mailer{

    constructor(notifiable){

        this.transporter = nodemailer.createTransport({
            host: mailConfig.host,
            port: mailConfig.port,
            secure: mailConfig.encryption, // use SSL
            auth: {
                user: mailConfig.username,
                pass: mailConfig.password
            }
        });

        this.options = {
            from: mailConfig.from.address,
            to: notifiable.email,
        };
    }

    subject(subject)
    {
        this.options.subject = subject;
        return this;
    }

    view(view, data)
    {
        ejs.renderFile(path.join(mailConfig.template.paths, view), data, (err, data) => {

            if (err) {
                console.log(err);
            } else {
                this.options.html = data;
                this.transporter.sendMail(this.options, function (err, info) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('Message sent: ' + info.response);
                    }
                });
            }

        });
    }

};