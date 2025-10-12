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

    this.localConnection.on('open', (open) => {
      console.log('[local] open', open)
      this.updateConnectionsList()
    })

    this.localConnection.on('connection', (conn) => {
      console.log('[local] connection', conn)

      this.updateConnectionsList()

      conn.on('open', (open) => console.log('[conn] open', open))

      conn.on('data', (data) => console.log('[conn] data', data))

      conn.on('error', (error) => console.log('[conn] error', error))

      conn.on('close', (close) => {
        console.log('[conn] close', close)

        this.updateConnectionsList()
      })
    })

    // this.localConnection.on('disconnected', (disconnected) => console.log('[local] disconnected', disconnected))

    this.localConnection.on('error', (error) => console.log('[local] error', error))

    this.localConnection.on('close', (close) => {
      console.log('[local] close', close)

      this.updateConnectionsList()
    })
  }

  updateConnectionsList() {
    while (this.elements.connections.children.item(0)) {
      this.elements.connections.children.item(0).remove()
    }

    Object.keys(this.localConnection.connections).map((call) => {
      const label = document.createElement('div')
      if (this.localConnection.connections[call].length) label.textContent = call
      this.elements.connections.append(label)
    })
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new MainConnection()
})
