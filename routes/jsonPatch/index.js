/* Module import */
const express = require('express');
const jwt = require('jsonwebtoken');                               // to tokenize the parameters
const jsonpatch = require('jsonpatch');                            // to add patch to JSON object

const config = require('../../config');                            // all environment variables are stored here

const router = express.Router();                                   // Routing object of express module
router.post('/', (req, res, next) => {

    const token = req.headers['x-access-token'];                   //to fetch jwt token from http header
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' }); //error handling if no token is present
    
    /* jwt.verify() method to verify the jwt token */
    jwt.verify(token, config.secret, function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' }); //error handling if token is wrong

        if (req.body.doc && req.body.patch) {                       // check if fields are empty

            if (JSON.parse(JSON.stringify(req.body.doc)) && Array.isArray(req.body.patch) ) { // check if fields have invalid data
                patchedjson = jsonpatch.apply_patch(req.body.doc, req.body.patch); // function to apply patch to json
                res.status(200).send({ status: 'success', patchedjson: patchedjson }); // send success response
            }
            else {
                res.status(400).send({status: 'failed', message: 'Invalid document or patch.'}); // error handling in case of invalid document or patch
            }
        }
        else {
            res.status(400).send({status: 'failed', message: 'Document or patch missing.'}); // error handling in case document or patch is not present
        }
    });    
});

module.exports = router;
