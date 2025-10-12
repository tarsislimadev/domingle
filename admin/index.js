import { Peer } from "https://esm.sh/peerjs@1.5.5?bundle-deps"
import { ADMIN_ID } from '../config.js'

class MainConnection {
  localConnection = null
  elements = {
    connections: document.getElementById('connections'),
  }

  constructor() {
    this.createConnection()
  }

  createConnection() {
    window.localConnection = this.localConnection = new Peer(ADMIN_ID)

    this.localConnection.on('open', () => console.log('[admin] open'))

    this.localConnection.on('connection', () => console.log('[admin] connection'))

    this.localConnection.on('disconnected', () => console.log('[admin] disconnected'))

    this.localConnection.on('error', () => console.log('[admin] error'))

    this.localConnection.on('close', () => console.log('[admin] close'))
  }

  updateConnectionsList() {
    while (this.elements.connections.children.item(0)) {
      this.elements.connections.children.item(0).remove()
    }

    Object.keys(this.localConnection.connections).map((call) => {
      const label = document.createElement('div')
      label.textContent = call
      this.elements.connections.append(label)
    })
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new MainConnection()
})
