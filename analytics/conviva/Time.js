/*! (C) 2016 Conviva, Inc. All rights reserved. Confidential and proprietary. */
/*! This is sample code meant to illustrate proper Conviva integration in video applications. */
/*! This file is intended to demonstrate HTML5 video player integration targeted at desktop browsers. */
/*! It is not recommended for integrators to copy the contents. */

// Implements Conviva.TimeInterface for Chrome.

function Time () {

    function _constr() {
        // nothing to initialize
    }

    _constr.apply(this, arguments);

    this.getEpochTimeMs = function () {
        var d = new Date();
        return d.getTime();
    };

    this.release = function() {
        // nothing to release
    };
}
