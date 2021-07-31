const SmartContractWrapper = require('../../../lib/smart-contract-wrapper');
const JwtService = require('../../authentication/jwt.service');
const {
	BadRequest,
	NotFound,
} = require('../../error-handling/errors');

const userContractWrapper = new SmartContractWrapper('traceabilitysc.user');
const dataContractWrapper = new SmartContractWrapper('traceabilitysc.data');
const jwtService = new JwtService();

class UserService {

	async addUser(userInfo) {
		const result = await userContractWrapper.submitTransaction('addUser', userInfo);
		if (result.error === 'User already exists in the ledger') {
			throw new BadRequest(result.error);
		}
		return result;
	}

	async authenticateUser(userCredentials) {
		const result = await userContractWrapper.evaluateTransaction('authenticateUser', userCredentials);
		if (result.error === 'User not found in the ledger') {
			throw new NotFound(result.error);
		}
		if (result.error === 'Incorrect password, please try again') {
			throw new BadRequest(result.error);
		}
		if (result.error !== null)
			throw new BadRequest(result.error);

		const jwt = jwtService.sign(result.data, 'USER');
		return {
			success: result.success,
			data: {
				jwt,
				user: result.data,
			},
			error: result.error,
		};
	}

	async getUser(query) {
		const result = await dataContractWrapper.evaluateTransaction('richQuery', query);
		if (result.error === 'No items matching the query were found in the ledger') {
			throw new NotFound('User not found in the ledger');
		}
		return result;
	}

	async updateUser(updatedUserInfo) {
		const result = await userContractWrapper.submitTransaction('updateUser', updatedUserInfo);
		if (result.error === 'User not found in the ledger') {
			throw new NotFound(result.error);
		}
		return result;
	}

	async setActiveState(userInfo) {
		const result = await userContractWrapper.submitTransaction('setActiveState', userInfo);
		if (result.error === 'User not found in the ledger') {
			throw new NotFound(result.error);
		}
		if (result.error === 'User status is not INACTIVE, cannot move to ACTIVE state') {
			throw new BadRequest(result.error);
		}
		return result;
	}

	async setInActiveState(userInfo) {
		const result = await userContractWrapper.submitTransaction('setInActiveState', userInfo);
		if (result.error === 'User not found in the ledger') {
			throw new NotFound(result.error);
		}
		if (result.error === 'User status is not ACTIVE, cannot move to INACTIVE state') {
			throw new BadRequest(result.error);
		}
		return result;
	}
}

module.exports = UserService;
