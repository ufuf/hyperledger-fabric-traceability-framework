const { celebrate, Joi } = require('celebrate');

const addAssetValidator = celebrate({
	body: Joi.object().keys({ // The req.body object must be populated prior to the validation
		id: Joi.string()
			.max(64)
			.required(),
		name: Joi.string()
			.max(64)
			.required(),
		make: Joi.string()
			.max(64)
			.required(),
		model: Joi.string()
			.max(64)
			.required(),
		serialNumber: Joi.string()
			.max(64)
			.required(),
		productionDate: Joi.string()
			.max(64)
			.required(),
		extraData: Joi.object(),
	})
});

const getAssetValidator = celebrate({
	query: Joi.object().keys({
		pageSize: Joi.number()
			.integer()
			.positive(),
		bookmark: Joi.string()
			.max(128)
			.allow('', null),
	}),
});


const getAssetHistoryValidator = celebrate({
	query: Joi.object().keys({
		id: Joi.number()
			.integer()
			.positive(),
	}),
});

const updateAssetValidator = celebrate({
	body: Joi.object().keys({
		id: Joi.string()
			.max(64)
			.required(),
		name: Joi.string()
			.max(64),
		make: Joi.string()
			.max(64),
		model: Joi.string()
			.max(64),
		serialNumber: Joi.string()
			.max(64),
		productionDate: Joi.string()
			.max(64),
		ShopName: Joi.string()
			.max(64),
		ShopAddress: Joi.string()
			.max(200),
		ShopLocation: Joi.string()
			.max(64),
		extraData: Joi.object(),
	})
});

// All of these are middleware (a.k.a. functions)
module.exports = {
	addAssetValidator,
	getAssetValidator,
	getAssetHistoryValidator,
	updateAssetValidator,
};