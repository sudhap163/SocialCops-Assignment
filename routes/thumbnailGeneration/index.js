/* Module import */
const express = require('express'); 
const jwt = require('jsonwebtoken');                               //to tokenize the parameters
const jimp = require('jimp');                                      //image processing module
const path = require('path');                                      // to find path of any file/folder
const isUrl = require('isurl');                                    // to check if URL
const config = require('../../config');                            // all environment variables are stored here

const router = express.Router();                                   // Routing object of express module
router.post('/', (req, res, next) => { 
    const token = req.headers['x-access-token'];                   //to fetch jwt token from http header
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' }); //error handling if no token is present
    
    /* jwt.verify() method to verify the jwt token */
    jwt.verify(token, config.secret, function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' }); //error handling if token is wrong
        var imgURL = req.body.imgURL;                                 // save image url from req.body
        if (imgURL) {

            if (isUrl(imgURL)) {
                
                /* jimp method to resize image from URL */
                jimp.read(imgURL.toString(), (err, img) => {
                    if (err) throw err;

                    img.resize( 50, 50 ).write('img-small.jpg');       // resize the image and store the image in root dir
                    res.status(200).sendFile(path.join(__dirname,'../../img-small.jpg')); // send the image
                });
            }
            else {
                res.status(400).send({status: 'failed', message: 'Invalid image URL.'}); // error handling in case of invalid image url
            }
        }
        else {
            res.status(400).send({status: 'failed', message: 'Image URL missing.'}); // error handling in case of image url is not present
        }
    });    
});

module.exports = router;
