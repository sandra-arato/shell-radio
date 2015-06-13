(function($, window, undefined) {
	console.log('hello');
	var triggerMoods,
		getSong,
		songData = {},
		query = 'http://developer.echonest.com/api/v4/song/search?api_key=7PGUFNFZGMNEOS65Z&mood=',
		songUri = 'http://developer.echonest.com/api/v4/song/search?api_key=7PGUFNFZGMNEOS65Z&format=json&results=1&artist=';
	
	triggerMoods = function(event){
		var trigger = $(event.currentTarget),
			oldMood = $('#current-mood').html().toLowerCase(),
			newMood = trigger.html().toLowerCase();


		// change visuals of mood 
		$('#current-mood').html(newMood);
		trigger.html(oldMood);
		$('#cover').removeClass(oldMood).addClass(newMood);

		// get new songs for new mood
		$.get(query+newMood, function( data ) {
			songData[newMood] = data.response;
			var firstHit = data.response.songs[0],
				artist = firstHit.artist_name,
				title = firstHit.title;
				newSong = artist + ' - ' + title
			
			$('#song-name').html(newSong);

			artist = artist.replace(/ /g, '%20');
			title = title.replace(/ /g, '%20');

			getSong(newMood, artist, title, 0);
		});

		// console.log('trigger', newMood, oldMood);
	}

	getSong = function(mood, artist, title, i) {
		$.get(songUri + artist + '&title=' + title + '&bucket=id:7digital-UK&bucket=audio_summary&bucket=tracks', function(data){
			console.log(data);
			if(data.response.songs[0].tracks[0].hasOwnProperty('preview_url')) {
				console.log(data.response.songs[0].tracks[0].hasOwnProperty('preview_url'))
			} else {
				i++;
				setTimeout(function(){
					songData[mood][i]
				}, 3500);
			}
		})
	}

	$('#trigger-one, #trigger-two').click(triggerMoods);

// http://play.spotify.com/song=songId
}(jQuery, window));