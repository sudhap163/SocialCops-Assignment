var supertest = require('supertest');
var chai = require('chai');

var expect = chai.expect;
var should = chai.should;
var app = require('./../app');

var request = supertest(app);

describe('POST /login', () => {

    it('should reject empty username or passwords with 400 status code and response body', () => {
        
        request.post('/login')
            .send({
                username: "",
                password: "Sudha123"
            })
            .expect(400)
            .end(function ( err, res) {
                expect(res.body).to.have.property('message'); 
            });      
    });

    it('should respond with status 200 when fields of request body are not empty', () => {
        
        request.post('/login')
            .send({
                username: "Sudha",
                password: "Sudha123"
            })
            .expect(200);        
    });

    it('should respond with response body when fields of request body are not empty', () => {
        
        request.post('/login')
            .send({
                "username": "sudha",
                "password": "sudha123"
            })
            .end(function ( err, res) {
                expect(res.body).to.have.property('auth');
                expect(res.body.auth).to.eql(true);
                expect(res.body).to.have.property('token');
                expect(res.body.token).to.eql('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InN1ZGhhIiwicGFzc3dvcmQiOiJzdWRoYTEyMyIsImlhdCI6MTUyMzI5NDI4MSwiZXhwIjoxNTIzMzgwNjgxfQ.YL5IspFUrnHmzSzFlnLRIH9MNE_gmMoX8YjWHQX4N1Y');
            });
    });
});