const MustVerify = function (req, res, next) {
  if(req.user.email_verified_at == null)
  {
    console.log("User not verified")
  }
  next();
}

module.exports = MustVerify