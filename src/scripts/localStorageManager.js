window.fakeStorage = {
    _data: {},

    setItem(id, val) {
        return this._data[id] = String(val);
    },

    getItem(id) {
        return this._data.hasOwnProperty(id) ? this._data[id] : undefined;
    },

    removeItem(id) {
        return delete this._data[id];
    },

    clear() {
        return this._data = {};
    }
};

class LocalStorageManager {
    constructor() {
        const localSupported = !!window.localStorage;

        this.key = "bestScore";
        this.storage = localSupported ? window.localStorage : window.fakeStorage;
    }

    get() {
        return this.storage.getItem(this.key) || 0;
    }

    set(score) {
        this.storage.setItem(this.key, score);
    }
}
