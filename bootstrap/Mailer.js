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
            subject: notifiable.subject,
        };
    }

    view(view, data)
    {
       let local_options = this.options;
       let local_transporter = this.transporter;

        ejs.renderFile(path.join(mailConfig.template.paths, view), data, function (err, data) {

            if (err) {
                console.log(err);
            } else {
                local_options.html = data;

                local_transporter.sendMail(local_options, function (err, info) {
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