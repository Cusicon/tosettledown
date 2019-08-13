// JUST FOR UNDERSTANDING, NOT IMPLEMENTED
let ONLINEDB_URI = {
    protocol: 'mongodb://',
    user: 'heroku_44w4v6sr',
    password: 'qnfpqfm0d9849ious129vgh2r5',
    url: 'ds117605.mlab.com',
    port: '17605',
    db_name: 'heroku_44w4v6sr'
};
module['exports'] = {
    'uri': get_env('MONGODB_URI', 'mongodb://localhost/nodejs' || 'mongodb://heroku_44w4v6sr:qnfpqfm0d9849ious129vgh2r5@ds117605.mlab.com:17605/heroku_44w4v6sr'),
};