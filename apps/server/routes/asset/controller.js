const AssetsService = require('./service');
const assetsService = new AssetsService();

class AssetsController {

	async addAsset(req, res, next) {
		const assetInfo = {
			createdAt: new Date(),
			id: req.body.id,
			name: req.body.name,
		};
		let result = null;
		try {
			result = await assetsService.addAsset(assetInfo);
		} catch (e) {
			next(e);
			return null; // Execution continues after the next() call finishes, so we have to 'return' here to avoid sending a response to clients twice
		}
		res.status(200).json(result);
	}

	async getAsset(req, res, next) {
		const query = {
			selector: {
				contractNamespace: 'traceabilitysc.asset',
				id: req.user.id,
			}
		};
		let result = null;
		try {
			result = await assetsService.getAsset(query);
		} catch (e) {
			next(e);
			return null;
		}
		res.status(200).json(result);
	}

	async updateAsset(req, res, next) {
		const updatedAssetInfo = req.body;
		updatedAssetInfo.id = req.user.id;
		let result = null;
		try {
			result = await assetsService.updateAsset(updatedAssetInfo);
		} catch (e) {
			next(e);
			return null;
		}
		res.status(200).json(result);
	}

	async setIntermediaryState(req, res, next) {
		const assetInfo = req.user;
		let result = null;
		try {
			result = await assetsService.setIntermediaryState(assetInfo);
		} catch (e) {
			next(e);
			return null; // Execution continues after the next() call finishes, so we have to 'return' here to avoid sending a response to clients twice
		}
		res.status(200).json(result);
	}
}

module.exports = AssetsController;