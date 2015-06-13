(function($, window, undefined) {
	console.log('hello');

	var query = 'http://developer.echonest.com/api/v4/song/search?api_key=7PGUFNFZGMNEOS65Z&mood=happy';

	$.get(query, function( data ) {
		console.log(data);
	});
}(jQuery, window));