const express = require('express');
const JwtService = require('../../authentication/jwt.service');
const UsersController = require('./controller');
const {
	addUserValidator,
	authenticateUserValidator,
	getUserValidator,
	updateUserValidator,
} = require('./validator');

const usersRouter = express.Router();
const usersController = new UsersController();

usersRouter.post('/', addUserValidator, (req, res, next) => {
	usersController.addUser(req, res, next);
});

usersRouter.post('/login', authenticateUserValidator, (req, res, next) => {
	usersController.authenticateUser(req, res, next);
});

// JWT protection for the endpoints below
const jwtService = new JwtService();
const userJwtVerifier = jwtService.verificationMiddlewareFactory('USER');
usersRouter.use(userJwtVerifier);

usersRouter.get('/', getUserValidator, (req, res, next) => {
	usersController.getUser(req, res, next);
});

usersRouter.patch('/', updateUserValidator, (req, res, next) => {
	usersController.updateUser(req, res, next);
});

usersRouter.post('/set-active', (req, res, next) => {
	usersController.setActiveState(req, res, next);
});

usersRouter.post('/set-inactive', (req, res, next) => {
	usersController.setInActiveState(req, res, next);
});

module.exports = usersRouter;