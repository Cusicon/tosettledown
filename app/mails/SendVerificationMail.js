let Mailer = require('@bootstrap/Mailer');

module["exports"] = class SendVerificationMail extends Mailer{

    constructor(notifiable)
    {
        super(notifiable);
        this.notifiable = notifiable;
    }

    buildUrl()
    {
        this.notifiable.tempUrl = Url.temporaryUrl(`auth/0/verify/${this.notifiable._id}`, Date.now());
    }

    send()
    {
        this.buildUrl();
        this.view('auth/verify.ejs', this.notifiable);
    }

};




