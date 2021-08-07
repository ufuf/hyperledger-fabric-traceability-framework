'use strict';

const {
	Contract,
	Context
} = require('fabric-contract-api');
const Asset = require('./asset');

/** 
 * The context is used to interact with the ledger via the stub object
 */
class AssetContext extends Context {
	constructor() {
		super();
	}
}

class AssetContract extends Contract {
	constructor() {
		// The parameter for super() is the smart contract name. Functions as a unique namespace, useful when multiple smart contracts are deployed within the same chaincode
		super('traceabilitysc.asset');
	}

	/**
	 * Define a custom context for assets
	 * Called automatically before any after, before, unknown and user defined transaction(function)
	 * The chaincodeStub and client identity objects are injected in a ctx object by this function
	 */
	createContext() {
		return new AssetContext();
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

	async addAsset(ctx, assetInfoJson) {
		// Transform JSON into an object
		const assetInfo = JSON.parse(assetInfoJson);

		// Asset existence check
		const assetKey = await ctx.stub.createCompositeKey('traceabilitysc.asset', [assetInfo.id]);
		const assetJsonBuffer = await ctx.stub.getState(assetKey);
		const assetJson = assetJsonBuffer.toString();
		if (assetJson) {
			return {
				success: false,
				data: null,
				error: 'Asset already exists in the ledger',
			};
		}

		// Create and update Asset object
		const asset = new Asset(assetKey, assetInfo);

		// Status update
		asset.setInitial();
		asset.setUpdatedAt();

		// Add transaction info
		const txID = await ctx.stub.getTxID();
		Object.assign(asset, { txID });

		// Update the ledger
		await ctx.stub.putState(assetKey, Buffer.from(JSON.stringify(asset)));

		// Return to apps
		return {
			success: true,
			data: asset,
			error: null,
		};
	}

	async getAsset(ctx, assetIdJson) {
		// Transform JSON into an object
		const assetId = JSON.parse(assetIdJson);

		// Asset existence check
		const assetKey = await ctx.stub.createCompositeKey('traceabilitysc.asset', [assetId]);
		const assetJsonBuffer = await ctx.stub.getState(assetKey);
		const assetJson = assetJsonBuffer.toString();
		if (!assetJson) {
			return {
				success: false,
				data: null,
				error: 'Asset not found in the ledger',
			};
		}

		// Parse stored asset info as JSON
		const asset = JSON.parse(assetJson);

		// Return to apps
		return {
			success: true,
			data: asset,
			error: null,
		};
	}

	async updateAsset(ctx, updatedAssetInfoJson) {
		// Transform JSON into an object
		const updatedAssetInfo = JSON.parse(updatedAssetInfoJson);

		// Asset existence check
		const assetKey = await ctx.stub.createCompositeKey('traceabilitysc.asset', [updatedAssetInfo.id]);
		const assetJsonBuffer = await ctx.stub.getState(assetKey);
		const assetJson = assetJsonBuffer.toString();
		if (!assetJson) {
			return {
				success: false,
				data: null,
				error: 'Asset not found in the ledger',
			};
		}

		// Create and update Asset object
		const storedAssetInfo = JSON.parse(assetJson);
		const currAsset = new Asset(assetKey, storedAssetInfo);

		if (currAsset.isCUSTOMER()) {
			return {
				success: false,
				data: null,
				error: 'Asset status is CUSTOMER, cannot update asset sold to CUSTOMER',
			};
		}

		// Update the asset object (Asset class not necessary here)
		const asset = JSON.parse(assetJson);
		const updatedAssetObj = Object.assign(asset, updatedAssetInfo);

		const updatedAsset = new Asset(assetKey, updatedAssetObj);
		updatedAsset.setUpdatedAt();

		// Update the ledger
		await ctx.stub.putState(assetKey, Buffer.from(JSON.stringify(updatedAsset)));

		// Add transaction info
		const txID = await ctx.stub.getTxID();
		Object.assign(updatedAsset, { txID });

		// Return to apps
		return {
			success: true,
			data: updatedAsset,
			error: null,
		};
	}

	async setINFULLFILLMENTState(ctx, stateAssetInfoJson) {
		// Transform JSON into an object
		const stateAssetInfo = JSON.parse(stateAssetInfoJson);

		// Worker existence check
		const assetKey = await ctx.stub.createCompositeKey('traceabilitysc.asset', [stateAssetInfo.id]);
		const assetJsonBuffer = await ctx.stub.getState(assetKey);
		const assetJson = assetJsonBuffer.toString();
		if (!assetJson) {
			return {
				success: false,
				data: null,
				error: 'Asset not found in the ledger',
			};
		}

		// Create and update Asset object
		const storedAssetInfo = JSON.parse(assetJson);
		const asset = new Asset(assetKey, storedAssetInfo);

		// Status update
		if (asset.isInitial() || asset.isINSHOP()) {
			asset.setINFULLFILLMENT();
			asset.setUpdatedAt();
			asset.extraData = stateAssetInfo.extraData;
		} else {
			return {
				success: false,
				data: null,
				error: 'Asset status is not INITIAL or INSHOP, cannot move to FULLFILLMENT state',
			};
		}

		// Add transaction info
		const txID = await ctx.stub.getTxID();
		Object.assign(asset, { txID });

		// Update the ledger
		await ctx.stub.putState(assetKey, Buffer.from(JSON.stringify(asset)));

		// Return to apps
		return {
			success: true,
			data: asset,
			error: null,
		};
	}

	async setINSHOPState(ctx, stateAssetInfoJson) {
		// Transform JSON into an object
		const stateAssetInfo = JSON.parse(stateAssetInfoJson);

		// Worker existence check
		const assetKey = await ctx.stub.createCompositeKey('traceabilitysc.asset', [stateAssetInfo.id]);
		const assetJsonBuffer = await ctx.stub.getState(assetKey);
		const assetJson = assetJsonBuffer.toString();
		if (!assetJson) {
			return {
				success: false,
				data: null,
				error: 'Asset not found in the ledger',
			};
		}

		// Create and update Asset object
		const storedAssetInfo = JSON.parse(assetJson);
		const asset = new Asset(assetKey, storedAssetInfo);

		// Status update
		if (asset.isINFULLFILLMENT()) {
			asset.setINSHOP();
			asset.setUpdatedAt();
			asset.extraData = stateAssetInfo.extraData;
		} else {
			return {
				success: false,
				data: null,
				error: 'Asset status is not FULLFILLMENT, cannot move to SHOP state',
			};
		}

		// Add transaction info
		const txID = await ctx.stub.getTxID();
		Object.assign(asset, { txID });

		// Update the ledger
		await ctx.stub.putState(assetKey, Buffer.from(JSON.stringify(asset)));

		// Return to apps
		return {
			success: true,
			data: asset,
			error: null,
		};
	}


	async setCUSTOMERState(ctx, stateAssetInfoJson) {
		// Transform JSON into an object
		const stateAssetInfo = JSON.parse(stateAssetInfoJson);

		// Worker existence check
		const assetKey = await ctx.stub.createCompositeKey('traceabilitysc.asset', [stateAssetInfo.id]);
		const assetJsonBuffer = await ctx.stub.getState(assetKey);
		const assetJson = assetJsonBuffer.toString();
		if (!assetJson) {
			return {
				success: false,
				data: null,
				error: 'Asset not found in the ledger',
			};
		}

		// Create and update Asset object
		const storedAssetInfo = JSON.parse(assetJson);
		const asset = new Asset(assetKey, storedAssetInfo);

		// Status update
		if (asset.isINSHOP()) {
			asset.setCUSTOMER();
			asset.setUpdatedAt();
			asset.extraData = stateAssetInfo.extraData;
		} else {
			return {
				success: false,
				data: null,
				error: 'Asset status is not SHOP, cannot move to CUSTOMER state',
			};
		}

		// Add transaction info
		const txID = await ctx.stub.getTxID();
		Object.assign(asset, { txID });

		// Update the ledger
		await ctx.stub.putState(assetKey, Buffer.from(JSON.stringify(asset)));

		// Return to apps
		return {
			success: true,
			data: asset,
			error: null,
		};
	}
}

module.exports = AssetContract;