//-- Error handler
module["exports"] = function (err, req, res, next) {
    //- set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    console.log(err)
    //- render the error page
    res.status(err.status || 500);
    res.send(`Server Error : ${err.status || 500} --- ${err.message}`);
    // res.render('./error/404', {
    //     title: "Error"
    // });
};