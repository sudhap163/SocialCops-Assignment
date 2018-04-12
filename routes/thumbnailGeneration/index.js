const express = require('express');
const jwt = require('jsonwebtoken');
const jimp = require('jimp');
const path = require('path');

const config = require('../../config');

const router = express.Router();
router.post('/', (req, res, next) => {
    console.log(req.body);
    console.log(req.body.imgURL);
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, config.secret, function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        var url = req.body.imgURL;
        console.log(url);
        jimp.read(url.toString(), function(err, img) {
            console.log(img);
            if (err) throw err;

            img.resize( 50, 50 ).write('img-small.jpg');
            res.status(200).sendFile(path.join(__dirname,'../../img-small.jpg'));
        });
    });    
});

module.exports = router;
