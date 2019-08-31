// send email function
module.exports.sendEmail = function (content) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: false,
        port: 25,
        auth: {
            user: EmailAuth.username,
            pass: EmailAuth.password
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    let HelperOptions = {
        from: content.from,
        to: content.to,
        subject: content.subject,
        html: content.html
    };

    transporter.sendMail(HelperOptions, (error, info) => {
        if (error) {
            return error;
        }
    });
}


// sends confirmation email to users verified email address using nodemailer
module.exports.emailConfirmation = function (name, email, userId) {
    let host = `http://localhost:3000/security/emailConfirmation/${userId}/`;
    let token = this.createEmailConfrimationToken(email);
    let url = host + token;

    let content = {
        from: '"A New Item" <donotreply@anewitem.com>',
        to: `${email}`,
        subject: 'Account Confirmation',
        html: `Hi ${name}, <br/><br/> please copy or click this link <br/> <a target="_blank" href="${url}">${url}</a> <br/> to activate your newly created account "${email}" with us. <br/><br/> Thank you!`
    };

    this.sendEmail(content);

    // return the email confirmation link to client incase it wasn't sent
    return url;
}