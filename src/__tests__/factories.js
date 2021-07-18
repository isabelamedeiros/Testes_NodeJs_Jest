const { factory } = require('factory-girl');
const { User } = require('../app/models')

factory.define('User', User, {
    name: 'Isabela',
    email: 'isabela@mail.com',
    password: '123123'
})

module.exports = factorys;