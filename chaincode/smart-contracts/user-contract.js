'use strict';

const {
	Contract,
	Context
} = require('fabric-contract-api');
const User = require('./user');

/** 
 * The context is used to interact with the ledger via the stub object
 */
class UserContext extends Context {
	constructor() {
		super();
	}
}

class UserContract extends Contract {
	constructor() {
		// The parameter for super() is the smart contract name. Functions as a unique namespace, useful when multiple smart contracts are deployed within the same chaincode
		super('traceabilitysc.user');
	}

	/**
	 * Define a custom context for users
	 * Called automatically before any after, before, unknown and user defined transaction(function)
	 * The chaincodeStub and client identity objects are injected in a ctx object by this function
	 */
	createContext() {
		return new UserContext();
	}

	/**
	 * Instantiate to perform any setup of the ledger that might be required.
	 * @param {Context} ctx the transaction context
	 */
	async instantiate(ctx) {
		// It could be where data migration/initialization is performed, if necessary
		// Although a good practice is to have a separate method for ledger state initialization
		console.log('Instantiate the contract');
	}

	async addUser(ctx, userInfoJson) {
		// Transform JSON into an object
		const userInfo = JSON.parse(userInfoJson);

		// User existence check
		const userKey = await ctx.stub.createCompositeKey('traceabilitysc.user', [userInfo.id]);
		const userJsonBuffer = await ctx.stub.getState(userKey);
		const userJson = userJsonBuffer.toString();
		if (userJson) {
			return {
				success: false,
				data: null,
				error: 'User already exists in the ledger',
			};
		}

		// Create and update User object
		const user = new User(userKey, userInfo);

		// Status update
		user.setActive();

		// Add transaction info
		const txID = await ctx.stub.getTxID();
		Object.assign(user, { txID });

		// Update the ledger
		await ctx.stub.putState(userKey, Buffer.from(JSON.stringify(user)));

		// Return to apps
		return {
			success: true,
			data: user,
			error: null,
		};
	}

	async authenticateUser(ctx, userCredentialsJson) {
		// Transform JSON into an object
		const userCredentials = JSON.parse(userCredentialsJson);

		// User existence check
		const userKey = await ctx.stub.createCompositeKey('traceabilitysc.user', [userCredentials.id]);
		const userJsonBuffer = await ctx.stub.getState(userKey);
		const userJson = userJsonBuffer.toString();
		if (!userJson) {
			return {
				success: false,
				data: null,
				error: 'User not found in the ledger',
			};
		}

		// Parse stored user info as JSON
		const user = JSON.parse(userJson);

		// Credentials check
		if (userCredentials.password === user.password) {
			if (user.isActive)
				return {
					success: true,
					data: user,
					error: null,
				};
			else
				return {
					success: false,
					data: null,
					error: 'User not active, please activate user',
				};
		}

		// Return to apps
		return {
			success: false,
			data: null,
			error: 'Incorrect password, please try again',
		};
	}

	async getUser(ctx, userIdJson) {
		// Transform JSON into an object
		const userId = JSON.parse(userIdJson);

		// User existence check
		const userKey = await ctx.stub.createCompositeKey('traceabilitysc.user', [userId]);
		const userJsonBuffer = await ctx.stub.getState(userKey);
		const userJson = userJsonBuffer.toString();
		if (!userJson) {
			return {
				success: false,
				data: null,
				error: 'User not found in the ledger',
			};
		}

		// Parse stored user info as JSON
		const user = JSON.parse(userJson);

		// Return to apps
		return {
			success: true,
			data: user,
			error: null,
		};
	}

	async updateUser(ctx, updatedUserInfoJson) {
		// Transform JSON into an object
		const updatedUserInfo = JSON.parse(updatedUserInfoJson);

		// User existence check
		const userKey = await ctx.stub.createCompositeKey('traceabilitysc.user', [updatedUserInfo.id]);
		const userJsonBuffer = await ctx.stub.getState(userKey);
		const userJson = userJsonBuffer.toString();
		if (!userJson) {
			return {
				success: false,
				data: null,
				error: 'User not found in the ledger',
			};
		}

		// Update the user object (User class not necessary here)
		const user = JSON.parse(userJson);
		const updatedUser = Object.assign(user, updatedUserInfo);

		// Update the ledger
		await ctx.stub.putState(userKey, Buffer.from(JSON.stringify(updatedUser)));

		delete updatedUser.password;

		// Add transaction info
		const txID = await ctx.stub.getTxID();
		Object.assign(updatedUser, { txID });

		// Return to apps
		return {
			success: true,
			data: updatedUser,
			error: null,
		};
	}

	async setActiveState(ctx, infoJson) {
		// Transform JSON into an object
		const info = JSON.parse(infoJson);

		// Worker existence check
		const userKey = await ctx.stub.createCompositeKey('traceabilitysc.user', [info.id]);
		const userJsonBuffer = await ctx.stub.getState(userKey);
		const userJson = userJsonBuffer.toString();
		if (!userJson) {
			return {
				success: false,
				data: null,
				error: 'User not found in the ledger',
			};
		}

		// Create and update User object
		const storedUserInfo = JSON.parse(userJson);
		Object.assign(storedUserInfo, info);
		const user = new User(userKey, storedUserInfo);

		// Status update
		if (user.isInactive()) {
			user.setActive();
		} else {
			return {
				success: false,
				data: null,
				error: 'User status is not INACTIVE, cannot move to ACTIVE state',
			};
		}

		// Add transaction info
		const txID = await ctx.stub.getTxID();
		Object.assign(user, { txID });

		// Update the ledger
		await ctx.stub.putState(userKey, Buffer.from(JSON.stringify(user)));

		// Return to apps
		return {
			success: true,
			data: user,
			error: null,
		};
	}

	async setInActiveState(ctx, infoJson) {
		// Transform JSON into an object
		const info = JSON.parse(infoJson);

		// Worker existence check
		const userKey = await ctx.stub.createCompositeKey('traceabilitysc.user', [info.id]);
		const userJsonBuffer = await ctx.stub.getState(userKey);
		const userJson = userJsonBuffer.toString();
		if (!userJson) {
			return {
				success: false,
				data: null,
				error: 'User not found in the ledger',
			};
		}

		// Create and update User object
		const storedUserInfo = JSON.parse(userJson);
		Object.assign(storedUserInfo, info);
		const user = new User(userKey, storedUserInfo);

		// Status update
		if (user.isActive()) {
			user.setInactive();
		} else {
			return {
				success: false,
				data: null,
				error: 'User status is not ACTIVE, cannot move to INACTIVE state',
			};
		}

		// Add transaction info
		const txID = await ctx.stub.getTxID();
		Object.assign(user, { txID });

		// Update the ledger
		await ctx.stub.putState(userKey, Buffer.from(JSON.stringify(user)));

		// Return to apps
		return {
			success: true,
			data: user,
			error: null,
		};
	}
}

module.exports = UserContract;