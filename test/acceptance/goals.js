/* global describe, before, beforeEach, it */

'use strict';

/* 
Dave's Annotations (See the comments with numbers in them to follow along)
------------------
What's going on here exactly?
1. We need need to set our test database like in previous tests, so that the child_process knows 
which database to seed data to.

2. Here, we're going to want to run a testing server. index.js has been exported to allow us to import it
anywhere in the project

3. For now, this cookie is null. It's null because we haven't gotten a cookie from the browser yet. More on this later.

4. supertest is a npm package that allows us to actually simulate browser requests. We've clevery
named the variable...request.

5. When you visit a website, what is the first page you normally get to? The homepage right? This says
before we begin testing, go to the home page at ('/'), end it when done.

6. This is an over-generalization of this block of code, but it basically logs a user in before each test
and if the login information given is correct, assigns it to the cookie variable from annotation #3.

If we did not do this, we wouldn't get a 404. We would get a 302 as a result of the security.bounce method
inside of our routes.js file.

7. On this line, request is sending a request to the dumby server 

7a. This is the type of request it's making and to what path it's making it to

7b. Remember in the beforeEach statement? We're simulating a logged in user that has a cookie. Were this cookie
null, we would get a 302 right here.

7c. .end does something after the request has been fully made. However, notice the callback function inside of this.
We need to do our tests within this function since we're communicating asynchronously somewhere remotely.

7d. Our first test is to make sure that it gives a 200 (OK). We're expecting to be able to get to the page

7e. As another test, we're expect there to be the word (in plain text) 'Name' to be somewhere on it.

8. Just like a GET request, it's also possible to simulate a POST. This is posting to ('/goals')

8a. Normally, if we're POSTing something, it involves sending data to the server. Hence the word 'send'.
Notice the odd formatting. This is how the browser formats form data. (To pretty it up, use JSON.parse())

9. Mark this one down in on your eyelids, because it's really important. Always keep in mind that a user
can simply enter an ID in the address bar and gain access to certain routes. In order to prevent this
from happening, you will need to test against it.

*/

process.env.DB   = 'life-coach-test'; //1

var expect  = require('chai').expect,
    cp      = require('child_process'),
    app     = require('../../app/index'), //2
    cookie  = null, //3
    request = require('supertest'); //4

describe('goals', function(){
  before(function(done){
    request(app).get('/').end(done); //5
  });

  beforeEach(function(done){ //6
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

  describe('get /goals/new', function(){
    it('should show the new goals page', function(done){
      request(app)//7
      .get('/goals/new') //7a
      .set('cookie', cookie) //7b
      .end(function(err, res){ //7c
        expect(res.status).to.equal(200); //7d
        expect(res.text).to.include('Name'); //7e
        expect(res.text).to.include('Due');
        expect(res.text).to.include('Tags');
        done();
      });
    });
  });

  describe('post /goals', function(){
    it('should create a new goal and redirect to goals', function(done){
      request(app)
      .post('/goals') //8
      .set('cookie', cookie)
      .send('name=stuff&date=2010-10-10&tags=stuff%2C+stuff%2C+stuff') //8a
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

    it('should not find allow users to manually enter path and gain access', function(done){ //9
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

