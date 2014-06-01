MemeStream for SoundCloud
=========================

MemeStream is a nifty little proof of concept that takes the randomness, lolz and unifying power of the meme and fuses it with your SoundCloud sounds. Bust it out at parties and demonstrations when you want to add a little bit of visual oomph to your sounds.


Design
------

To start, I threw together some sketches to get my thinking started.


Inner Workings
--------------

* [SoundCloud API](http://developers.soundcloud.com/) - The king of the throne. Handles user authentication, 
* [Imgur API](https://api.imgur.com/) - Used to source our meme images displayed in the visualisation area.
* [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) - The busy little worker that churns along in the background bringing everything together. Takes our audio data from the currently selected SoundCloud track and churns the numbers to drive our visualisations.
* [UIKit](http://www.getuikit.com) - Our frontend framework. A nice alternative to Bootstrap and Foundation that I've been meaning to try out for a little while now. First impressions... so far so good.

Notes
-----

All of the build stuff included is probably overkill for a small proof of concept like this, but I feel it's a decent enough way to show off some knowledge.