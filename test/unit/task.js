/* jshint expr:true */
/* global describe, it */

'use strict';

var expect    = require('chai').expect,
    Task        = require('../../app/models/task');

  describe('contructor', function(){
    it('should create a new task object', function(){
      var t = new Task({
        name: 'shoes',
        difficulty: 'hard',
        description: 'Get the shoes man',
        rank: 5
      });

      expect(t.name).to.equal('shoes');
      expect(t.difficulty).to.equal('hard');
      expect(t.isComplete).to.equal(false);
      expect(t.description).to.equal('Get the shoes man');
      expect(t.rank).to.equal(5);
    });
  });

