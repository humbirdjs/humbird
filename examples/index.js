import { observable, action } from 'mobx'
import humbird, { createHashHistory } from '../lib/humbird'
import router from './router'
import todoModel from './models/todoModel'

const history = createHashHistory()
const app = humbird({
    history
})

app.model(todoModel)

app.router(router)

app.start('#app')
