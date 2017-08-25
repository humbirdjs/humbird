import { observable, action } from 'mobx'
import humbird from '../lib/humbird'
import router from './router'
import counterModel from './models/counter'

const app = humbird()

app.model(counterModel)

app.router(router)

app.start('#app')
