import { observable, action } from 'mobx'

export default {
  namespace: 'counter',
  state: {
    count: 0
  },
  actions: {
    incr() {
      this.count += 1
    },
    decr() {
      this.count -= 1
    }
  }
}
