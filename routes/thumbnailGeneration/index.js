const express = require('express');
const jwt = require('jsonwebtoken');
const jimp = require('jimp');

const config = require('../../config');

const router = express.Router();
router.post('/', (req, res, next) => {
    console.log(req.body);

    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, config.secret, function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        var url = req.body.imgURL;

        jimp.read(url.toString(), function(err, img) {
            if (err) throw err;

            img.resize( 50, 50 ).write('img-small.jpg');
            res.status(200).send('Done');
        });
    });    
});

module.exports = router;
