/* global describe, before, beforeEach, it */

'use strict';

process.env.DB   = 'lifecoach';

var expect  = require('chai').expect,
    cp      = require('child_process'),
    app     = require('../../app/index'),
    cookie  = null,
    request = require('supertest');

describe('goals', function(){
  before(function(done){
    request(app).get('/').end(done);
  });

  beforeEach(function(done){
    cp.execFile(__dirname + '/../scripts/clean-db.sh', [process.env.DB], {cwd:__dirname + '/../scripts'}, function(err, stdout, stderr){
      request(app)
      .post('/login')
      .send('email=bob@aol.com')
      .send('password=1234')
      .end(function(err, res){
        cookie = res.headers['set-cookie'][0];
        done();
      });
    });
  });

  describe('get /', function(){
    it('should fetch the home page', function(done){
      request(app)
      .get('/')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Home');
        done();
      });
    });
  });

  describe('get /goals/new', function(){
    it('should show the new goals page', function(done){
      request(app)
      .get('/goals/new')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Name');
        expect(res.text).to.include('Due');
        expect(res.text).to.include('Tags');
        done();
      });
    });
  });

  describe('post /goals', function(){
    it('should create a new goal and redirect to goals', function(done){
      request(app)
      .post('/goals')
      .set('cookie', cookie)
      .send('name=stuff&date=2010-10-10&tags=stuff%2C+stuff%2C+stuff')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        done();
      });
    });
  });

  describe('get /goals', function(){
    it('should fetch the goals page', function(done){
      request(app)
      .get('/goals')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Doctor');
        done();
      });
    });
  });

  describe('get /goals/3', function(){
    it('should fetch a specific goal page', function(done){
      request(app)
      .get('/goals/100000000000000000000000')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Doctor');
        done();
      });
    });

    it('should find goal by goalID', function(done){
      request(app)
      .get('/goals/200000000000000000000000')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(302);
        done();
      });
    });
  });

  describe('get /goals/3', function(){
    it('should fetch a specific goal page', function(done){
      request(app)
      .post('/goals/100000000000000000000000/tasks')
      .set('cookie', cookie)
      .send('name=test&description=test&rank=124')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        done();
      });
    });
  });



});

