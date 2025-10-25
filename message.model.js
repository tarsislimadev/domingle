export class MessageModel {
  name = 'message'
  data = null
  time = Date.now()

  toJSON() {
    const { name, data, time } = this
    return { name, data, time }
  }

  toString() {
    const json = this.toJSON()
    return JSON.stringify(json)
  }
}
