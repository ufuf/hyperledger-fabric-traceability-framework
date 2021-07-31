'use strict';

const AssetContract = require('./smart-contracts/asset-contract');
const DataContract = require('./smart-contracts/data-contract');
const UserContract = require('./smart-contracts/user-contract');

module.exports.contracts = [
	AssetContract,
	DataContract,
	UserContract,
];