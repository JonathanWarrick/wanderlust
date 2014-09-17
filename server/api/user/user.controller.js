'use strict';

var User = require('./user.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var Tour = require('../tour/tour.model');

var validationError = function(res, err) {
  return res.json(422, err);
};

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {
  User.find({}, '-salt -hashedPassword', function (err, users) {
    if(err) return res.send(500, err);
    res.json(200, users);
  });
};

/**
 * Creates a new user
 */
exports.create = function (req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.save(function(err, user) {
    if (err) return validationError(res, err);
    var token = jwt.sign({_id: user._id }, config.secrets.session, { expiresInMinutes: 60*5 });
    res.json({ token: token });
  });
};


/**
 * Get a single user
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;

  User.findById(userId, function (err, user) {
    if (err) return next(err);
    if (!user) return res.send(401);
    res.json(user.profile);
  });
};

/**
 * Get all users
 */
exports.findAll = function(req, res, next) {
  console.log('find all called');
  User.find(function (err, users) {
    if (err) return next(err);
    res.json(200, users);
  });
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
  User.findByIdAndRemove(req.params.id, function(err, user) {
    if(err) return res.send(500, err);
    return res.send(204);
  });
};

/**
 * Change a users password
 */
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if(user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
        if (err) return validationError(res, err);
        res.send(200);
      });
    } else {
      res.send(403);
    }
  });
};

/**
 * Change a users point total
 */
exports.addPoints = function(req, res, next) {
  console.log('req', req);
  console.log('req.user._id', req.user._id);
  var userId = req.user._id;

  console.log('in addPoints with request', userId);

  User.findById(userId, function (err, user) {
    user.points += req.body.points;
    user.save(function(err) {
      if (err) return validationError(res, err);
      res.send(200);
    }); 
  });
};

exports.removePoints = function(req, res, next) {
  var userId = req.user._id;

  console.log('in removePoints with', userId);

  User.findById(userId, function (err, user) {
    user.points = user.points - req.body.points;
    user.save(function(err) {
      if (err) return validationError(res, err);
      res.send(200);
    }); 
  });
};

/**
 * Get my info
 */
exports.me = function(req, res, next) {
  var userId = req.user._id;
  User.findOne({
    _id: userId
  }, '-salt -hashedPassword', function(err, user) { // don't ever give out the password or salt
    if (err) return next(err);
    if (!user) return res.json(401);
    res.json(user);
  });
};

/**
 * Get the all the tours created by the current user
 */
exports.showTours = function(req, res, next) {

  if(!req.user._id.equals(req.params.id)) {return res.send(401);}

  Tour.find({author: req.params.id}, function(err, tours){
    if(err) return next(err);
    res.json(tours);
  });
};


/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};
