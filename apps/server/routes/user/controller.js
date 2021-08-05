const UsersService = require('./service');
const usersService = new UsersService();

class UsersController {

	async addUser(req, res, next) {
		const userInfo = {
			createdAt: new Date(),
			id: req.body.id,
			password: req.body.password,
			name: req.body.name,
		};
		let result = null;
		try {
			result = await usersService.addUser(userInfo);
		} catch (e) {
			next(e);
			return null; // Execution continues after the next() call finishes, so we have to 'return' here to avoid sending a response to clients twice
		}
		res.status(200).json(result);
	}

	async authenticateUser(req, res, next) {
		const userCredentials = {
			id: req.body.id,
			password: req.body.password,
		};
		let jwt = null;
		try {
			jwt = await usersService.authenticateUser(userCredentials);
		} catch (e) {
			next(e);
			return null;
		}
		res.status(200).json(jwt);
	}

	async getUser(req, res, next) {
		const query = {
			selector: {
				contractNamespace: 'traceabilitysc.user',
				id: req.user.id,
			}
		};
		let result = null;
		try {
			result = await usersService.getUser(query);
		} catch (e) {
			next(e);
			return null;
		}
		res.status(200).json(result);
	}

	async updateUser(req, res, next) {
		const updatedUserInfo = req.body;
		updatedUserInfo.id = req.user.id;
		let result = null;
		try {
			result = await usersService.updateUser(updatedUserInfo);
		} catch (e) {
			next(e);
			return null;
		}
		res.status(200).json(result);
	}

	async setActiveState(req, res, next) {
		const userInfo = req.user;

		let result = null;
		try {
			result = await usersService.setActiveState(userInfo);
		} catch (e) {
			next(e);
			return null; // Execution continues after the next() call finishes, so we have to 'return' here to avoid sending a response to clients twice
		}
		res.status(200).json(result);
	}

	async setInActiveState(req, res, next) {
		const userInfo = req.user;

		let result = null;
		try {
			result = await usersService.setInActiveState(userInfo);
		} catch (e) {
			next(e);
			return null; // Execution continues after the next() call finishes, so we have to 'return' here to avoid sending a response to clients twice
		}
		res.status(200).json(result);
	}
}

module.exports = UsersController;