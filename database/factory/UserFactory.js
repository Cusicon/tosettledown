let faker = require('faker');
let moment = require('moment')

module['exports'] = function () {
    let maxAge = 40;
    let minAge = 18
   return {
       name: `${faker.name.firstName()} ${faker.name.lastName()}`,
       username: faker.internet.userName().toLowerCase(),
       email: faker.internet.email().toLowerCase(),
       password: "password",
       dob: moment().subtract( (Math.floor(Math.random() * (maxAge - minAge) ) + minAge), 'years').format() ,
       gender: faker.random.arrayElement(['male', 'female']),
       agreed_terms: true,
       joined: new Date().toDateString(),
       email_verified_at: new Date().toDateString(),
       personalInfo: {
           bio: "Hey there, I'm here to find love on TSD",
           location: "",
           work: "",
           education: "",
           height: "Average",
           language: "English",
           religion: faker.random.arrayElement(['Christianity', 'Islam', 'Others']),
           relationship: faker.random.arrayElement(['Single', 'Dating', 'Married', "Divorced"]),
       }
   }
};