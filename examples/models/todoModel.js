export default {
    name: 'todoModel',
    state: {
        todos: [],
        pendingRequests: 0
    },
    actions: {
        addTodo(task) {
            this.todos.push({
                task: task,
                completed: false,
                assignee: null
            });
        }
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
    }
}