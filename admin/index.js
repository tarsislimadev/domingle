import { Peer } from "https://esm.sh/peerjs@1.5.5?bundle-deps"
import { ADMIN_ID } from '../config.js'

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
    window.localConnection = this.local = new Peer(ADMIN_ID)

    this.local.on('open', (open) => {
      console.log('[local] open', open)

      this.updateConnectionsList()
    })

    this.local.on('connection', (conn) => {
      console.log('[local] connection', conn)

      this.updateConnectionsList()

      const obj = {
        onLocalRemote: (data) => {
          const { local, remote } = data.data
          console.log('local-remote', local, remote)

          if (remote) {
            this.connections = this.connections.filter(c => c != local)
          } else {
            this.connections.push(local)
          }
        }
      }

      conn.on('open', (open) => console.log('[conn] open', open))

      conn.on('data', (data) => {
        console.log('[conn] data', data)

        switch (data.name) {
          case 'local-remote':
            obj.onLocalRemote(data)
            break
        }
      })

      conn.on('error', (error) => console.log('[conn] error', error))

      conn.on('close', (close) => {
        console.log('[conn] close', close)

        this.updateConnectionsList()
      })

      setInterval(() => {
        conn.send(this.getConnectionsListMessage())
      }, 1000);
    })

    this.local.on('error', (error) => console.log('[local] error', error))

    this.local.on('close', (close) => {
      console.log('[local] close', close)

      this.updateConnectionsList()
    })
  }

  getConnectionsListMessage() {
    return {
      name: 'connections-list',
      data: { connections: this.connections, },
      time: Date.now(),
    }
  }

  updateConnectionsList() {
    while (this.elements.connections.children.item(0)) {
      this.elements.connections.children.item(0).remove()
    }

    Object.keys(this.local.connections).map((call) => {
      const label = document.createElement('div')
      if (this.local.connections[call].length) label.textContent = call
      this.elements.connections.append(label)
    })
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new MainConnection()
})
