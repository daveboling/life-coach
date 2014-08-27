/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';

var expect    = require('chai').expect,
    Goal      = require('../../app/models/goal'),
    dbConnect = require('../../app/lib/mongodb'),
    cp        = require('child_process'),
    Mongo     = require('mongodb'),
    db        = 'life-coach-test';

describe('Goal', function(){
  before(function(done){
    dbConnect(db, function(){
      done();
    });
  });

  beforeEach(function(done){
   cp.execFile(__dirname + '/../scripts/clean-db.sh', [db], {cwd:__dirname + '/../scripts'}, function(err, stdout, stderr){
     done();
   });
 });
    
  describe('.create', function(){
    it('should create a goal in the database', function(done){
      var body = {
        name: 'Doctor',
        date: '2014-01-10',
        tags: 'tag1, tag2, tag3'
      },
      userId = Mongo.ObjectID('000000000000000000000001');
      Goal.create(body, userId, function(err, goal){
        expect(goal).to.be.instanceof(Goal);
        expect(goal._id).to.be.instanceof(Mongo.ObjectID);
        expect(goal.userId).to.be.instanceof(Mongo.ObjectID);
        expect(goal.date).to.be.instanceof(Date);
        expect(goal.name).to.equal('Doctor');
        expect(goal.tags).to.have.length(3);
        done();
      });
    });
  });

  describe('.findGoalsById', function(){
    it('should find goals by user ID', function(done){
      var userId = Mongo.ObjectID('000000000000000000000001');
      Goal.findGoalsById(userId, function(goals){
        expect(goals).to.have.length(1);
        done();
      });
    });
  });

  describe('.show', function(){
    it('should find a goal by its goalId', function(done){
      var goalId = '100000000000000000000000';
      var userId = Mongo.ObjectID('000000000000000000000001');
      Goal.show(goalId, userId, function(err, goal){
        expect(goal.name).to.equal('Doctor');
        done();
      });
    });
  });

  describe('.addTaskById', function(){
    it('should add a task to a specific goal by its ID', function(done){
      var goalId = '100000000000000000000000';
      var task = {
        name: 'shoes',
        difficulty: 'hard',
        description: 'I went runnin',
        rank: 5
      };

      Goal.addTaskById(task, goalId, function(){
        expect(task).to.be.ok;
        done();
      });
    });
  });

});

