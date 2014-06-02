MemeStream for SoundCloud
=========================

MemeStream is a nifty little proof of concept that takes the randomness, lolz and unifying power of the meme and fuses it with your SoundCloud sounds. Bust it out at parties and demonstrations when you want to add a little bit of visual oomph to your sounds.

[http://memestream-soundcloud.herokuapp.com/](http://memestream-soundcloud.herokuapp.com/)


Planning & Design
------

From the outset I had in mind a simple, intuitive web-based app that offers an entertaining way for a SoundCloud user to visualise their sounds. To start, I scratched out some notes and threw together some sketches to get my thinking started.

![MemeStream planning scratchings 1](http://i.imgur.com/3Rh6ZMe.jpg "Planning notes and rough flow")

![MemeStream planning scratchings 1](http://i.imgur.com/RavRjis.jpg "Sound selection and visualisation notes")

Admittedly the final process involved a lot of unabashed tweaking, self discovery and on-the-fly decision-making after this, but the app in its current state all comes together and flows like so:

1. Users connect to the app via their SoundCloud Account.
2. They're then presented with a listing of their current sounds and can select a track to play.
3. Their selected tune is then played to the backdrop of a shifting, pulsating image gallery visualisation of the day's trending memes (thanks to Imgur's API) that moves in time to the audio being played.


Inner Workings
--------------

MemeStream was designed with a mobile-first mindset, is fully responsive, written entirely in JavaScript/jQuery, CSS3 and HTML5, and makes use of the following APIs and resources:

* [SoundCloud API & JavaScript SDK](http://developers.soundcloud.com/) - The king of the throne. Handles user authentication, and grabbing a user's sounds for playback.
* [Imgur API](https://api.imgur.com/) - Used to source our meme images displayed in the visualisation area.
* [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) - The busy little worker that churns along in the background bringing everything together. Takes our audio data from the currently selected SoundCloud track and churns the numbers to drive our visualisations.
* [UIKit](http://www.getuikit.com) - Our frontend framework. A nice alternative to Bootstrap and Foundation that I've been meaning to try out for a little while now. First impressions... so far so good.
* [Waveform.JS](http://waveformjs.org/) - Currently just used to dump the currently playing sound's waveform into the main navigation area, but will eventually implement audio playing/buffering progress display and scrubbing too.
* [LESS](http://lesscss.org/) - Our CSS preprocessor, with some handy mixins courtesy of [http//www.lesselements.com/](http//www.lesselements.com/) thrown in.
* [HTML5 Canvas]() - Takes care of the drawing of our visualisations and animations.


Future Plans & ToDos
-----

* Implement waveform play progress and scrubbing.
* Playlist integration: Autoplay and 'Next' + 'Previous' controls.
* Build in the ability for users to select any arbitrary public SoundCloud track.
* Add some more "wow" to our visualisations and take advantage of the unbridled power of Canvas.

P.S. All of the build stuff included is probably overkill for a small proof of concept like this, but I had so much fun with this exercise that I just might turn it into a full-fledged baby, plus I feel it's a decent enough way to show off some pertinent knowledge.