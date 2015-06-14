// ##############  SERVER CODE  #############

app.use(express.static('dist'));

app.get('/sound/:soundlevel', function (req, res){
    var soundlevel = parseInt(req.params.soundlevel, 10);
    if(typeof soundlevel === 'number'){
        io.emit('soundlevel-update', soundlevel);
        res.send('Soundlevel UPDATED ');

    }else{
        res.send('Error getting soundlevel "' + req.params.soundlevel + '"');
    }
});

var express = require('express'),
    app = express();

var server = app.listen(4000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

var io = require('socket.io').listen(server);

//############## EDISON CODE 
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
        var soundlevel = mappedThresh.toFixed(1);

        console.log("Threshold is " + thresh);
        myLcd.setCursor(0,0);
        myLcd.write("Noise");
        myLcd.setColor(color.r, color.g, color.b);
        myLcd.setCursor(1,2);
        myLcd.write(soundlevel .toString());

        //SEND THE SOUNDLEVEL TO THE CLIENTS
        io.emit('soundlevel-update', soundlevel);

    }
    setTimeout(periodicActivity, 200);
}

console.log('start');
periodicActivity();

