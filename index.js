import { Peer } from "https://esm.sh/peerjs@1.5.5?bundle-deps"

import { ADMIN_ID, PREFIX_ID } from './config.js'

class WebRTCCall {
  localStream = null
  remoteStream = null
  localConnection = null
  remoteConnection = null
  adminConnection = null

  elements = {
    localVideo: document.getElementById('localVideo'),
    remoteVideo: document.getElementById('remoteVideo'),
    startBtn: document.getElementById('startBtn'),
    callBtn: document.getElementById('callBtn'),
  }

  configuration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
      { urls: 'stun:stun3.l.google.com:19302' },
      { urls: 'stun:stun4.l.google.com:19302' },
    ]
  }

  TIMEOUT = 2000

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
      console.error('Failed to start call')
    }
  }

  async createLocalConnection() {
    this.localConnection = new Peer(PREFIX_ID + Date.now())

    this.localConnection.on('open', (open) => this.onLocalConnectionOpen(open))

    this.localConnection.on('connection', (connection) => console.log('[local] connection', connection))

    this.localConnection.on('call', (call) => console.log('[local] call', call))

    this.localConnection.on('close', (close) => console.log('[local] close', close))

    this.localConnection.on('disconnected', (disconnected) => console.log('[local] disconnected', disconnected))

    this.localConnection.on('error', (error) => console.log('[local] error', error))
  }

  onLocalConnectionOpen() {
    console.log('[local] open', this.localConnection.id)
    this.createAdminConnection()
  }

  createAdminConnection() {
    window.adminConnection = this.adminConnection = this.localConnection.connect(ADMIN_ID)

    this.adminConnection.on('open', (open) => console.log('[admin] open', open))

    this.adminConnection.on('connection', (connection) => console.log('[admin] connection', connection))

    this.adminConnection.on('call', (call) => console.log('[admin] call', call))

    this.adminConnection.on('close', (close) => console.log('[admin] close', close))

    this.adminConnection.on('disconnected', (disconnected) => console.log('[admin] disconnected', disconnected))

    this.adminConnection.on('error', (error) => console.log('[admin] error', error))

    setInterval(() => {
      this.adminConnection.send({
        local: this.localConnection.id,
        remote: this.remoteConnection?.id
      })
    }, this.TIMEOUT)
  }

  startRemoteCall() { }
}

document.addEventListener('DOMContentLoaded', () => {
  new WebRTCCall()
})
