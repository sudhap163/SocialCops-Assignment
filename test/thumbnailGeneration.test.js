const supertest = require('supertest');
const chai = require('chai');

const expect = chai.expect;
const should = chai.should;
const app = require('./../app');

const request = supertest(app);

const headers = {'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InN1ZGhhIiwicGFzc3dvcmQiOiJzdWRoYTEyMyJ9.wlmIn0M-Y6cj5XSvGP9oTNXLVgqhFj-3XOlEK1CV8JE'};
const body = { "imgURL": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/India_food.jpg/220px-India_food.jpg" };

describe('POST /thumbnailGeneration', () => {

    it('should reject requests without token with status 401 and response body', () => {
        
        request.post('/thumbnailGeneration')
            .send(body)
            .expect(401)
            .end(( err, res) => {
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
            .end(( err, res) => {
                expect(res.body).to.have.property('auth');
                expect(res.body.auth).to.eql(false);
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.eql('Failed to authenticate token.');
            });      
    });

    it('should reject empty imgURL with 400 status code and response body', () => {
        
        request.post('/thumbnailGeneration')
            .set(headers)
            .send()
            .expect(400)
            .end(( err, res) => {
                expect(res.body).to.have.property('status');
                expect(res.body.status).to.eql('failed');
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.eql('Image URL missing.');
            });      
    });

    it('should respond with status 200 and response body with proper request body', () => {
        
        request.post('/thumbnailGeneration')
            .set(headers)
            .send(body)
            .expect(200);        
    });

    it('should respond with status 400 and response body when invalid request body', () => {
        
        request.post('/thumbnailGeneration')
            .set(headers)
            .send({ imgURL: "Hello!"})
            .expect(400)
            .end(( err, res) => {
                expect(res.body).to.have.property('status');
                expect(res.body.status).to.eql('failed');
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.eql('Invalid image URL.');
            });  
    });
});