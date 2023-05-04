//Create web server
//var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('./verify');
var Comments = require('../models/comments');

var commentRouter = express.Router();
commentRouter.use(bodyParser.json());

commentRouter.route('/')
.get(Verify.verifyOrdinaryUser, function(req,res,next){
	Comments.find(req.query)
		.populate('postedBy')
		.exec(function(err, comment){
			if(err) throw err;
			res.json(comment);
		});
})

.post(Verify.verifyOrdinaryUser, function(req, res, next){
	req.body.postedBy = req.decoded._doc._id;
	Comments.create(req.body, function(err, comment){
		if(err) throw err;
		console.log('Comment created!');
		var id = comment._id;
		res.writeHead(200, {
			'Content-Type': 'text/plain'
		});
		res.end('Added the comment with id: ' + id);
	});
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
	Comments.remove({}, function(err, resp){
		if(err) throw err;
		res.json(resp);
	});
});

commentRouter.route('/:commentId')
.get(Verify.verifyOrdinaryUser, function(req,res,next){
	Comments.findById(req.params.commentId)
		.populate('postedBy')
		.exec(function(err, comment){
			if(err) throw err;
			res.json(comment);
		});
})

.put(Verify.verifyOrdinaryUser, function(req, res, next){
	Comments.findByIdAndUpdate(req.params.commentId, {
		$set: req.body
	}, {
		new: true
	}, function(err, comment){
		if(err) throw err;
		res.json(comment);
	});
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
	Comments.findByIdAndRemove(req.params.commentId, function(err, resp){
		if(err) throw err;
		res.json(resp);
	});
});

module.exports = commentRouter;



