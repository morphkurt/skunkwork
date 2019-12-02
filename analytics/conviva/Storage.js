/*! (C) 2016 Conviva, Inc. All rights reserved. Confidential and proprietary. */
/*! This is sample code meant to illustrate proper Conviva integration in video applications. */
/*! This file is intended to demonstrate HTML5 video player integration targeted at desktop browsers. */
/*! It is not recommended for integrators to copy the contents. */

// Implements Conviva.StorageInterface for Chrome.

// HTML5 localStorage relies on a single key to index items,
// so we find a consistent way to combine storageSpace and storageKey.

function Storage () {

    function _constr() {
        // nothing to initialize
    }

    _constr.apply(this, arguments);

    this.saveData = function (storageSpace, storageKey, data, callback) {
        var localStorageKey = storageSpace + "." + storageKey;
        try {
            localStorage.setItem(localStorageKey, data);
            callback(true, null);
        } catch (e) {
            callback(false, e.toString());
        }
    };

    this.loadData = function (storageSpace, storageKey, callback) {
        var localStorageKey = storageSpace + "." + storageKey;
        try {
            var data = localStorage.getItem(localStorageKey);
            callback(true, data);
        } catch (e) {
            callback(false, e.toString());
        }
    };

    this.release = function() {
        // nothing to release
    };

}
