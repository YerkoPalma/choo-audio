# choo-audio

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
  // the following 2 lines could be replaced by 
  // emitter.emit('audio:load-and-play', 'some/sound.wav')
  emitter.emit('audio:load', 'some/sound.wav')
  // play the next audio buffer in the queue
  emitter.emit('audio:play')

  // the play event also accept an object argument, with the following properties
  // buffer<ArrayBuffer>: if you already have the buffer data on memory
  // time<int>: if you want to manipulate from where in ms you want your audio to start
  // volume<int>: to set the volume of the sound
  // emitter.emit('audio:play', { source, time, volume })

  // play all the queue simultaneously
  // emitter.emit('audio:play-all')
  emitter.emit('audio:pause')
  emitter.emit('audio:stop')
}
```
## Events
### `audio:load`
### `audio:play`
### `audio:play-all`
### `audio:remove`
### `audio:remove-all`
### `audio:start-recording`
### `audio:stop-recording`
### `audio:pause`
## API

## License
