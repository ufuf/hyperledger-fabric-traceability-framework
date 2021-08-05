const SmartContractWrapper = require('../../../lib/smart-contract-wrapper');
const JwtService = require('../../authentication/jwt.service');
const {
	BadRequest,
	NotFound,
} = require('../../error-handling/errors');

const assetContractWrapper = new SmartContractWrapper('traceabilitysc.asset');
const dataContractWrapper = new SmartContractWrapper('traceabilitysc.data');
const jwtService = new JwtService();

class AssetService {

	async addAsset(assetInfo) {
		const result = await assetContractWrapper.submitTransaction('addAsset', assetInfo);
		if (result.error === 'Asset already exists in the ledger') {
			throw new BadRequest(result.error);
		}
		return result;
	}

	async getAsset(query) {
		const result = await dataContractWrapper.evaluateTransaction('richQuery', query);
		if (result.error === 'No items matching the query were found in the ledger') {
			throw new NotFound('Asset not found in the ledger');
		}
		return result;
	}

	async getAssetHistory(updatedAssetInfo) {
		console.log(updatedAssetInfo);
		const result = await dataContractWrapper.evaluateTransaction('getHistoryForAssetKey', updatedAssetInfo);
		if (result.error === 'No history for the specified key were found in the ledger') {
			throw new NotFound('Asset not found in the ledger');
		}
		return result;
	}

	async updateAsset(updatedAssetInfo) {
		const result = await assetContractWrapper.submitTransaction('updateAsset', updatedAssetInfo);
		if (result.error === 'Asset not found in the ledger') {
			throw new NotFound(result.error);
		}
		return result;
	}

	async setINFULLFILLMENTState(assetId) {
		const result = await assetContractWrapper.submitTransaction('setINFULLFILLMENTState', assetId);
		if (result.error === 'Asset not found in the ledger') {
			throw new NotFound(result.error);
		}
		if (result.error) {
			throw new BadRequest(result.error);
		}
		return result;
	}

	async setINSHOPState(assetId) {
		const result = await assetContractWrapper.submitTransaction('setINSHOPState', assetId);
		if (result.error === 'Asset not found in the ledger') {
			throw new NotFound(result.error);
		}
		if (result.error) {
			throw new BadRequest(result.error);
		}
		return result;
	}

	async setCUSTOMERState(assetId) {
		const result = await assetContractWrapper.submitTransaction('setCUSTOMERState', assetId);
		if (result.error === 'Asset not found in the ledger') {
			throw new NotFound(result.error);
		}
		if (result.error) {
			throw new BadRequest(result.error);
		}
		return result;
	}
}

module.exports = AssetService;
