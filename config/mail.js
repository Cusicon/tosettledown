module["exports"] = {
  /*
  |--------------------------------------------------------------------------
  | Mail Driver
  |--------------------------------------------------------------------------
  */

  driver: get_env('MAIL_DRIVER','smtp'),

  /*
  |--------------------------------------------------------------------------
  | SMTP Host Address
  |--------------------------------------------------------------------------
  */

  host: get_env('MAIL_HOST','smtp.mailtrap.io'),

  /*
  |--------------------------------------------------------------------------
  | SMTP Host Port
  |--------------------------------------------------------------------------
  */

  port: get_env('MAIL_PORT', 2525),

  /*
  |--------------------------------------------------------------------------
  | Global "From" Address
  |--------------------------------------------------------------------------
  */

  from : {
    address: get_env('MAIL_FROM_ADDRESS','hello@example.com'),
    name: get_env('MAIL_FROM_NAME', 'Example'),
  },

  /*
  |--------------------------------------------------------------------------
  | E-Mail Encryption Protocol
  |--------------------------------------------------------------------------
  */

  encryption: get_env('MAIL_ENCRYPTION', false),

  /*
  |--------------------------------------------------------------------------
  | SMTP Server Username
  |--------------------------------------------------------------------------
  */

  username: get_env('MAIL_USERNAME',"0b09454d7de706"),

  password: get_env('MAIL_PASSWORD', "fd739d44c64fc0"),

  /*
  |--------------------------------------------------------------------------
  | Sendmail System Path
  |--------------------------------------------------------------------------
  |
  | When using the "sendmail" driver to send e-mails, we will need to know
  | the path to where Sendmail lives on this server. A default path has
  | been provided here, which will work well on most of your systems.
  |
  */

  sendmail: '/usr/sbin/sendmail -bs',

  /*
  |--------------------------------------------------------------------------
  | Markdown Mail Settings
  |--------------------------------------------------------------------------
  */

  template : {
    theme :'default',
    paths : view_path('mail'),
  },

  /*
  |--------------------------------------------------------------------------
  | Log Channel
  |--------------------------------------------------------------------------
  |
  | If you are using the "log" driver, you may specify the logging channel
  | if you prefer to keep mails messages separate from other log entries
  | for simpler reading. Otherwise, the default channel will be used.
  |
  */

  log_channel: get_env('MAIL_LOG_CHANNEL',null),

};