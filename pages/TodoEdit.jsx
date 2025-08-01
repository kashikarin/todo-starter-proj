import { todoService } from "../services/todo.service.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { saveTodo } from "../store/actions/todo.actions.js"
import { addActivity } from "../store/actions/user.actions.js"
const { useState, useEffect } = React
const { useNavigate, useParams } = ReactRouterDOM
const {useSelector} = ReactRedux

export function TodoEdit() {

    const [todoToEdit, setTodoToEdit] = useState(todoService.getEmptyTodo())
    const navigate = useNavigate()
    const params = useParams()
    const isLoading = useSelector(state => state.todoModule.isLoading)

    useEffect(() => {
        if (params.todoId) loadTodo()
    }, [])

    function loadTodo() {
        todoService.get(params.todoId)
            .then(setTodoToEdit)
            .catch(err => console.log('err:', err))
    }

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value || ''
                break

            case 'checkbox':
                value = target.checked
                break

            default:
                break
        }

        setTodoToEdit(prevTodoToEdit => ({ ...prevTodoToEdit, [field]: value }))
    }

    function onSaveTodo(ev) {
        ev.preventDefault()
        saveTodo(todoToEdit)
            .then((savedTodo) => {
                
                navigate('/todo')
                if (params.todoId) addActivity(`Editted a Todo ${savedTodo.txt}`)
                else addActivity(`Added a Todo ${savedTodo.txt}`)
                showSuccessMsg(`Todo Saved (id: ${savedTodo._id})`)
            })
            .catch(() => showErrorMsg('Cannot save todo'))
    }

    const buttonLoader = <i className="fas fa-spinner"></i>
    const { txt, importance, isDone } = todoToEdit
    console.log(" todoToEdit:", todoToEdit)
    
    return (
        <section className="todo-edit">
            <form onSubmit={onSaveTodo} >
                <label htmlFor="txt">Text:</label>
                <input onChange={handleChange} value={txt} type="text" name="txt" id="txt" />

                <label htmlFor="importance">Importance:</label>
                <input onChange={handleChange} value={importance} type="number" name="importance" id="importance" />

                <label htmlFor="isDone">isDone:</label>
                <input onChange={handleChange} value={isDone} type="checkbox" name="isDone" id="isDone" />

                <label>Change color</label>
                <div className='change-color-container'>
                    <div ></div>
                </div>
                <button >{isLoading? buttonLoader : "Save"}</button>
            </form>
        </section>
    )
}