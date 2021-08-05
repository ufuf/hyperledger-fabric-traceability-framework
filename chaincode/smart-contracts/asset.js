'use strict';

/**
 * Possible asset states
 */
const state = {
    INITIAL: 'INITIAL',
    INFULLFILLMENT: 'IN FULLFILLMENT CENTER',
    INSHOP: 'IN SHOP',
    FINAL: 'SOLD TO CUSTOMER',
};

/**
 * Asset class extends State class
 */
class Asset {

    constructor(assetKey, assetInfo) {
        this.contractNamespace = 'traceabilitysc.asset';
        this.key = assetKey;
        this.currentState = null;
        Object.assign(this, assetInfo);
    }

    /**
     * Getters and setters
    */
    getAsset() {
        return this;
    }

    setAsset(newData) {
        Object.assign(this, newData);
    }

    getStatus() {
        return this.currentState;
    }

    static getContractNamespace() {
        return 'traceabilitysc.asset';
    }

    /**
     * Methods to encapsulate asset state changes
     * And query about a specific status
     */

    setInitial() {
        this.currentState = state.INITIAL;
    }

    isInitial() {
        return this.currentState === state.INITIAL;
    }

    setINFULLFILLMENT() {
        this.currentState = state.INFULLFILLMENT;
    }

    isINFULLFILLMENT() {
        return this.currentState === state.INFULLFILLMENT;
    }

    setINSHOP() {
        this.currentState = state.INSHOP;
    }

    isINSHOP() {
        return this.currentState === state.INSHOP;
    }

    setFINAL() {
        this.currentState = state.FINAL;
    }

    isFINAL() {
        return this.currentState === state.FINAL;
    }
}

module.exports = Asset;
