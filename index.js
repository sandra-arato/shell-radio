var express = require('express'),
	app = express();

app.use(express.static('dist'));


var server = app.listen(4000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

var io = require('socket.io').listen(server);
console.log(io);
app.get('/sound/:soundlevel', function (req, res){
	var soundlevel = parseInt(req.params.soundlevel, 10);
	if(typeof soundlevel === 'number'){
		io.emit('soundlevel-update', soundlevel);
		res.send('Soundlevel UPDATED ');

	}else{
		res.send('Error getting soundlevel "' + req.params.soundlevel + '"');
	}
});

