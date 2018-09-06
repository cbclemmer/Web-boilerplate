import api from 'api'
import ko from 'knockout'

export default class {
  constructor() {
    this.id = 0
    this.ready = ko.observable(false)
    this.init()
  }

  async init() {
    this.purchase = await api.get('/api/purchase/' + this.id)
    this.ready(true)
  }

  save() {

  }
}
