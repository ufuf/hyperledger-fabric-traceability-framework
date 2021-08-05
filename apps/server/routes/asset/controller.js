const AssetsService = require('./service');
const assetsService = new AssetsService();

const {
	BadRequest,
	NotFound,
} = require('../../error-handling/errors');

class AssetsController {

	async addAsset(req, res, next) {
		const assetInfo = {
			createdAt: new Date(),
			id: req.body.id,
			name: req.body.name,
			data: req.body.data
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
				id: req.body.id,
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
		updatedAssetInfo.id = req.body.id;
		let result = null;
		try {
			result = await assetsService.updateAsset(updatedAssetInfo);
		} catch (e) {
			next(e);
			return null;
		}
		res.status(200).json(result);
	}

	async setState(req, res, next) {
		const assetId = req.body.id;
		const state = req.body.state;

		let result = null;
		try {
			if (state == "INFULLFILLMENT")
				result = await assetsService.setINFULLFILLMENTState(assetId);
			else if (state == "INSHOP")
				result = await assetsService.setINSHOPState(assetId);
			else if (state == "CUSTOMER")
				result = await assetsService.setCUSTOMERState(assetId);
			else
				throw new BadRequest("Unknown or intransferable state");
		} catch (e) {
			next(e);
			return null; // Execution continues after the next() call finishes, so we have to 'return' here to avoid sending a response to clients twice
		}
		res.status(200).json(result);
	}
}

module.exports = AssetsController;