var AudioManager = require('./lib/AudioManager')
module.exports = audio

var events = audio.events = {
  LOAD: 'audio:load', //
  GET_USER_INPUT: 'audio:get-user-input', //
  PLAY: 'audio:play', //
  PLAY_ALL: 'audio:play-all',
  REMOVE: 'audio:remove',
  REMOVE_ALL: 'audio:remove-all', //
  START_RECORDING: 'audio:start-recording',
  STOP_RECORDING: 'audio:stop-recording',
  ADD_NODE: 'audio:add-node',
  ADD_SIGNAL: 'audio:add-signal',
  PLAY_SIGNAL: 'audio:play-signal',
  STOP_SIGNAL: 'audio:stop-signal',
  STOP: 'audio:stop', //
  SET: 'audio:set',
  NEXT: 'audio:next', //
  PREV: 'audio:prev', //
  PAUSE: 'audio:pause', //
  ERROR: 'audio:error' //
}

function audio (opts) {
  opts = opts || {}

  return function (state, emitter) {
    state.audio = {}
    var audioManager = AudioManager()

    try {
      // load
      emitter.on(events.LOAD, function (url) {
        audioManager.load(url)
      })
      // get user input
      emitter.on(events.GET_USER_INPUT, function () {
        audioManager.getUserInput()
      })
      // play
      emitter.on(events.PLAY, function () {
        audioManager.play()
      })
      // pause
      emitter.on(events.PAUSE, function () {
        audioManager.pause()
      })
      // stop
      emitter.on(events.STOP, function () {
        audioManager.stop()
      })
      // next
      emitter.on(events.NEXT, function () {
        audioManager.next()
      })
      // prev
      emitter.on(events.PREV, function () {
        audioManager.prev()
      })
      // remove all
      emitter.on(events.REMOVE_ALL, function () {
        audioManager.removeAll()
      })
      // get user input
      emitter.on(events.FILTER, function (filterSettings) {
        state.audio.playlist[state.audio.index].setFilter(filterSettings)
      })
    } catch (e) {
      emitter.emit(events.ERROR, e)
    }
  }
}
