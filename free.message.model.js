import { MessageModel } from './message.model.js'

import { MESSAGES } from './config.js'

export class FreeMessageModel extends MessageModel {
  name = MESSAGES.FREE

  constructor(localId) {
    super()
    this.data = { localId }
  }
}
