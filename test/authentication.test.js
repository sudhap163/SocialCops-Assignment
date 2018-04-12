const supertest = require('supertest');
const chai = require('chai');

const expect = chai.expect;
const should = chai.should;
const app = require('./../app');

const request = supertest(app);

describe('POST /login', () => {

    it('should reject empty username or passwords with 400 status code and response body', () => {
        
        request.post('/login')
            .send({
                username: "",
                password: "Sudha123"
            })
            .expect(400)
            .end( ( err, res) => {
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.eql('Username or password missing');
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
            .end(( err, res) => {
                expect(res.body).to.have.property('auth');
                expect(res.body.auth).to.eql(true);
                expect(res.body).to.have.property('token');
            });
    });
});