var supertest = require('supertest');
var chai = require('chai');

var expect = chai.expect;
var should = chai.should;
var app = require('./../app');

var request = supertest(app);

var headers = {'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InN1ZGhhIiwicGFzc3dvcmQiOiJzdWRoYTEyMyJ9.wlmIn0M-Y6cj5XSvGP9oTNXLVgqhFj-3XOlEK1CV8JE'};
var body = { "imgURL": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/India_food.jpg/220px-India_food.jpg" };

describe('POST /thumbnailGeneration', () => {

    it('should reject requests without token with status 401 and response body', () => {
        
        request.post('/thumbnailGeneration')
            .send(body)
            .expect(401)
            .end(function ( err, res) {
                expect(res.body).to.have.property('auth');
                expect(res.body.auth).to.eql(false);
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.eql('No token provided.');
            });      
    });

    it('should reject requests with invalid token with status 500 and response body', () => {
        
        request.post('/thumbnailGeneration')
            .set({'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InN1ZGhhIiwicGFzc3dvcmQiOiJzdWRoYTEyMyJ9.wlmIn0M-Y6cj5XSvGP9oTNXLVgqhFj'})
            .send(body)
            .expect(500)
            .end(function ( err, res) {
                expect(res.body).to.have.property('auth');
                expect(res.body.auth).to.eql(false);
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.eql('Failed to authenticate token.');
            });      
    });

    it('should reject empty imgURL with 400 status code and response body', () => {
        
        request.post('/thumbnailGeneration')
            .set({'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InN1ZGhhIiwicGFzc3dvcmQiOiJzdWRoYTEyMyJ9.wlmIn0M-Y6cj5XSvGP9oTNXLVgqhFj'})
            .send({
                doc: "",
                patch: ""
            })
            .expect(500)
            .end(function ( err, res) {
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.eql('Document or patch missing.');
            });      
    });

    it('should respond with status 200 and response body when fields of request body are not empty', () => {
        
        request.post('/jsonPatch')
            .set(headers)
            .send({
                doc: doc,
                patch: patch
            })
            .expect(200)
            .end(function ( err, res) {
                expect(res.body).to.have.property('status');
                expect(res.body.status).to.eql('success');
                expect(res.body).to.have.property('patchedjson');
                expect(res.body.patchedjson).to.eql({
                    "baz": "boo",
                    "foo": "bar"
                });
            });;        
    });

    it('should respond with status 400 and response body when fields of request body are empty', () => {
        
        request.post('/jsonPatch')
            .set(headers)
            .send({
                doc: "",
                patch: ""
            })
            .expect(400)
            .end(function ( err, res) {
                expect(res.body).to.have.property('status');
                expect(res.body.auth).to.eql('failed');
                expect(res.body).to.have.property('message');
                expect(res.body.token).to.eql('Document or patch missing.');
            });
    });
});