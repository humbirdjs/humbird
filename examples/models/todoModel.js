import { matchPath } from 'react-router'

export default {
    name: 'todoModel',
    state: {
        todos: [],
        pendingRequests: 0
    },
    computed: {
        completedTodosCount() {
            return this.todos.filter(
                todo => todo.completed === true
            ).length;
        },
        report() {
            if (this.todos.length === 0)
                return "<none>";
            return `Next todo: "${this.todos[0].task}". ` +
                `Progress: ${this.completedTodosCount}/${this.todos.length}`;
        }
    },
    actions: {
        querySuccess(todos) {
            this.todos = todos;
        },
        addTodo(task) {
            this.pendingRequests = 1;
            this.todos.push({
                task: task,
                completed: false,
                assignee: null
            });
        }
    },
    interceptors: {
        setup({app, history}) {
            console.log('setup...')
            history.listen((location, action) => {
                // location is an object like window.location
                console.log(action, location.pathname, location.search)
                const match = matchPath(location.pathname, {
                    path: '/todos'
                })
                if (match) {
                    const todos = [
                        {
                            task: "read MobX tutorial",
                            completed: false,
                            assignee: null
                        },
                        {
                            task: "try MobX",
                            completed: false,
                            assignee: null
                        }
                    ]
                    app.models.todoModel.querySuccess(todos);
                }
            })
        },
        willChangeTodos(change) {
            return change
        },
        didChangeTodos(change) {
            console.dir(change)
        },
        didChangePendingRequests(change) {
            console.dir(change)
        }
    }
}