const express = require('express');
const jwt = require('jsonwebtoken');
const jsonpatch = require('jsonpatch');

const config = require('../../config');

const router = express.Router();
router.post('/', (req, res, next) => {
    console.log(req.body);

    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, config.secret, function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

        if (req.body.doc && req.body.patch) {
            patchedjson = jsonpatch.apply_patch(req.body.doc, req.body.patch);
            res.status(200).send({ status: 'success', patchedjson: patchedjson });
        }
        else {
            res.status(400).send({status: 'failed', message: 'Document or patch missing.'});
        }
    });    
});

module.exports = router;
