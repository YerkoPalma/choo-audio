var AudioTrack = require('./lib/AudioTrack')
module.exports = audio

var events = audio.events = {
  LOAD: 'audio:load',
  LOAD_AND_PLAY: 'audio:load-and-play',
  PLAY: 'audio:play',
  PLAY_ALL: 'audio:play-all',
  REMOVE: 'audio:remove',
  REMOVE_ALL: 'audio:remove-all',
  FILTER: 'audio:filter',
  STOP: 'audio:stop',
  NEXT: 'audio:next',
  PAUSE: 'audio:pause',
  ERROR: 'audio:error'
}

function audio (opts) {
  opts = opts || {}

  return function (state, emitter) {
    state.audio = {}
    state.audio.playlist = []
    state.audio.index = 0
    Object.defineProperty(state.audio, 'isPlaying', { get: function () {
      return state.audio.playlist[state.audio.index].isPlaying || false
    }})
    try {
      // load
      emitter.on(events.LOAD, function (url) {
        var track = new AudioTrack(url)
        track.init().then(() => {
          state.audio.playlist.push(track)
        })
      })
      // load and play
      emitter.on(events.LOAD_AND_PLAY, function (url) {
        var track = new AudioTrack(url)
        track.init().then(() => {
          track.play()
        })
      })
      // play
      emitter.on(events.PLAY, function () {
        state.audio.playlist[state.audio.index].play()
      })
      // pause
      emitter.on(events.PAUSE, function () {
        state.audio.playlist[state.audio.index].pause()
      })
      // next
      emitter.on(events.NEXT, function () {
        if (state.audio.isPlaying) {
          state.audio.playlist[state.audio.index].pause()
          state.audio.index++
          state.audio.playlist[state.audio.index].play()
        } else {
          state.audio.index++
        }
      })
      // remove all
      emitter.on(events.REMOVE_ALL, function () {
        state.audio.playlist = []
      })
      // filter
      emitter.on(events.FILTER, function (filterSettings) {
        state.audio.playlist[state.audio.index].setFilter(filterSettings)
      })
    } catch (e) {
      emitter.emit(events.ERROR, e)
    }
  }
}
