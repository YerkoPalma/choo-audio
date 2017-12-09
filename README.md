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

The whole plugin is based on the [web-audio-graph][web-audio-graph] module. 
It basically dynamically build a graph representing different sources to be 
played by the user. To start, a track is defined as a simple graph with two 
nodes.

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
so it will never be the current track, and will be always playing, unless you 
manually disconnect it.

## Events
### `audio:load`
Emit this to load an audio source. You can pass an url (string) or directly pass 
the [AudioBuffer][AudioBuffer] instance.

### `audio:load-complete`
This event will be fired after a load event, when your buffer is complete loaded.

### `audio:get-user-input`
Emit this to ask for user input. When granted, a `user-input` event will be fired.

### `audio:user-input`
Fired when the user accepted to grant audio input. When this happened, the audio 
input will be connected to the context destination, and the mediaStream node from 
the audio graph, will be availaible in the app state through `state.audio.userInput`

### `audio:play`
Emit this to play the current audio track. If already playing it will not do anything. 
Also notice that if the current track were paused, it will restart from the minute 
it were paused. Can optionally get an integer `index` param, used to play a different 
track from the current one.

### `audio:play-all`
Emit this to play all the tracks loaded.

### `audio:remove`
Emit this to remove a track from the playlist.

### `audio:remove-all`
Clear the whole playlist.

### `audio:start-recording`
Start recording with a MediaRecorder object.

### `audio:record-complete`
Fired after a `stop-recording` event. Get a blob with the stream 
recorded as the only param.

### `audio:stop-recording`
Stop a recording started with `start-recording` event. Also will 
trigger a `record-complete` event.

### `audio:pause`
Pause the current track, if the `play` event is trggered after, it will start 
playing from where it got paused.

### `audio:next`
Set the curretnTrack as the next availaible one. If it was the last, set it to 
the first track on list. If the current track was playing, it will stop it, set 
the next one as the current track, and play it.

### `audio:prev`
Set the curretnTrack as the previous availaible one. If it was the first, set it to 
the last track on list. If the current track was playing, it will stop it, set 
the previous one as the current track, and play it.

### `audio:stop`
Stop the current track being played and reset the list to the first track.

### `audio:set`
Set properties for the current track, take a single object parameter with the 
properties to set. Posible options to set are:

- volume: Float. Set the value fo the [GainNode][GainNode].
- repeat: Boolean. Repeat the source whene finished playing.
- loop: Same as repeat.
- frequency: Float. Set the frequency value in the [BiquadFilter][BiquadFilter].
- detune: Float. Set the detune value in the [BiquadFilter][BiquadFilter].
- Q: Float. Set the frequency value in the [BiquadFilter][BiquadFilter].

### `audio:add-node`
Add an audio node to the graph. This will be added directly to the buffer 
source of the current track, and then connected to the audio context destination. 
You must pass the type (string) and optionally the config for that node. For 
more info about types and configurations, see [web-audio-graph][web-audio-graph] 
documentation.

### `audio:add-signal`
Add an [oscillator source node][OscillatorNode] and connect it to the context destination. You should 
pass three arguments `id` an unique identifier, `frequency` the frequency of the signal 
defaults to 440, and `type` the type of the oscillator, defaults to 'sine' for a sine 
wave. This oscillators are stored in a Map and availaible through `state.audio.signals`

### `audio:play-signal`
Play an audio signal by its id.

### `audio:stop-signal`
Stop an audio signal by its id.

## API
### var store = audio()
When included in your app, your state will be populated with an `audio` object 
with the following properties:

- `graph`: The [`web-audio-graph`][web-audio-graph] object that manage all the nodes.
- `tracklist`: An array with all the buffer source nodes of every track loaded.
- `index`: The index of the curren track in the tracklist.
- `userInput`: The streamSource input node populated after a `get-user-input` event.
- `signals`: A Map with the signals defined with `add-signal` event.

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
[GainNode]: https://developer.mozilla.org/en-US/docs/Web/API/GainNode
[BiquadFilterNode]: https://developer.mozilla.org/es/docs/Web/API/BiquadFilterNode
[OscillatorNode]: https://developer.mozilla.org/en-US/docs/Web/API/OscillatorNode