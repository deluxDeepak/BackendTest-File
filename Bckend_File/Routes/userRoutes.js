const express = require('express')
const { createuser, login, info } = require('../Controller/Usercontroller')


// To create the routes 
const routes = express.Router()

// Yehan  controller ka use karenge (Must be a function controller function hona chiye )
routes.post('/', createuser)
routes.post('/login',login)
routes.get('/info',info)
module.exports = routes;