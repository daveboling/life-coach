'use strict';

var Goal = require('../models/goal');

exports.new = function(req, res){
  res.render('goals/new');
};

exports.create = function(req, res){
  Goal.create(req.body, res.locals.user._id, function(err, goal){
    res.redirect('/goals');
  });
};

exports.index = function(req, res){
  Goal.findGoalsById(res.locals.user._id, function(goals){
    res.render('goals/index', {goals: goals});
  });
};

exports.show = function(req, res){
  Goal.show(req.params.goalId, res.locals.user._id, function(err, goal){
    if(goal){
      res.render('goals/show', {goal: goal});
    }else {
      res.redirect('/');
    }
  });
};

exports.addTask = function(req, res){
  Goal.addTaskById(req.body, req.params.goalId, function(err, goal){
    if(!goal){ 
      console.log('No goal found.');
      res.redirect('/goal');
    }else {
      console.log('Goal found, saving to database.');
      res.redirect('/goals/' + req.params.id);  
    }

  });
};

