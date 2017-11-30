# choo-audio [![stability][0]][1]
[![npm version][2]][3] [![build status][4]][5]
[![downloads][8]][9] [![js-standard-style][10]][11]

Opinionated abstraction around web audio api for choo framework

## Usage

```js
var choo = require('choo')
var html = require('choo/html')

var app = choo()
app.use(require('choo-audio')())
app.route('/', mainView)
app.mount('body')

function mainView (state, emit) {
  return html`
    <body>
    </body>
  `
}
function sounds (state, emitter, app) {
  emitter.emit('audio:load', 'some/sound.wav')
  emitter.emit('audio:play')

  // emitter.emit('audio:pause')
  // emitter.emit('audio:stop')
}
```

## Events
### `audio:load`
Emit this to load an audio source. You can pass an url (string) or directly pass 
the [AudioBuffer][AudioBuffer] instance. _Also you can pass an array of strings 
or AudioBuffer, if this is the case, when you trigger the `play` event, all of 
the source will play together, use this if you want to build atmospheric sounds or 
to mix many audio files into one, later with the `record` events._

### `audio:play`
Emit this to play the current audio track. If the current track has more than 
one source, all of them will be played. If already playing it will not do anything. 
Also notice that if the current track were paused, it will restart from the minute 
it were paused. Can optionally get two parameters `time` a float to specify the 
time from which to start playing, defaults to 0, and `loop` a boolean to set if 
the track should play again, defaults to true.

### `audio:load-and-play`
Emit this to load an audio source and play it inmediatly. Works almost identically 
to the load event, with the difference that you can pass arrays, and the played 
track will not be saved to play again.

### `audio:play-all`
Emit this to play all the tracks loaded.

### `audio:remove`
Emit this to remove a track from the playlist.

### `audio:remove-all`
Clear the whole playlist.

### `audio:start-recording`
Start recording with a MediaRecorder object. Get a single boolean argument to say 
if you want to record from the main source (`true`), or from the user media devices 
(`false`).

### `audio:download`
Download the main source for the current track.

### `audio:stop-recording`
Stop a recording started with `start-recording` event. Get a callback as the 
parameter. The callback will get a Blob object with audio data.

### `audio:pause`
Pause the current track,   if the `play` event is trggered after, it will start 
playing from where it got paused.

### `audio:stop`
Stop the current track being played and reset the list to the first track.

### `audio:set-filter`
Set the properties of the [BiquadFilterNode][BiquadFilterNode] of the audio graph.

### `audio:set-volume`
Set the volume of the audio through the [GainNode][GainNode].

### `audio:mix`
Mix a new source. Get a string or AudioBuffer and will play both sources, you can 
define which one to play louder by passing a float value between -1 and 1 with -1 
being all volume for the main source, and 1 all the volume for the second source.

## API

## License
[MIT](/LICENSE)

[0]: https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square
[1]: https://nodejs.org/api/documentation.html#documentation_stability_index
[2]: https://img.shields.io/npm/v/choo-audio.svg?style=flat-square
[3]: https://npmjs.org/package/choo-audio
[4]: https://img.shields.io/travis/YerkoPalma/choo-audio/master.svg?style=flat-square
[5]: https://travis-ci.org/YerkoPalma/choo-audio
[6]: https://img.shields.io/codecov/c/github/YerkoPalma/choo-audio/master.svg?style=flat-square
[7]: https://codecov.io/github/YerkoPalma/choo-audio
[8]: http://img.shields.io/npm/dm/choo-audio.svg?style=flat-square
[9]: https://npmjs.org/package/choo-audio
[10]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[11]: https://github.com/feross/standard