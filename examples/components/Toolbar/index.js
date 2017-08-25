import React from 'react'
import { observer, inject, mobxInject } from '../../../lib/humbird'

const Toolbar = inject(({ models, title }) => {
  return (
    <div>
      <div id='title'>{title}</div>
      <button onClick={models.counter.incr}>+</button>
      <button onClick={models.counter.decr}>-</button>
    </div>
  )
})

export default Toolbar