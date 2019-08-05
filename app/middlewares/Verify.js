module["exports"] = function (req, res, next) {
  if(req.user)
  {
    if(req.user.email_verified_at == null)
    {
      res.redirect("/auth/0/verify");
    }
    next();
  }else{
    res.redirect("/");
  }

};