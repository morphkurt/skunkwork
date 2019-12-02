/*! (C) 2016 Conviva, Inc. All rights reserved. Confidential and proprietary. */
/*! This is sample code meant to illustrate proper Conviva integration in video applications. */
/*! This file is intended to demonstrate HTML5 video player integration targeted at desktop browsers. */
/*! It is not recommended for integrators to copy the contents. */

// Implements Conviva.LoggingInterface for Chrome.

function Logging () {

    function _constr () {
        // nothing to initialize
    }

    _constr.apply(this, arguments);

    this.consoleLog = function (message, logLevel) {
        if (typeof console === 'undefined') return;
        if (console.log && logLevel === Conviva.SystemSettings.LogLevel.DEBUG ||
            logLevel === Conviva.SystemSettings.LogLevel.INFO) {
            console.log(message);
        } else if (console.warn && logLevel === Conviva.SystemSettings.LogLevel.WARNING) {
            console.warn(message);
        } else if (console.error && logLevel === Conviva.SystemSettings.LogLevel.ERROR) {
            console.error(message);
        }
    };

    this.release = function () {
        // nothing to release
    };

}
