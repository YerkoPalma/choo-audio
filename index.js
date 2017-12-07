var AudioManager = require('./lib/AudioManager')
module.exports = audio

var events = audio.events = {
  LOAD: 'audio:load', //
  LOAD_COMPLETE: 'audio:load-complete', //
  GET_USER_INPUT: 'audio:get-user-input', //
  PLAY: 'audio:play', //
  PLAY_ALL: 'audio:play-all', //
  REMOVE: 'audio:remove', //
  REMOVE_ALL: 'audio:remove-all', //
  START_RECORDING: 'audio:start-recording', //
  STOP_RECORDING: 'audio:stop-recording', //
  RECORD_COMPLETE: 'audio:record-complete', //
  ADD_NODE: 'audio:add-node', //
  ADD_SIGNAL: 'audio:add-signal', //
  PLAY_SIGNAL: 'audio:play-signal', //
  STOP_SIGNAL: 'audio:stop-signal', //
  STOP: 'audio:stop', //
  SET: 'audio:set', //
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
        audioManager.load(url).then(() => emitter.emit(events.LOAD_COMPLETE))
      })
      // get user input
      emitter.on(events.GET_USER_INPUT, function () {
        audioManager.getUserInput()
      })
      // play
      emitter.on(events.PLAY, function (index) {
        audioManager.play(index)
      })
      // play all
      emitter.on(events.PLAY_ALL, function () {
        audioManager.tracklist.forEach((track, i) => {
          audioManager.play(i)
        })
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
      // remove
      emitter.on(events.REMOVE, function (index) {
        audioManager.remove(index)
      })
      // start recording
      emitter.on(events.START_RECORDING, function () {
        audioManager.startRecording()
      })
      // stop recording
      emitter.on(events.START_RECORDING, function () {
        audioManager.stopRecording(blob => emitter.emit(events.RECORD_COMPLETE, blob))
      })
      // set
      emitter.on(events.SET, function (config) {
        audioManager.set(config)
      })
      // add node
      emitter.on(events.ADD_NODE, function ({ type, config }) {
        audioManager.addNode(type, config)
      })
      // add signal
      emitter.on(events.ADD_SIGNAL, function ({ id, frequency, type }) {
        audioManager.addSignal(id, frequency, type)
      })
      // play signal
      emitter.on(events.PLAY_SIGNAL, function (id) {
        audioManager.playSignal(id)
      })
      // stop signal
      emitter.on(events.STOP_SIGNAL, function (id) {
        audioManager.stopSignal(id)
      })
    } catch (e) {
      emitter.emit(events.ERROR, e)
    }
  }
}
