'use strict';

var express = require('express');
var controller = require('./user.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/leaderboard', auth.isAuthenticated(), controller.findAll);
router.post('/addPoints', auth.isAuthenticated(), controller.addPoints);
router.post('/removePoints', auth.isAuthenticated(), controller.removePoints);
router.get('/me', auth.isAuthenticated(), controller.me);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', controller.create);
router.get('/:id/tours', auth.isAuthenticated(), controller.showTours);

module.exports = router;
