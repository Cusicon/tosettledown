module.exports = function (req, res, next) {
  if(req.user.email_verified_at == null)
  {
    res.redirect("/verify");
  }
  next();
};