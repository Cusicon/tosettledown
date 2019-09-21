let router = require('express')();


router.get("/", ...applyMiddleware(['guest']), (require('@app/controllers/WelcomeController')).index);
router.get("/cookie", (require('@app/controllers/WelcomeController')).cookie);
router.get("/policy", (require('@app/controllers/WelcomeController')).policy);
router.get("/terms", (require('@app/controllers/WelcomeController')).terms);
router.get("/forgotPassword", (require('@app/controllers/WelcomeController')).forgotPassword);
router.post("/forgotPassword", (require('@app/controllers/WelcomeController')).forgotPassword);

module["exports"] = router;