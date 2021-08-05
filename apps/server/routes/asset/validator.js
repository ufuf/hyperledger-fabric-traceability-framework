const { celebrate, Joi } = require('celebrate');

const addAssetValidator = celebrate({
	body: Joi.object().keys({ // The req.body object must be populated prior to the validation
		id: Joi.string()
			.max(64)
			.required(),
		name: Joi.string()
			.max(64)
			.required(),
		data: Joi.object()
			.required(),
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

const updateAssetValidator = celebrate({
	body: Joi.object().keys({
		id: Joi.string()
			.max(64)
			.required(),
		name: Joi.string()
			.max(64),
		data: Joi.object(),
	})
});

// const setIntermediateStateValidator = celebrate({
//   body: Joi.object().keys({ // The req.body object must be populated prior to the validation

// 	})
// });


// All of these are middleware (a.k.a. functions)
module.exports = {
	addAssetValidator,
	getAssetValidator,
	updateAssetValidator,
};