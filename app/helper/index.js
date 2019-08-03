const path = require("path");
global.storage_path = (path_join = null) => { path.join(base_path, "storage", path_join)};

global.config = () =>
{
  console.log(r);
}

//-- Log User's activities to "userActivity.log" Log file
global.userLog = log => {
  fs.mkdir('logs', {
    recursive: true
  }, err => {
    if (err) console.log(err);
    else {
      fs.appendFile( path.join(storage_path('logs'), 'userActivity.log'), `@ ${new Date().toString()} -- [ ${log} ]\n`, err => {
        if (err) console.log("Unable to write to userActivity.log");
      });
    }
  });
};

global.User;

global.serverLog = log => {
  fs.mkdir(storage_path('logs'), {
    recursive: true
  }, err => {
    if (err) console.log(err);
    else {
      fs.appendFile( path.join(storage_path('logs'), 'server.log') , `@ ${new Date().toString()} -- [ ${log} ]\n`, err => {
        if (err) console.log("Unable to write to server.log");
      });
    }
  })
};