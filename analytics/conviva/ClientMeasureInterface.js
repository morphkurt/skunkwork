/*! (C) 2016 Conviva, Inc. All rights reserved. Confidential and proprietary. */
/*! This is sample code meant to illustrate proper Conviva integration in video applications. */
/*! This file should not be included in video applications as part of integrating Conviva. */

//Interface to report pht, buffer length, signal strength & rendered framerate metrics.
var ClientMeasureInterface = function() {
     this.getPHT = function() {
         return /** Integer */;
//Play Head Time in milli seconds or -1 if not available
     };    
     this.getBufferLength = function() {
         return /** Integer */;
 // Buffer Length in milli seconds or -1 if not available
     };    
     this.getSignalStrength = function() {
         return /** Integer */; // Signal Strength in dBm or 1000 if not available
     };    
     this.getRenderedFrameRate = function() {
         return /** Integer */;
 // Rendered Framerate of video or -1 if not available
     };
}
