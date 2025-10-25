import { Peer } from "https://esm.sh/peerjs@1.5.5?bundle-deps"
import { MESSAGES, getAdminID, getName, TIMEOUT, peer_config } from './config.js'
import { MessageModel } from './message.model.js'
import { FreeMessageModel } from './free.message.model.js'

class WebRTCCall {
  localStream = null
  remoteStream = null
  local = null
  remote = null
  admin = null
  connections = []
  send_free_id = -1

  elements = {
    localVideo: document.getElementById('localVideo'),
    remoteVideo: document.getElementById('remoteVideo'),
    startBtn: document.getElementById('startBtn'),
    callBtn: document.getElementById('callBtn'),
    subtitle: document.getElementById('subtitle'),
  }

  constructor() {
    this.setupEventListeners()
  }

  setupEventListeners() {
    this.elements.startBtn.addEventListener('click', () => this.startStreamAndCall())
    this.elements.callBtn.addEventListener('click', () => this.startRemoteCall())
  }

  startSendingFree() {
    this.send_free_id = setInterval(() => this.sendFree(), TIMEOUT)
  }

  sendFree() {
    if (!this.remote?.id && this.admin?.id) {
      this.sendAdminMessage(new FreeMessageModel(this.local.id))
    }
  }

  sendAdminMessage(message = new MessageModel()) {
    this.admin.send(message.toJSON())
  }

  async startStreamAndCall() {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })

      this.elements.localVideo.srcObject = this.localStream
      this.elements.startBtn.disabled = true

      await this.createLocalConnection()
    } catch (error) {
      console.log(`Error starting call: ${error.message}`)
    }
  }

  async createLocalConnection() {
    this.local = new Peer(getName(Date.now()), peer_config)

    this.local.on('open', (open) => this.onLocalConnectionOpen(open))

    this.local.on('call', (call) => this.onCall(call))
  }

  onCall(call) {
    console.log('on call', { call })

    this.elements.subtitle.innerText = `CALL Connection ID: ${call.connectionId}`

    call.answer(this.localStream)
  }

  onLocalConnectionOpen() {
    console.log('[local] open', this.local.id)

    this.elements.subtitle.innerText = `Local ID: ${this.local.id}`

    this.elements.callBtn.disabled = false

    this.createAdminConnection()
  }

  createAdminConnection() {
    window.adminConnection = this.admin = this.local.connect(getAdminID())

    this.admin.on('open', (open) => {
      console.log('[admin] open', open)

      this.startSendingFree()
    })

    this.admin.on('data', (data) => {
      // console.log('[admin] data', data)

      switch (data.name) {
        case MESSAGES.CONNECTIONS_LIST:
          this.onConnectionsList(data)
          break
      }
    })
  }

  onConnectionsList(data) {
    this.connections = data.data.list
  }

  getRemoteID() {
    console.log('connections', this.connections)

    const url = new URL(window.location)

    const id = url.searchParams.get('id')

    console.log({ id })

    if (id) return id

    return this.connections.find(c => c.id != this.local.id)?.id
  }

  startRemoteCall() {
    console.log('start remote call', {})

    this.remote = this.local.call(this.getRemoteID(), this.localStream)

    this.remote.on('open', (open) => console.log('[remote] open', open))

    this.remote.on('stream', (stream) => {
      console.log('[remote] stream', stream)

      this.remoteStream = stream
      this.elements.remoteVideo.srcObject = this.remoteStream
      this.elements.callBtn.disabled = true
    })
  }
}

const config = {
  counter: 0
}

document.addEventListener('DOMContentLoaded', () => new WebRTCCall())

document.addEventListener('keydown', ({ code }) => {
  if (code == 'KeyW') {
    config.counter++

    if (config.counter == 10) {
      window.open(`/admin/`)
    }
  }
})
