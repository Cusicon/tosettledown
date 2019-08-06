let faker = require('faker');

module['exports'] = function () {
   return {
       fullname: {
           firstname: faker.name.firstName(),
           lastname: faker.name.lastName(),
           all: this.fullname
       },
       username: faker.internet.userName(),
       email: faker.internet.email(),
       password: "password",
       dob: {
           date: new Date().toDateString(),
           age: "1967-05-21",
       },
       gender: faker.random.arrayElement(['male', 'female']),
       agreed_terms: true,
       joined: new Date().toDateString()
   }
};