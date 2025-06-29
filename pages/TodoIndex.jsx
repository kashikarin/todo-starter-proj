import { TodoFilter } from "../cmps/TodoFilter.jsx"
import { TodoList } from "../cmps/TodoList.jsx"
import { DataTable } from "../cmps/data-table/DataTable.jsx"
import { todoService } from "../services/todo.service.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { loadTodos, removeTodo, saveTodo } from "../store/actions/todo.actions.js"
import { changeUserBalance, addActivity } from "../store/actions/user.actions.js"
import { SET_FILTERBY } from "../store/reducers/todo.reducer.js"
import { TodoSort } from "../cmps/TodoSort.jsx"
const {useSelector, useDispatch} = ReactRedux
const { useEffect } = React
const { Link, useSearchParams } = ReactRouterDOM

export function TodoIndex() {
    const dispatch = useDispatch()
    const todos = useSelector(state => state.todoModule.todos)
    const loggedInUser = useSelector(state => state.userModule.loggedInUser)
    const isLoading = useSelector(state => state.todoModule.isLoading)
    // Special hook for accessing search-params:
    const [searchParams, setSearchParams] = useSearchParams()
    const defaultFilter = todoService.getFilterFromSearchParams(searchParams)
    const user = useSelector(state => state.userModule.loggedInUser)
    const filterBy = useSelector(state => state.todoModule.filterBy)

    useEffect(()=>{
        onSetFilterBy(defaultFilter)
    }, [])

    useEffect(() => {
        setSearchParams(filterBy)
        loadTodos(filterBy)
            .then(() => showSuccessMsg('Todos loaded successfully'))
            .catch(() => showErrorMsg('Cannot load todos'))
    }, [filterBy])

    // useEffect(()=>{
    //     loadTodos(filterBy)
    //         .catch(()=> showErrorMsg('Failed to load updated todos'))
    // }, [...todosStatuses])

    function onRemoveTodo(todoId) {
        const removedTodo = todos.find(todo => todo._id === todoId)
        console.log(" removedTodo:", removedTodo)
        removeTodo(todoId)
            .then(() => {
                if (user) addActivity(`Removed a Todo ${removedTodo.txt}`)
                showSuccessMsg(`Todo removed`)
            })
            .catch(() => showErrorMsg('Cannot remove todo ' + todoId))
    }

    async function onToggleTodo(todo) {
        let todoToSave = { ...todo, isDone: !todo.isDone }
        if (!loggedInUser) return
        try {
            let savedTodo = await saveTodo(todoToSave)
            if (savedTodo.isDone) await changeUserBalance(10)
            showSuccessMsg(`Todo is ${(savedTodo.isDone)? 'done' : 'back on your list'}`)
        } catch(err) {
            showErrorMsg('Cannot toggle todo ' + todo._id)
        }
    }

    function onSetFilterBy(filterObj){
        dispatch({type: SET_FILTERBY, filterBy: {...filterObj}})
    }

    const loader = <i style={{fontSize: 100, marginBottom: '50px'}}class="fas fa-cog fa-spin"></i>
    return (
        <section className="todo-index">
            <TodoFilter filterBy={filterBy} onSetFilterBy={onSetFilterBy} />
            <TodoSort onSetFilterBy={onSetFilterBy}/>
            <div style={{marginBottom: '30px', marginTop: '30px'}}>
                <Link to="/todo/edit" className="btn" >Add Todo</Link>
            </div>
            <h2>Todos List</h2>
            {isLoading? loader : <TodoList todos={todos} onRemoveTodo={onRemoveTodo} onToggleTodo={onToggleTodo} />}
            <hr />
            <h2>Todos Table</h2>
            <div style={{ width: '60%', margin: 'auto' }}>
                <DataTable todos={todos} onRemoveTodo={onRemoveTodo} />
            </div>
        </section>
    )
}