/* Module import */
const express = require('express');
const jwt = require('jsonwebtoken');                                     // to tokenize the parameters
const config = require('../../config');                                  // all environment variables are stored here

const router = express.Router();                                         // Routing object of express module
router.post('/', (req, res, next) => {
    if (req.body.username && req.body.password) {                        // check if fields are empty

        token = jwt.sign({ username: req.body.username, password: req.body.password }, config.secret, {
            expiresIn: 86400                                             // expires in 24 hours
        });                                                              // create JSON web token from input fields

        res.status(200).send({ auth: true, token: token });              // send successful response
    }
    else {
        res.status(400).send({message: 'Username or password missing'}); // send response if empty input fields
    }
});

module.exports = router;
