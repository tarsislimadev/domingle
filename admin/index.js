import { Peer } from "https://esm.sh/peerjs@1.5.5?bundle-deps"

class MainConnection {
  adminConnection = null
  calls = []
  elements = {
    connections: document.getElementById('connections'),
  }

  constructor() {
    this.createConnection()
    this.startManager()
  }

  createConnection() {
    window.adminConnection = this.adminConnection = new Peer('domeengle-admin')

    this.adminConnection.on('open', () => {
      console.log('[admin] open', this.adminConnection.id)
    })

    this.adminConnection.on('connection', (conn) => {
      this.updateConnectionsList()

      conn.on('open', (open) => console.log('[conn] open', open))
      conn.on('data', (data) => console.log('[conn] data', data))
      conn.on('close', (close) => console.log('[conn] close', close))
    })

    this.adminConnection.on('disconnected', () => {
      console.log('[admin] disconnected')
      this.updateConnectionsList()
    })
  }

  updateConnectionsList() {
    while (this.elements.connections.children.item(0)) {
      this.elements.connections.children.item(0).remove()
    }

    Object.keys(this.adminConnection.connections).map((call) => {
      console.log({ call })
      const label = document.createElement('div')
      label.textContent = call
      this.elements.connections.append(label)
    })
  }

  startManager() { }
}

document.addEventListener('DOMContentLoaded', () => {
  new MainConnection()
})
