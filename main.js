/*jslint node:true, vars:true, bitwise:true, unparam:true */
/*jshint unused:true */

var colorUtils = require('./colorUtils');
var mathUtils = require('./mathUtils');

var mraa = require('mraa');
console.log('MRAA Version: ' + mraa.getVersion());

var LCD = require ('jsupm_i2clcd');
var myLcd = new LCD.Jhd1313m1 (0, 0x3E, 0x62);

myLcd.setCursor(0,0);

var upmMicrophone = require("jsupm_mic");

// Attach microphone to analog port A0
var myMic = new upmMicrophone.Microphone(0);

var threshContext = new upmMicrophone.thresholdContext;
threshContext.averageReading = 0;
threshContext.runningAverage = 0;
threshContext.averagedOver = 2;


function periodicActivity()
{
    var buffer = new upmMicrophone.uint16Array(128);
    var len;
    while (!len) {
        len = myMic.getSampledWindow(2, 128, buffer);
    }
    var thresh = myMic.findThreshold(threshContext, 30, buffer, len);
    myMic.printGraph(threshContext);
    if (thresh) {
        //if we need it
        var mappedThresh = mathUtils.map(thresh, 0, 600, 0, 100);
        
        var mapColors = Math.abs(mathUtils.map(thresh, 0, 600, 100, 0));
        var color = colorUtils.hsvToRgb( mapColors * 0.004, 1, .5);

        console.log("Threshold is " + thresh);
        myLcd.setCursor(0,0);
        myLcd.write("Noise");
        myLcd.setColor(color.r, color.g, color.b);
        myLcd.setCursor(1,2);
        myLcd.write(mappedThresh.toFixed(1).toString());
    }
    setTimeout(periodicActivity, 200);
}

console.log('start');
periodicActivity();


