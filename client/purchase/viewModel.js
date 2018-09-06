import api from 'api'
import ko from 'knockout'

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default class {
  constructor() {
    this.id = 0
    this.ready = ko.observable(false)
    this.init()
  }

  async init() {
    const p = await api.get('/api/purchase/' + this.id)
    this.purchase = {
      date: ko.observable(p.date),
      title: ko.observable(p.title),
      description: ko.observable(p.description),
      amount: ko.observable(p.amount),
      reference: ko.observable(p.reference)
    }
    this.computedDate = ko.pureComputed(() => new Date(this.purchase.date()))
    this.purchase.date(
      months[this.computedDate().getMonth()] + ' ' + this.computedDate().getDate() + ', ' + this.computedDate().getFullYear()
    )
    this.ready(true)
  }

  save() {
    this.purchase.date(this.computedDate)
  }
}
