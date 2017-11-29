var choo = require('choo')
var html = require('choo/html')

var app = choo()
if (process.env.NODE_ENV !== 'production') {
  app.use(require('choo-devtools')())
}
app.use(require('.')())
app.use(loadSounds)
app.route('/', mainView)
app.mount('body')

function mainView (state, emit) {
  return html`
    <body>
      <p>
        <button onclick=${playPause}>Play/pause</button>
        Frequency: <input type="range" min="0" max="1" step="0.01" value="1" oninput=${addfrequencyFilter}>
        Quality: <input type="range" min="0" max="1" step="0.01" value="0" oninput=${addQFilter}>
      </p>
      <button onclick=${e => emit('audio:next')}>Next</button>
      <button onclick=${e => emit('audio:remove-all')}>Clear queue</button>
      <button onclick=${e => emit('audio:record')}>Record current track</button>
      <button onclick=${e => emit('audio:record')}>Record user mic</button>
    </body>
  `
  function addfrequencyFilter (e) {
    e.preventDefault()
    var minValue = 40
    var maxValue = state.audio.playlist[state.audio.index].context.sampleRate / 2
    var numberOfOctaves = Math.log(maxValue / minValue) / Math.LN2
    var multiplier = Math.pow(2, numberOfOctaves * (e.target.value - 1.0))
    emit('audio:filter', { frequency: maxValue * multiplier })
  }

  function addQFilter (e) {
    e.preventDefault()
    emit('audio:filter', { q: e.target.value * 30 })
  }

  function playPause (e) {
    e.preventDefault()
    if (state.audio.isPlaying) {
      emit('audio:pause')
    } else {
      emit('audio:play')
    }
    // state.audio.isPlaying will be updated automatically
  }
}

function loadSounds (state, emitter) {
  emitter.on('DOMContentLoaded', function () {
    emitter.emit('audio:load', 'techno.wav')
    emitter.emit('audio:load', 'the-birds.wav')
    emitter.emit('audio:load', 'ambient-loop.wav')
  })
}
