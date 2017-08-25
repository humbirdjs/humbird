import React from 'react'
import { observer, inject, mobxInject } from '../../../lib/humbird'
import Toolbar from '../Toolbar'

const Counter = inject(({ models }) => {
  return (
    <div>
      <span>{models.counter.count}</span>
      <Toolbar title='test'/>
    </div>
  )
})

export default Counter
