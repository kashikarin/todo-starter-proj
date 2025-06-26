import { TodoFilter } from "../cmps/TodoFilter.jsx"
import { TodoList } from "../cmps/TodoList.jsx"
import { DataTable } from "../cmps/data-table/DataTable.jsx"
import { todoService } from "../services/todo.service.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { loadTodos, removeTodo, updateTodo } from "../store/actions/todo.actions.js"
import { updateUser } from "../store/actions/user.actions.js"
import { SET_FILTERBY, SET_ISLOADING } from "../store/reducers/todo.reducer.js"
const {useSelector, useDispatch} = ReactRedux
const { useState, useEffect } = React
const { Link, useSearchParams } = ReactRouterDOM

export function TodoIndex() {
    const dispatch = useDispatch()
    const todos = useSelector(state => state.todoModule.todos)
    const todosStatuses = useSelector(state => state.todoModule.todos.map(todo => todo.isDone))
       
    const isLoading = useSelector(state => state.todoModule.isLoading)
    // Special hook for accessing search-params:
    const [searchParams, setSearchParams] = useSearchParams()
    const user = useSelector(state => state.userModule.loggedInUser)
    const filterBy = useSelector(state => state.todoModule.filterBy)

    useEffect(() => {
        setSearchParams(filterBy)
        loadTodos(filterBy)
            .then(() => showSuccessMsg('Todos loaded successfully'))
            .catch(() => showErrorMsg('Cannot load todos'))
    }, [filterBy])

    useEffect(()=>{
        loadTodos(filterBy)
            .catch(()=> showErrorMsg('Failed to load updated todos'))
    }, [...todosStatuses])

    function onRemoveTodo(todoId) {
        removeTodo(todoId)
            .then(() => showSuccessMsg(`Todo removed`))
            .catch(err => showErrorMsg('Cannot remove todo ' + todoId))
    }

    function onToggleTodo(todo) {
        let todoToSave = { ...todo, isDone: !todo.isDone }
        if (todoToSave.isDone) {
            let updatedUser = incrementUserBalance(user)
        } 
        updateTodo(todoToSave)
            .then((savedTodo) => {
                showSuccessMsg(`Todo is ${(savedTodo.isDone)? 'done' : 'back on your list'}`)
            })
            .catch(() => showErrorMsg('Cannot toggle todo ' + todo._id))
    }

    function incrementUserBalance(user){
        if (!user) return 
        let updatedUser = {...user, balance: user.balance + 10}
        updateUser(updatedUser)
            .then(()=> showSuccesssg(`${user.fullname}'s balance was increased`))
            .catch(() => showErrorMsg(`failed to credit ${user.fullname}'s balance`))
    }

    function onSetFilterBy(filterObj){
        dispatch({type: SET_FILTERBY, filterBy: {...filterObj}})
    }

    // if (isLoading) return <i className="fa-solid fa-gear fa-spin"></i>
    return (
        <section className="todo-index">
            <TodoFilter filterBy={filterBy} onSetFilterBy={onSetFilterBy} />
            <div style={{marginBottom: '30px'}}>
                <Link to="/todo/edit" className="btn" >Add Todo</Link>
            </div>
            <h2>Todos List</h2>
            <TodoList todos={todos} onRemoveTodo={onRemoveTodo} onToggleTodo={onToggleTodo} />
            <hr />
            <h2>Todos Table</h2>
            <div style={{ width: '60%', margin: 'auto' }}>
                <DataTable todos={todos} onRemoveTodo={onRemoveTodo} />
            </div>
        </section>
    )
}