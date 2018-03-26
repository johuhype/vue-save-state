'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _lodash = require('lodash');

var _localStorage = require('./local-storage');

exports.default = {
    watch: {
        '$data': {
            handler: function handler() {
                this.saveState();
            },

            deep: true
        }
    },

    created: function created() {
        this.loadState();
    },


    methods: {
        loadState: function loadState() {
            var _this = this;
			if (!this.getSaveStateConfig) return;

            var savedState = (0, _localStorage.getSavedState)(this.getSaveStateConfig().cacheKey);

            if (!savedState) {
                return;
            }

            (0, _lodash.forEach)(savedState, function (value, key) {

                if (_this.attributeIsManagedBySaveState(key)) {
                    if (_this.getSaveStateConfig().onLoad) {
                        value = _this.getSaveStateConfig().onLoad(key, value);
                    }

                    _this.$data[key] = value;
                }
            });
        },
        saveState: function saveState() {
            var _this2 = this;
			if (!this.getSaveStateConfig) return;

            var data = (0, _lodash.pickBy)(this.$data, function (value, attribute) {
                return _this2.attributeIsManagedBySaveState(attribute);
            });

            (0, _localStorage.saveState)(this.getSaveStateConfig().cacheKey, data);
        },
        attributeIsManagedBySaveState: function attributeIsManagedBySaveState(attribute) {
            if (this.getSaveStateConfig().ignoreProperties && this.getSaveStateConfig().ignoreProperties.indexOf(attribute) !== -1) {

                return false;
            }

            if (!this.getSaveStateConfig().saveProperties) {
                return true;
            }

            return this.getSaveStateConfig().saveProperties.indexOf(attribute) !== -1;
        },
        clearSavedState: function clearSavedState() {
            (0, _localStorage.clearSavedState)(this.getSaveStateConfig().cacheKey);
        }
    }
};
