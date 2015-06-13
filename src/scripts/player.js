(function($, window, undefined) {
	console.log('hello');

	var happyQuery = 'http://developer.echonest.com/api/v4/song/search?api_key=7PGUFNFZGMNEOS65Z&mood=happy';
	
	// Limit is 20 requests per minute so use wisely!!
	// Or you can set up own free api keys here: http://developer.echonest.com

	// $.get(happyQuery, function( data ) {
	// 	console.log(data);
	// 	var newSong = data.response.songs[0].artist_name + ' - ' + data.response.songs[0].title;
	// 	console.log(newSong);
	// 	$('#song-name').html(newSong);
	// });
}(jQuery, window));