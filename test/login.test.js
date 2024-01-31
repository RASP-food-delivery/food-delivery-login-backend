const assert = require('chai').assert;
const expect = require('chai').expect;
const request = require('supertest');
// const envData = require('../../data/envData');
// const tokenAuthData = require('../../data/tokenAuthData');

const app = require('../app.js');

var token;

describe ('POST /api/auth', function() {

    it ('Should Succeed Registration (Customer)', function(done) {
        const email = Math.floor(Math.random()*10000) + "@iitbhilai.ac.in";
        request(app)
            .post('/api/auth/register/')
            .set('Content-type', 'application/json')
            .send({ role:"user", email: email, password: 'some password',name : "shashwat" })
            .expect(201)
            .end(function(err, res) {
                expect(res.body).to.have.property('message').to.equal('User Created Successfully');
                done(err);
          });
        });
  
    it ('Should Succeed Registration (Vendor)', function(done) {
        const phoneno = "9112291129";
        request(app)
            .post('/api/auth/register/')
            .set('Content-type', 'application/json')
            .send({ role:"vendor", phone: phoneno, password: 'some password',name : "shashwat", shopname : "shashwat halwai" })
            .expect(201)
            .end(function(err, res) {
                // console.log("error:",res.body.error,"bas")
                expect(res.body).to.have.property('message').to.equal('User Created Successfully');
                done(err);
            });
        });
    
    it ('Should Login and Generate Token (Customer)', function(done) {
    request(app)
        .post('/api/auth/login/')
        .set('Content-type', 'application/json')
        .send({ role:"user", email: 'shash11@iitbhilai.ac.in', password: 'IIT bhilai 11' })
        .expect(200)
        .end(function(err, res) {
            expect(res.body).to.have.property('message').to.equal('Login Successful');
            expect(res.body).to.have.property('ID').to.equal('shash11@iitbhilai.ac.in');
            token = res.body.token;
            done(err);
      });
    });
        
    it ('Should Login and Generate Token (Vendor)', function(done) {
        request(app)
            .post('/api/auth/login/')
            .set('Content-type', 'application/json')
            .send({ role:"vendor", phone: '9000000010', password: 'IIT bhilai 10' })
            .expect(200)
            .end(function(err, res) {
                expect(res.body).to.have.property('message').to.equal('Login Successful');
                expect(res.body).to.have.property('ID').to.equal('9000000010');
                token = res.body.token;
                done(err);
          });
        });
        
    it ('Should fail Login on unregistered email (Customer)', function(done) {
        request(app)
            .post('/api/auth/login/')
            .set('Content-type', 'application/json')
            .send({ role:"user", email: 'random012930@iitbhilai.ac.in', password: 'IIT bhilai 11' })
            .expect(400)
            .end(function(err, res) {
                expect(res.body).to.have.property('message').to.equal('Email/ Phone not found');
                done(err);
          });
        });
    it ('Should fail Login on unregistered phone (Vendor)', function(done) {
        request(app)
            .post('/api/auth/login/')
            .set('Content-type', 'application/json')
            .send({ role:"vendor", phone: 'randomnumber', password: 'IIT bhilai 11' })
            .expect(400)
            .end(function(err, res) {
                expect(res.body).to.have.property('message').to.equal('Email/ Phone not found');
                done(err);
            });
        });

    it ('Should fail Login on wrong password (Customer)', function(done) {
        request(app)
            .post('/api/auth/login/')
            .set('Content-type', 'application/json')
            .send({ role:"user", email: 'shash11@iitbhilai.ac.in', password: 'wrong password' })
            .expect(400)
            .end(function(err, res) {
                expect(res.body).to.have.property('message').to.equal('Passwords does not match');
                done(err);
          });
        });
    it ('Should fail Login on wronog password (Vendor)', function(done) {
        request(app)
            .post('/api/auth/login/')
            .set('Content-type', 'application/json')
            .send({ role:"vendor", phone: '9000000010', password: 'wrong password' })
            .expect(400)
            .end(function(err, res) {
                expect(res.body).to.have.property('message').to.equal('Passwords does not match');
                done(err);
            });
        });


});