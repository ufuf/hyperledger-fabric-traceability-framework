const express = require('express');
const JwtService = require('../../authentication/jwt.service');
const AssetsController = require('./controller');
const {
	addAssetValidator,
	getAssetValidator,
	updateAssetValidator,
} = require('./validator');

const assetsRouter = express.Router();
const assetsController = new AssetsController();

// JWT protection for the endpoints below
const jwtService = new JwtService();
const assetJwtVerifier = jwtService.verificationMiddlewareFactory('USER');
assetsRouter.use(assetJwtVerifier);

assetsRouter.post('/', addAssetValidator, (req, res, next) => {
	assetsController.addAsset(req, res, next);
});

assetsRouter.get('/', getAssetValidator, (req, res, next) => {
	assetsController.getAsset(req, res, next);
});

assetsRouter.patch('/', updateAssetValidator, (req, res, next) => {
	assetsController.updateAsset(req, res, next);
});

assetsRouter.post('/set-state', (req, res, next) => {
	assetsController.setState(req, res, next);
});

module.exports = assetsRouter;