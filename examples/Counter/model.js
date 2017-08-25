import { observable, action } from 'mobx'

export default {
  // state
  count: 0,

  // action
  incr: action.bound(function () {
    this.count += 1
  }),
  decr: action.bound(function () {
    this.count -= 1
  })
}
