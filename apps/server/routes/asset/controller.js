const AssetsService = require('./service');
const assetsService = new AssetsService();

const {
	BadRequest,
	NotFound,
} = require('../../error-handling/errors');

class AssetsController {

	async addAsset(req, res, next) {

		const assetInfo = req.body;
		let d = new Date();
		assetInfo.createdAt = d.toString();

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
				id: req.params.id,
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

	async getAssetHistory(req, res, next) {
		const updatedAssetInfo = req.params;
		updatedAssetInfo.id = req.params.id;

		let result = null;
		try {
			result = await assetsService.getAssetHistory(updatedAssetInfo);
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
		const stateAssetInfo = req.body;
		const state = req.body.state;

		//TODO: extraData silinmeli veya eklenmeli.
		//TODO: ShopData ekleyelim lokasyonlarla beraber.

		let result = null;
		try {
			if (state == "INFULLFILLMENT")
				result = await assetsService.setINFULLFILLMENTState(stateAssetInfo);
			else if (state == "INSHOP")
				result = await assetsService.setINSHOPState(stateAssetInfo);
			else if (state == "CUSTOMER")
				result = await assetsService.setCUSTOMERState(stateAssetInfo);
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
