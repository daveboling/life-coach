'use strict';

var Mongo = require('mongodb'),
    Task  = require('./task');

function Goal(o, userId){
  this.name = o.name;
  this.date = new Date(o.date);
  this.tags = o.tags.split(',');
  this.userId = userId;
  this.tasks = [];
}

Object.defineProperty(Goal, 'collection', {
  get: function(){return global.mongodb.collection('goals');}
});

Goal.all = function(cb){
  Goal.collection.find().toArray(cb);
};

Goal.create = function(o, userId, cb){
  var goal = new Goal(o, userId);
  Goal.collection.save(goal, cb);
};

Goal.findGoalsById = function(userId, cb){
  Goal.collection.find({userId: userId}).toArray(function(err, goals){
    cb(goals);
  });
};

Goal.show = function(goalId, userId, cb){
  var id = Mongo.ObjectID(goalId);
  Goal.collection.findOne({_id: id, userId: userId}, cb);
};

Goal.addTaskById = function(task, goalId, cb){
  var t = new Task(task),
     id = Mongo.ObjectID(goalId);
  Goal.collection.findOne({_id: id}, function(err, goal){
    goal.tasks.push(t);
    Goal.collection.save(goal, function(){
      cb(err, goal);
    });
  });
};

module.exports = Goal;

