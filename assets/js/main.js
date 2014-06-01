(function() {

  $(function() {

    var SOUNDCLOUD_ID, USER_ID, IMGUR_KEY;
    SOUNDCLOUD_ID = "ddd1a518196f22519fc5ca02ca4a4fc7";
    IMGUR_KEY = "d93eaa3187ee692";

    SC.initialize({
      client_id: SOUNDCLOUD_ID,
      redirect_uri: "http://localhost:4000/callback.html"
    });

    $('.signin').click(function() {
      SC.connect(function(){
        SC.get("/me", function(user, error){
          if(error){
            alert("Error: " + error.message);
          }else{
            USER_ID = user.id;
            $('.panel-selector h1').append(user.username);
            $('.panel').hide(500);
            getTracks(USER_ID);
            getImages(IMGUR_KEY);
          }
        });
      });
    });

    $('a.sound').live('click', function() {
      var $this = ($(this));
      loadTrack($this.data('uri'));
      return false;
    });

  });
}).call(this);


function getTracks(uid) {
  SC.get("/me/tracks", function(tracks, error){
    if(error){
      alert("Error: " + error.message);
    }else{
      $('.panel-selector').show(500);
      $('.app-nav').show(500);
      if (tracks.length > 0) {
        console.log(tracks);
        for (var i=0, len=tracks.length; i<len; ++i) {
          var track = tracks[i];
          $('.tracks').append('<li><a class="sound" href="#'+track.uri+'" data-uri="'+track.uri+'">'+track.title+'</a></li>')
        }
      }
      else {
        $('.tracks').append('<p>You have no sounds</p>')
      }
    }
  });
}

function getImages(key, cat) {
  $.ajax({
    url: 'https://api.imgur.com/3/gallery/g/memes',
    type: 'GET',
    headers: {
      Authorization: 'Client-ID ' + key,
    },
    dataType: 'json'
  }).success(function(data) {
    console.log(data);
  }).error(function() {
    alert('Could not reach api.imgur.com. Sorry :(');
  });
}

function loadTrack(uri) {

  SC.get(uri, function(track){

    // load waveform
    var waveform = new Waveform({
      container: document.getElementById("waveform"),
      innerColor: "#333"
    });

    waveform.dataFromSoundCloudTrack(track);
    var streamOptions = waveform.optionsForSyncedStream();
    SC.stream(track.uri, streamOptions, function(stream){
      window.nowPlaying = stream;
      togglePause();
    });
  });
}

function togglePause() {
  window.nowPlaying.togglePause();
}


/*var audioSource = new SoundCloudAudioSource('player');
var canvasElement = document.getElementById('canvas');
var context = canvasElement.getContext("2d");

var draw = function() {
    // you can then access all the frequency and volume data
    // and use it to draw whatever you like on your canvas
    for(bin = 0; bin < audioSource.streamData.length; bin ++) {
        // do something with each value. Here's a simple example
        var val = audioSource.streamData[bin];
        var red = val;
        var green = 255 - val;
        var blue = val / 2; 
        context.fillStyle = 'rgb(' + red + ', ' + green + ', ' + blue + ')';
        context.fillRect(bin * 2, 0, 2, 200);
        // use lines and shapes to draw to the canvas is various ways. Use your imagination!
    }
    requestAnimationFrame(draw);
};

audioSource.playStream('url_to_soundcloud_stream');
draw();*/


// SoundCloudAudioSource functions courtesy of
// http://www.michaelbromley.co.uk/blog/42/audio-visualization-with-web-audio-canvas-and-the-soundcloud-api
/**
 * The *AudioSource object creates an analyzer node, sets up a repeating function with setInterval
 * which samples the input and turns it into an FFT array. The object has two properties:
 * streamData - this is the Uint8Array containing the FFT data
 * volume - cumulative value of all the bins of the streaData.
 *
 */

var SoundCloudAudioSource = function(player) {
    var self = this;
    var analyser;
    var audioCtx = new (window.AudioContext || window.webkitAudioContext);
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    var source = audioCtx.createMediaElementSource(player);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
    var sampleAudioStream = function() {
        analyser.getByteFrequencyData(self.streamData);
        // calculate an overall volume value
        var total = 0;
        for (var i = 0; i < 80; i++) { // get the volume from the first 80 bins, else it gets too loud with treble
            total += self.streamData[i];
        }
        self.volume = total;
    };
    setInterval(sampleAudioStream, 20);
    // public properties and methods
    this.volume = 0;
    this.streamData = new Uint8Array(128);
    this.playStream = function(streamUrl) {
        // get the input stream from the audio element
        player.addEventListener('ended', function(){
            self.directStream('coasting');
        });
        player.setAttribute('src', streamUrl);
        player.play();
    }
};