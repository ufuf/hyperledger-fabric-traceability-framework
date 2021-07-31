const { celebrate, Joi } = require('celebrate');

const addUserValidator = celebrate({
	body: Joi.object().keys({ // The req.body object must be populated prior to the validation
		id: Joi.string()
			.max(64)
			.required(),
		password: Joi.string()
			.min(8)
			.max(64)
			.required(),
		name: Joi.string()
			.max(64)
			.required(),
	})
});

const authenticateUserValidator = celebrate({
	body: Joi.object().keys({
		id: Joi.string()
			.max(64)
			.required(),
		password: Joi.string()
			.min(8)
			.max(64)
			.required(),
	})
});

const getUserValidator = celebrate({
	query: Joi.object().keys({
		pageSize: Joi.number()
			.integer()
			.positive(),
		bookmark: Joi.string()
			.max(128)
			.allow('', null),
	}),
});

const updateUserValidator = celebrate({
	body: Joi.object().keys({
		password: Joi.string()
			.min(8)
			.max(64)
			.required(),
		name: Joi.string()
			.max(64)
			.required(),
	})
});

// const setIntermediateStateValidator = celebrate({
//   body: Joi.object().keys({ // The req.body object must be populated prior to the validation

// 	})
// });


// All of these are middleware (a.k.a. functions)
module.exports = {
	addUserValidator,
	authenticateUserValidator,
	getUserValidator,
	updateUserValidator,
};