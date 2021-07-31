'use strict';

/**
 * Possible user states
 */
const state = {
	ACTIVE: 'ACTIVE',
	INACTIVE: 'INACTIVE',
};

/**
 * User class extends State class
 */
class User {

	constructor(userKey, userInfo) {
		this.contractNamespace = 'traceabilitysc.user';
		this.key = userKey;
		this.currentState = null;
		Object.assign(this, userInfo);
	}

	/**
	 * Getters and setters
	*/
	getUser() {
		return this;
	}

	setUser(newData) {
		Object.assign(this, newData);
	}

	getStatus() {
		return this.currentState;
	}

	static getContractNamespace() {
		return 'traceabilitysc.user';
	}

	/**
	 * Methods to encapsulate user state changes
	 * And query about a specific status
	 */

	setActive() {
		this.currentState = state.ACTIVE;
	}

	isActive() {
		return this.currentState === state.ACTIVE;
	}

	setInactive() {
		this.currentState = state.INACTIVE;
	}

	isInactive() {
		return this.currentState === state.INACTIVE;
	}

}

module.exports = User;
