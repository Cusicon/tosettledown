module.exports = class SendVerficationMail{

  constructor(notifiable)
  {
    this.notifiable = notifiable;
  }


  send()
  {
    console.log('mail sent')
  }

}