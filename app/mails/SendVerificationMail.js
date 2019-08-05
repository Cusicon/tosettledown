let Mailer = require('@bootstrap/Mailer');

module["exports"] = class SendVerificationMail extends Mailer{

  constructor(notifiable)
  {
    super(notifiable);
    this.notifiable = notifiable;
  }

  send()
  {
    this.view('auth/verify.ejs', this.notifiable);
  }

};




