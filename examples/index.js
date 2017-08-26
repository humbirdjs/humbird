import { observable, action } from 'mobx'
import humbird from '../lib/humbird'
import router from './router'
import todoModel from './models/todoModel'

const app = humbird()

app.model(todoModel)

app.models.todoModel.addTodo("read MobX tutorial");
app.models.todoModel.addTodo("try MobX");
app.models.todoModel.todos[0].completed = true;
app.models.todoModel.todos[1].task = "try MobX in own project";
app.models.todoModel.todos[0].task = "grok MobX tutorial";
                        

app.router(router)

app.spy((event) => {
    if (event.type === 'action') {
        console.log(`${event.name} with args: ${event.arguments}`)
    }
})

app.start('#app')
