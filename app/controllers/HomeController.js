let User = require('@models/user');

const HomeController = class HomeController{
  constructor()
  {
  }

  chats(req, res)
  {
    res.render('./app/menu/chats', {
      title: "Chats"
    });
  }

  showChat(req, res)
  {
    let username = req.params.username;
    User.getUserByUsername(username, (err, profile_user) => {
      if (err) console.log(err);
      else {
        res.render('./app/menu/chats', {
          title: "Chats",
          profile_user: profile_user
        });
      }
    });
  }

  matched(req, res)
  {
    res.render('./app/menu/matched', { title: "Matched" });
  }

  likes(req, res)
  {
    res.render('./app/menu/likes', { title: "Likes" });
  }

  visitors(req, res)
  {
    res.render('./app/menu/visitors', { title: "Visitors" });
  }

  favourites(req, res)
  {
    res.render('./app/menu/favourites', { title: "Favourites" });
  }

  shop(req, res)
  {
    res.render('./app/menu/shop', { title: "Shop" });
  }

  wallet(req, res)
  {
    res.render('./app/extras/wallet', { title: "Wallet" });
  }

  packages(req, res)
  {
    res.render('./app/extras/packages', { title: "Package" });
  }

}


module["exports"] = new HomeController();