module["exports"] = {
    google: {
        client_id: get_env('GOOGLE_CLIENT_ID','GOOGLE_CLIENT_ID'),
        client_secret: get_env('GOOGLE_CLIENT_SECRET','GOOGLE_CLIENT_SECRET'),
    },

    session: {
        sessionSecret: 'tosettledownisthebestappintheworld',
        cookieKey: 'tosettledownisthebestappintheworld'
    }
};