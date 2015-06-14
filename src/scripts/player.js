(function($, window, undefined) {
	console.log('hello');
	var started = false;
	var triggerMoods,
		getSong,
		songData = {
			happy: 'Pharrel Williams - Happy',
			relaxed: 'Christopher Ferreira - Goodnight Moon',
			intense: 'AC-DC - Highway to Hell'
		},
		query = 'http://developer.echonest.com/api/v4/song/search?api_key=7PGUFNFZGMNEOS65Z&mood=',
		songUri = 'http://developer.echonest.com/api/v4/track/profile?api_key=7PGUFNFZGMNEOS65Z&format=json&id=';
	
	triggerMoods = function(event){
		var trigger = $(event.currentTarget),
			oldMood = $('#current-mood').html().toLowerCase(),
			newMood = trigger.html().toLowerCase();


		// change visuals of mood 
		$('#current-mood').html(newMood);
		trigger.html(oldMood).attr('data-mood',oldMood);
		$('#cover').removeClass(oldMood).addClass(newMood);

		// get new songs for new mood
		// $.get(query+newMood, function( data ) {
		// 	songData[newMood] = data.response.songs;
		// 	var firstHit = data.response.songs[0],
		// 		artist = firstHit.artist_name,
		// 		title = firstHit.title;
		// 		newSong = artist + ' - ' + title,
		// 		songId = firstHit.id;

		// 		console.log(firstHit);
			
		// 	$('#song-name').html(newSong);

			

		// 	// getSong(newMood, songId, 0);
		// });

		$('#real_player').attr('src', '/songs/'+newMood+'.mp3').attr('autoplay', true);
		$('#song-name').html(songData[newMood]);
		$('title').html(songData[newMood]);
		// console.log('trigger', newMood, oldMood);
	}

	getSong = function(mood, songId, i) {
		$.get(songUri + songId + '&bucket=audio_summary', function(data){
			console.log(data);
			if(data.response.track[0] && data.response.track[0].hasOwnProperty('preview_url')) {
				songData[mood][i].preview = data.response.track[0].preview_url;
				console.log(i, songData[mood][i].preview_url);
			} else {
				i++;
				if(songData[mood][i]) {
					setTimeout(function(){
						getSong(mood, songData[mood][i].id, i);
						return;
					}, 3500);
				} else {
					console.log('no song found');
				}
			}
		})
	} 

	$('#trigger-one, #trigger-two').click(triggerMoods);

	$('#pause').click(function(e){
		started = true;

		$('audio')[0].pause();
	});

	$('#play').click(function(e){
		$('audio')[0].play();
	});


	/*
       	SOCKET IO CODE.
	*/
    var socket = io();
    socket.on('soundlevel-update', function(level){
    	if(!started){
    		return;
    	}

          var soundlevel = parseInt(level);
          console.log('SOUND LEVEL: ', soundlevel);
          if (soundlevel < 30 ) {
          	$('[data-mood="relaxed"').trigger('click');
          } else if (soundlevel < 60) {
          	$('[data-mood="happy"').trigger('click');
          } else {
          	$('[data-mood="intense"').trigger('click');
          }

    });

// http://play.spotify.com/song=songId
}(jQuery, window));