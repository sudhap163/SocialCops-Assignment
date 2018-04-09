const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('../../config');

const router = express.Router();
router.post('/', (req, res, next) => {
    console.log(req.body);
    if (req.body.username && req.body.password) {
        console.log(req.body);

        token = jwt.sign({ username: req.body.username, password: req.body.password }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
        });

        res.status(200).send({ auth: true, token: token });
    }
    else {
        res.status(400).send({message: 'Username or password missing'});
    }
    // res.send('respond with a resource');
});

module.exports = router;
