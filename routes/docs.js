let router = require('express')();


router.get("/", ...applyMiddleware(['guest']), (require('@app/controllers/WelcomeController')).index);
router.get("/cookie", (require('@app/controllers/WelcomeController')).cookie);
router.get("/policy", (require('@app/controllers/WelcomeController')).policy);
router.get("/terms", (require('@app/controllers/WelcomeController')).terms);

module["exports"] = router;