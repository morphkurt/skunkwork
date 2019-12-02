/*! (C) 2016 Conviva, Inc. All rights reserved. Confidential and proprietary. */
/*! This is sample code meant to illustrate proper Conviva integration in video applications. */
/*! This file is intended to demonstrate HTML5 video player integration targeted at desktop browsers. */
/*! It is not recommended for integrators to copy the contents. */

// Implements Conviva.MetadataInterface for Chrome.

// The Conviva Platform will recognize HTTP user agent strings for major browsers,
// and use these to fill in some of the missing metadata.
// You can validate the resulting metadata through our validation tools.
// If you wish you can maintain your own user agent string parsing on the client side
// instead, and use it to supply the requested Conviva data.

function Metadata () {

    function _constr() {
        // nothing to initialize
    }

    _constr.apply(this, arguments);

    // Relying on HTTP user agent string parsing on the Conviva Platform.
    this.getBrowserName = function () {
        return null;
    };

    // Relying on HTTP user agent string parsing on the Conviva Platform.
    this.getBrowserVersion = function () {
        return null;
    };

    // Relying on HTTP user agent string parsing on the Conviva Platform.
    this.getDeviceBrand = function () {
        return null;
    };

    // Relying on HTTP user agent string parsing on the Conviva Platform.
    this.getDeviceManufacturer = function () {
        return null;
    };

    // Relying on HTTP user agent string parsing on the Conviva Platform.
    this.getDeviceModel = function () {
        return null;
    };

    // Relying on HTTP user agent string parsing on the Conviva Platform.
    this.getDeviceType = function () {
        return Conviva.Client.DeviceType.DESKTOP;
    };

    // There is no value we can access that qualifies as the device version.
    this.getDeviceVersion = function () {
        return null;
    };

    // HTML5 can qualify as an application framework of sorts.
    this.getFrameworkName = function () {
        return "HTML5";
    };

    // No convenient way to detect HTML5 version.
    this.getFrameworkVersion = function () {
        return null;
    };

    // Relying on HTTP user agent string parsing on the Conviva Platform.
    this.getOperatingSystemName = function () {
        return null;
    };

    // Relying on HTTP user agent string parsing on the Conviva Platform.
    this.getOperatingSystemVersion = function () {
        return null;
    };

    // Relying on HTTP user agent string parsing on the Conviva Platform.
    this.getDeviceCategory = function () {
        return Conviva.Client.DeviceCategory.WEB;
    };

    this.release = function() {
        // nothing to release
    };

}
