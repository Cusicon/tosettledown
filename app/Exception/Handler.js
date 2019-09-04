//-- Error handler
module["exports"] = function (err, req, res, next) {
    //- set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    if(err) {
        console.log(err.status , err.stack)

        res.status(err.status || 500);

        res.send(`Server Error : ${err.status || 500} --- ${err.message} \n ${err.stack}`);

        res.render('./error/404', {
            title: "Error"
        });
    }
};