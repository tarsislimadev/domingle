import { Peer } from "https://esm.sh/peerjs@1.5.5?bundle-deps"
import { ADMIN_ID, PREFIX_ID, TIMEOUT } from './config.js'

class Message {
  name = 'message'
  data = null
  time = Date.now()
}

class LocalRemoteMessage extends Message {
  name = 'local-remote'

  constructor(localId, remoteId) {
    super()
    this.data = { localId, remoteId }
  }
}

class WebRTCCall {
  localStream = null
  remoteStream = null
  local = null
  remote = null
  admin = null
  connections = []

  elements = {
    localVideo: document.getElementById('localVideo'),
    remoteVideo: document.getElementById('remoteVideo'),
    startBtn: document.getElementById('startBtn'),
    callBtn: document.getElementById('callBtn'),
  }

  constructor() {
    this.setupEventListeners()
  }

  setupEventListeners() {
    this.elements.startBtn.addEventListener('click', () => this.startStreamAndCall())
    this.elements.callBtn.addEventListener('click', () => this.startRemoteCall())
  }

  async startStreamAndCall() {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })

      this.elements.localVideo.srcObject = this.localStream
      this.elements.startBtn.disabled = true
      this.elements.callBtn.disabled = false

      await this.createLocalConnection()
    } catch (error) {
      console.log(`Error starting call: ${error.message}`)
    }
  }

  async createLocalConnection() {
    this.local = new Peer(PREFIX_ID + Date.now())

    this.local.on('open', (open) => this.onLocalConnectionOpen(open))

    this.local.on('call', (call) => console.log('[local] call', call))

    this.local.on('close', (close) => console.log('[local] close', close))

    this.local.on('disconnected', (disconnected) => console.log('[local] disconnected', disconnected))

    this.local.on('error', (error) => console.log('[local] error', error))
  }

  onLocalConnectionOpen() {
    console.log('[local] open', this.local.id)
    this.createAdminConnection()
  }

  createAdminConnection() {
    window.adminConnection = this.admin = this.local.connect(ADMIN_ID)

    this.admin.on('open', (open) => {
      console.log('[admin] open', open)

      setInterval(() => {
        if (this.admin.open) {
          this.admin.send(new LocalRemoteMessage(this.local.id, this.remote?.id))
        }
      }, TIMEOUT)
    })

    this.admin.on('data', (data) => {
      console.log('[admin] data', data)

      switch (data.name) {
        case 'connections-list':
          this.connections = data.data.connections;
          break
      }
    })

    this.admin.on('close', (close) => console.log('[admin] close', close))

    this.admin.on('disconnected', (disconnected) => console.log('[admin] disconnected', disconnected))

    this.admin.on('error', (error) => console.log('[admin] error', error))
  }

  startRemoteCall(index = 0) {
    this.remote = this.local.call(this.connections[index], this.localStream)

    this.remote.on('open', (open) => console.log('[remote] open', open))

    this.remote.on('error', (error) => console.log('[remote] error', error))

    this.remote.on('close', (close) => console.log('[remote] close', close))

    this.remote.on('stream', (stream) => console.log('[remote] stream', stream))
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new WebRTCCall()
})
