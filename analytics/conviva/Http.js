/*! (C) 2016 Conviva, Inc. All rights reserved. Confidential and proprietary. */
/*! This is sample code meant to illustrate proper Conviva integration in video applications. */
/*! This file is intended to demonstrate HTML5 video player integration targeted at desktop browsers. */
/*! It is not recommended for integrators to copy the contents. */

// Implements Conviva.HttpInterface for Chrome.

function Http () {

    function _constr() {
        // nothing to initialize
    }

    _constr.apply(this, arguments);

    this.makeRequest = function (httpMethod, url, data, contentType, timeoutMs, callback) {
    	// XDomainRequest only exists in IE, and is IE8-IE9's way of making CORS requests.
    	// It is present in IE10 but won't work right.
    	// if (typeof XDomainRequest !== "undefined" && navigator.userAgent.indexOf('MSIE 10') === -1) {
    	// 	return this.makeRequestIE89.apply(this, arguments);
    	// }
		return this.makeRequestStandard.apply(this, arguments);
    };

    this.makeRequestStandard = function (httpMethod, url, data, contentType, timeoutMs, callback) {
	    var xmlHttpReq = new XMLHttpRequest();

	    xmlHttpReq.open(httpMethod, url, true);

        if (contentType && xmlHttpReq.overrideMimeType) {
            xmlHttpReq.overrideMimeType = contentType;
        }
	    if (contentType && xmlHttpReq.setRequestHeader) {
	        xmlHttpReq.setRequestHeader('Content-Type',  contentType);
	    }
	    if (timeoutMs > 0) {
	        xmlHttpReq.timeout = timeoutMs;
	        xmlHttpReq.ontimeout = function () {
	            // Often this callback will be called after onreadystatechange.
	            // The first callback called will cleanup the other to prevent duplicate responses.
	            xmlHttpReq.ontimeout = xmlHttpReq.onreadystatechange = null;
	            if (callback) callback(false, "timeout after " + timeoutMs + " ms");
	        };
	    }

	    xmlHttpReq.onreadystatechange = function () {
	        if (xmlHttpReq.readyState === 4) {
		        xmlHttpReq.ontimeout = xmlHttpReq.onreadystatechange = null;
		        if (xmlHttpReq.status == 200) {
	           		if (callback) callback(true, xmlHttpReq.responseText);
		        } else {
	            	if (callback) callback(false, "http status " + xmlHttpReq.status);
		        }
		    }
	    };

	    xmlHttpReq.send(data);

	    return null; // no way to cancel the request
    };

  //   this.makeRequestIE89 = function (httpMethod, url, data, contentType, timeoutMs, callback) {
	 //    // IE8-9 does not allow changing the contentType on CORS requests.
	 //    // IE8-9 does not like mixed intranet/extranet CORS requests.
	 //    // IE8-9 does not like mixed HTTPS-in-HTTP-page / HTTP-in-HTTPS-page CORS requests.

	 //    var xmlHttpReq = new XDomainRequest();

	 //    xmlHttpReq.open(httpMethod, url, true); // async=true

	 //    if (timeoutMs != null) {
	 //        xmlHttpReq.timeout = timeoutMs;
	 //        xmlHttpReq.ontimeout = function () {
	 //            xmlHttpReq.onload = xmlHttpReq.onerror = null;
	 //            if (callback) callback(false, "timeout after "+timeoutMs+" ms");
	 //        };
	 //    }

		// // onreadystatechange won't trigger for XDomainRequest.
	 //    xmlHttpReq.onload = function () {
	 //    	xmlHttpReq.ontimeout = null;
	 //    	if (callback) callback(true, xmlHttpReq.responseText);
	 //    };
	 //    xmlHttpReq.onerror = function () {
	 //    	xmlHttpReq.ontimeout = null;
	 //    	if (callback) callback(false, "http status " + xmlHttpReq.status);
	 //    };

	 //    xmlHttpReq.send(data);

	 //    return null; // no way to cancel the request
  //   };

    this.release = function() {
        // nothing to release
    };

}
