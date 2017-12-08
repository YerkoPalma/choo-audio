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
  emitter.on('audio:load-complete', function () {
    emitter.emit('audio:play')
  })
}
```

## How it works?

The whole plugin is based on the web-audio-graph module. It basically dynamically 
build a graph representing different sources to be played by the user. 
To start, a track is defined as a simple graph with two nodes.

```text
bufferSource > filter > gain > contextDestination
```

there are some ways to manipulate this graph, more on that later. 
This basic, opinionated graph is built when you call the `load` event. If you add 
other source it is another branch of the graph connected to the same destination.
So, for instance, if you call load again you will have something like

```text
bufferSource > filter > gain >---+ 
                                 |
                                contextDestination
                                 |
bufferSource > filter > gain >---+
```

Keep in mind that buffer sources are internally stored into an array, and there 
is always a _current track_. If you add nodes, they will be added to the current 
track. If you add a user input source, it will not be stored in the same playlist, 
so it will never be the current track.

## Events
### `audio:load`
Emit this to load an audio source. You can pass an url (string) or directly pass 
the [AudioBuffer][AudioBuffer] instance. Also you can pass an array of strings 
or AudioBuffer, if this is the case, when you trigger the `play` event, all of 
the source will play together, use this if you want to build atmospheric sounds or 
to mix many audio files into one, later with the `record` events.

### `audio:load-complete`
### `audio:get-user-input`

### `audio:play`
Emit this to play the current audio track. If the current track has more than 
one source, all of them will be played. If already playing it will not do anything. 
Also notice that if the current track were paused, it will restart from the minute 
it were paused. Can optionally get two parameters `time` a float to specify the 
time from which to start playing, defaults to 0, and `loop` a boolean to set if 
the track should play again, defaults to true.

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

### `audio:record-complete`

### `audio:stop-recording`
Stop a recording started with `start-recording` event. Get a callback as the 
parameter. The callback will get a Blob object with audio data.

### `audio:pause`
Pause the current track,   if the `play` event is trggered after, it will start 
playing from where it got paused.

### `audio:next`
### `audio:prev`

### `audio:stop`
Stop the current track being played and reset the list to the first track.

### `audio:set`
Set the properties of the [BiquadFilterNode][BiquadFilterNode] of the audio graph.

### `audio:add-node`
Set the properties of the [BiquadFilterNode][BiquadFilterNode] of the audio graph.

### `audio:add-signal`
### `audio:play-signal`
### `audio:stop-signal`

## API
### var audio = require('choo-audio')
### var store = audio([opts])

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
[web-audio-graph]: https://github.com/YerkoPalma/web-audio-graph