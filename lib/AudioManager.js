/* global fetch navigator MediaRecorder Blob */
var AudioGraph = require('web-audio-graph')
var isAudioBuffer = require('is-audio-buffer')

module.exports = AudioManager

function AudioManager () {
  if (!(this instanceof AudioManager)) return new AudioManager()

  this.graph = AudioGraph()
  this.tracklist = []
  this.signals = new Map()
  this.index = 0
  this.userInput = null
  this.recorder = null
  this._chunks = []
}

AudioManager.prototype.load = function (audio) {
  if (typeof audio === 'string') {
    return fetch(audio)
    .then(response => response.arrayBuffer())
    .then(buffer => {
      this.graph.context.decodeAudioData(buffer, audioBuffer => {
        var source = this.graph.addSource('buffer', audioBuffer)
        source.addNode('filter').addNode('gain').connectToDestination()
        this.tracklist.push(source)

        return new Promise(resolve => resolve())
      })
    })
  } else if (isAudioBuffer(audio)) {
    var source = this.graph.addSource('buffer', audio)
    source.addNode('filter').addNode('gain').connectToDestination()
    this.tracklist.push(source)
    return new Promise(resolve => resolve())
  }
}

AudioManager.prototype.set = function (config) {
  // can set volume, frequency, detune, and quality
  // any other property must be set through special node
}

AudioManager.prototype.addNode = function (nodeType, config) {
  this.tracklist[this.index].addNode(nodeType).update(config)
}

AudioManager.prototype.getUserInput = function () {
  if (navigator.mediaDevices) {
    navigator.mediaDevices.getUserMedia ({ audio: true })
    .then(stream => {
      this.userInput = this.graph.addSource('mediaStream', stream)
      this.userInput.addNode('filter').addNode('gain').connectToDestination()
    })
  }
}

AudioManager.prototype.next = function () {
  this.tracklist[++this.index]
}

AudioManager.prototype.prev = function () {
  this.tracklist[--this.index]
}

AudioManager.prototype.addSignal = function (id, frequency, type) {
  type = type || 'sine'
  frequency = frequency || 440
  var oscillator = this.graph.addSource('oscillator')
  oscillator.update({ type, frequency })
  oscillator.connectToDestination()
  this.signals.set(id, oscillator)
}

AudioManager.prototype.play = function (index) {
  if (typeof index === 'number' && index >= 0 && index <= this.tracklist.length) this.index = index
  this.tracklist[this.index].play()
}

AudioManager.prototype.playSignal = function (id) {
  this.signals.get(id).play()
}

AudioManager.prototype.pause = function (index) {
  if (typeof index === 'number' && index >= 0 && index <= this.tracklist.length) this.index = index
  this.tracklist[this.index].pause()
}

AudioManager.prototype.stop = function (index) {
  if (typeof index === 'number' && index >= 0 && index <= this.tracklist.length) this.index = index
  this.tracklist[this.index].stop()
}

AudioManager.prototype.stopSignal = function (id) {
  this.signals.get(id).stop()
}

AudioManager.prototype.remove = function (index) {
  if (typeof index === 'number' && index >= 0 && index <= this.tracklist.length) {
    // if we are removing the current track, set current track as the one before
    if (this.index === index) {
      if (this.index === 0) this.index = 0
      else this.index--
    }
    this.tracklist.splice(index, 1)
  }
}

AudioManager.prototype.removeAll = function () {
  // hard reset
  this.graph = AudioGraph()
  this.tracklist = []
  this.signals = new Map()
  this.index = 0
  this.userInput = null
}

AudioManager.prototype.startRecording = function () {
  var dest = this.graph.context.createMediaStreamDestination()
  this.recorder = new MediaRecorder(dest.stream)
  var source = this.tracklist[this.index]
  source.connect(dest)

  var self = this
  this.recorder.ondataavailable = function (e) {
    self._chunks.push(e.data)
  }
  this.recorder.start()
}

AudioManager.prototype.stopRecording = function (cb) {
  var self = this
  this.recorder.onstop = function (e) {
    var blob = new Blob(self._chunks, { 'type' : 'audio/ogg; codecs=opus' })
    cb(blob)
  }
  this.recorder.stop()
}
