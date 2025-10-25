import { Peer } from "https://esm.sh/peerjs@1.5.5?bundle-deps"
import { getAdminID, peer_config } from '../config.js'
import { ConnectionsListMessageModel } from '../connection.list.message.model.js'

class MainConnection {
  local = null
  connections = []
  elements = {
    connections: document.getElementById('connections'),
  }

  constructor() {
    this.createConnection()
  }

  createConnection() {
    window.localConnection = this.local = new Peer(getAdminID(), peer_config)

    this.local.on('open', (open) => {
      console.log('[local] open', open)

      this.updateConnectionsList()
    })

    this.local.on('connection', (conn) => {
      console.log('[local] connection', conn)

      this.connections.push(conn)

      conn.on('data', (data) => {
        console.log('[conn] data', data)
      })

      this.startSendingConnectionsList()
    })


    this.local.on('close', (close) => {
      console.log('[local] close', close)

      this.updateConnectionsList()
    })
  }

  startSendingConnectionsList() {
    this.interval_id = setInterval(() => {
      this.connections.map((conn) => {
        try {
          const connections_ids = this.connections.map(c => c.connectionId)
          conn.send(new ConnectionsListMessageModel(connections_ids))
        } catch (e) {
          console.error(e)
        }
      })
    }, 1000)
  }

  updateConnectionsList() {
    while (this.elements.connections.children.item(0)) {
      this.elements.connections.children.item(0).remove()
    }

    Object.keys(this.local.connections).map((call) => {
      const label = document.createElement('div')
      label.textContent = call
      this.elements.connections.append(label)
    })
  }
}

document.addEventListener('DOMContentLoaded', () =>
  new MainConnection()
)
