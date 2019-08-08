// let fs = require("fs");
let path = require('path');
let nodemailer = require("nodemailer");
let ejs = require("ejs");

module['exports'] = class Mailer{

    constructor(notifiable){

        this.transporter = nodemailer.createTransport({
            host: config('mail', 'host'),
            port: config('mail', 'port'),
            secure: config('mail', 'encryption'), // use SSL
            auth: {
                user: config('mail', 'username'),
                pass: config('mail', 'password')
            }
        });

        this.options = {
            from: config('mail', (items) => { return items.from.address}),
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
        ejs.renderFile(path.join(config('mail', (items) => { return items.template.paths }), view), data, (err, data) => {
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