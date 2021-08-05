const express = require('express');
const JwtService = require('../../authentication/jwt.service');
const AssetsController = require('./controller');
const {
	addAssetValidator,
	getAssetValidator,
	getAssetHistoryValidator,
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

assetsRouter.get('/:id', getAssetValidator, (req, res, next) => {
	assetsController.getAsset(req, res, next);
});

assetsRouter.get('/history/:id', getAssetHistoryValidator, (req, res, next) => {
	assetsController.getAssetHistory(req, res, next);
});

assetsRouter.patch('/', updateAssetValidator, (req, res, next) => {
	assetsController.updateAsset(req, res, next);
});

assetsRouter.post('/set-state', (req, res, next) => {
	assetsController.setState(req, res, next);
});

module.exports = assetsRouter;
