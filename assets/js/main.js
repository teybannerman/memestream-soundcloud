(function() {

  $(function() {

    var SOUNDCLOUD_ID, USER_ID, IMGUR_KEY;
    var cWidth, cHeight;
    var player = document.getElementById('player');
    var img1 = new Image;

    window.audioSource = new SoundCloudAudioSource(player);
    window.canvasElement = document.getElementById('canvas');
    window.context = canvasElement.getContext("2d");

    SOUNDCLOUD_ID = "ddd1a518196f22519fc5ca02ca4a4fc7";
    IMGUR_KEY = "d93eaa3187ee692";

    SC.initialize({
      client_id: SOUNDCLOUD_ID,
      redirect_uri: "http://localhost:4000/callback.html"
    });

    // handle signin
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

    // When a playlist item is clicked, load the track and play it
    $('a.sound').live('click', function() {
      var $this = ($(this));
      loadTrack($this.data('uri'));
      return false;
    });

    // resize our canvas element so that it behavess responsively and always fits the window
    $(window).on('load resize', function() {
      cWidth = $(window).width();
      cHeight = $(window).height();
      canvasElement.setAttribute('width', cWidth);
      canvasElement.setAttribute('height', cHeight);
    });

    // load our SoundCloud sound, process its waveform for the playback area, and connect it 
    // to our WebAudio object
    var loadTrack = function(uri) {
      SC.get(uri, function(track){

        // load waveform
        $('#waveform').empty();
        var waveform = new Waveform({
          container: document.getElementById("waveform"),
          innerColor: "#333"
        });

        waveform.dataFromSoundCloudTrack(track);
        var streamOptions = waveform.optionsForSyncedStream();

        audioSource.defaultOptions = streamOptions;
        audioSource.playStream(uri+'/stream?client_id=' + SOUNDCLOUD_ID);
        draw();

        /*SC.stream(track.uri, streamOptions, function(stream){
          window.nowPlaying = stream;
          //togglePause();
        });*/
      });

      $('.panel-selector').hide(500);
      $('#vis').show(500);
    }

    // get our set of meme images from imgur and store them in an array for later use
    var getImages = function(key) {
      $.ajax({
        url: 'https://api.imgur.com/3/gallery/g/memes',
        type: 'GET',
        headers: {
          Authorization: 'Client-ID ' + key,
        },
        dataType: 'json'
      }).success(function(data) {
        console.log(data);
        img1.addEventListener('load', function () {
          context.drawImage(this, 0, 0, cWidth, cHeight);
        });
        var randomInt = randomIntFromInterval(0, data.data.length)
        img1.src = data.data[randomInt].link;
      }).error(function() {
        alert('Could not reach api.imgur.com. Sorry :(');
      });
    }

    var getTracks = function(uid) {
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
              $('.tracks').append('<li><a class="sound" href="#'+track.uri+'" data-uri="'+track.uri+'"><span>'+track.title+'</span><img src="'+track.waveform_url+'"/></a></li>')
            }
          }
          else {
            $('.tracks').append('<p>You have no sounds</p>')
          }
        }
      });
    }

    var draw = function() {

      for(bin = 0; bin < audioSource.streamData.length; bin ++) {
        // do something with each value. Here's a simple example
        /*var val = audioSource.streamData[bin];
        var red = val;
        var green = 255 - val;
        var blue = val / 2; 
        context.fillStyle = 'rgb(' + red + ', ' + green + ', ' + blue + ')';
        context.fillRect(bin * 2, 0, 2, 200);*/
        // use lines and shapes to draw to the canvas is various ways. Use your imagination!
      }
      
      var scale = (Math.log(audioSource.volume) + 0.5) / 10;

      // Save the current context
      context.save();
      // Translate to the center point of our image
      context.translate((canvas.width / 2), (canvas.height / 2));
      // Scale our view area
      context.scale(scale, scale);
      // Translate back to the top left of our image
      context.translate(-img1.width * 0.5, -img1.height * 0.5);
      // Redraw the image
      context.drawImage(img1, 0, 0);
      // Restore the context ready for the next loop
      context.restore();

      requestAnimationFrame(draw);
    };

  });
}).call(this);


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


/**
* Return a random integer between two values
*/
function randomIntFromInterval(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}


