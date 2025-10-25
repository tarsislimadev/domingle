import { MessageModel } from "./message.model.js"
import { MESSAGES } from './config.js'

export class ConnectionsListMessageModel extends MessageModel {
  name = MESSAGES.CONNECTIONS_LIST

  constructor(list = []) {
    super()
    this.data = { list }
  }
}
