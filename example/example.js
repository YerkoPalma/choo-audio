var choo = require('choo')
var html = require('choo/html')
var css = require('sheetify')

var app = choo()
if (process.env.NODE_ENV !== 'production') {
  app.use(require('choo-devtools')())
}
app.use(require('..')())
app.use(loadSounds)
app.route('/', mainView)
app.mount('body')

var text = css`
  :host {
    color: #fff;
    text-align: center;
  }
`
function mainView (state, emit) {
  return html`
    <body>
      <div>
        <p class="${text}">${state.audio.tracklist.length} Tracks loaded</p>
      </div>
      <ul>
        <li>
          <meter value="0.3"></meter>
          <meter value="0.2"></meter>
          <meter value="0.16"></meter>
          <meter value="0.2"></meter>
          <meter value="0.3"></meter>
        </li>
    
        <li>
          <input type="range" min="0" max="1" step="0.01" value="0.5" oninput=${setFrequency}/>
        </li>

        <li>
          <input type="number" min="1" max="100" value="78" oninput=${setVolume}/>
        </li>
    
        <li>
          <input ${state.audio.tracklist.length < 0 ? 'disabled' : ''} onclick=${e => emit('audio:prev')} type="radio" name="radio" data-icon="❮❮" />
          <input ${state.audio.tracklist.length < 0 ? 'disabled' : ''} onclick=${e => emit('audio:play')} type="radio" name="radio" data-icon="►" />
          <input ${state.audio.tracklist.length < 0 ? 'disabled' : ''} onclick=${e => emit('audio:next')} type="radio" name="radio" data-icon="❯❯" />
          <input ${state.audio.tracklist.length < 0 ? 'disabled' : ''} onclick=${e => emit('audio:stop')} type="radio" name="radio" data-icon="■" />
          <input ${state.audio.tracklist.length < 0 ? 'disabled' : ''} type="radio" name="radio" data-icon="●" />
        </li>
    
        <li>
          <progress value="0.3"></progress>
        </li>
      </ul>
    </body>
  `
  function setFrequency (e) {
    e.preventDefault()
    var minValue = 40
    var maxValue = state.audio.graph.context.sampleRate / 2
    var numberOfOctaves = Math.log(maxValue / minValue) / Math.LN2
    var multiplier = Math.pow(2, numberOfOctaves * (e.target.value - 1.0))
    emit('audio:set', { frequency: maxValue * multiplier })
  }

  function setVolume (e) {
    e.preventDefault()
    emit('audio:set', { volume: e.target.value / 10 })
  }
}

function loadSounds (state, emitter) {
  emitter.on('audio:load-complete', function () {
    console.log(state.audio.tracklist.length)
    emitter.emit('render')
  })
  emitter.on('DOMContentLoaded', function () {
    // emitter.emit('audio:load', 'media/techno.wav')
    emitter.emit('audio:load', 'media/the-birds.wav')
    emitter.emit('audio:load', 'media/ambient-loop.wav')
  })
}
