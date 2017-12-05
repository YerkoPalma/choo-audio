/* global fetch */
module.exports = class AudioTrack {
  constructor (track, OriginAudioContext) {
    // the constructor may take an AudioContext instance, so we could connect 
    // many tracks to the same context
    window.AudioContext = window.AudioContext || window.webkitAudioContext
    this.context = OriginAudioContext || new window.AudioContext()
    this.buffers = []
    this.sources = []
    this.gains = []
    this.filters = []
    this.recorder = null
    this.isPlaying = false
    this._track = track
    this._pausedAt = 0
  }

  init () {
    if (typeof this._track === 'string') {
      return fetch(this._track)
      .then(response => response.arrayBuffer())
      .then(buffer => {
        this.context.decodeAudioData(buffer, decoded => {
          this.buffers.push(decoded)
          this.filters.push(this.context.createBiquadFilter())

          // finish
          return new Promise(resolve => resolve())
        })
      })
    } else if (Array.isArray(this._track)) {
      var promises = this._track.map(track => {
        return fetch(this._track)
          .then(response => response.arrayBuffer())
          .then(buffer => {
            this.context.decodeAudioData(buffer, decoded => {
              this.buffers.push(decoded)
              this.filters.push(this.context.createBiquadFilter())

              // finish
              return new Promise(resolve => resolve())
            })
          })
      })
      return Promise.all(promises)
    }
  }

  play (time, loop = true) {
    // does nothing if already playing
    if (!this.isPlaying) {
      time = time || 0
      this.source = this.context.createBufferSource()
      this.source.loop = loop
      this.gain = this.context.createGain()

      // connect
      this.source.buffer = this.buffer
      this.source.connect(this.filter)
      this.filter.connect(this.gain)
      this.gain.connect(this.context.destination)
      this.source.start(time || this._pausedAt)
      this.isPlaying = true
    }
  }

  pause () {
    if (this.isPlaying) {
      this._pausedAt = this.context.currentTime
      this.source.stop()
      this.isPlaying = false
    }
  }

  stop () {
    if (this.isPlaying) {
      this._pausedAt = 0
      this.source.stop()
      this.isPlaying = false
    }
  }

  startRecording () {
    // https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/createMediaStreamDestination
  }

  stopRecording () {
    
  }

  setFilter ({ frequency, detune, q, type }) {
    if (type) this.filter.type = type
    if (frequency) this.filter.frequency.value = frequency
    if (detune) this.filter.detune.value = detune
    if (q) this.filter.Q.value = q
  }
}
