let faker = require('faker');

module['exports'] = function () {
   return {
       name: `${faker.name.firstName()} ${faker.name.lastName()}`,
       username: faker.internet.userName(),
       email: faker.internet.email(),
       password: "password",
       dob: new Date().toDateString(),
       gender: faker.random.arrayElement(['male', 'female']),
       agreed_terms: true,
       joined: new Date().toDateString(),
       email_verified_at: new Date().toDateString(),
       personalInfo: {
           bio: "Hey there, I'm here to find love on TSD",
       }
   }
};