import { todoService } from "../../services/todo.service.js"
import { SET_TODOS, REMOVE_TODO, ADD_TODO, UPDATE_TODO, SET_ISLOADING, SET_DONE_TODOS_PERCENT } from "../reducers/todo.reducer.js"
import { store } from "../store.js"
import { addActivity } from "./user.actions.js"

export function loadTodos(filterSort){
    store.dispatch({type: SET_ISLOADING, isLoading: true})
    return todoService.query(filterSort)
        .then((todos) => store.dispatch({type: SET_TODOS, todos}))
        .catch(err => {
            console.error('todo actions => Failed to load todos', err)
            throw err
        })
        .finally(()=>store.dispatch({type: SET_ISLOADING, isLoading: false}))
}

export function removeTodo(todoId) {
    return todoService.remove(todoId)
        .then(() => store.dispatch({type: REMOVE_TODO, todoId}))
        .then(() => addActivity(`Removed Todo ${todoId}`))
        .catch(err => {
            console.log('todo actions => Failed to remove todo:', err)
            throw err
        })
}

export function saveTodo(todoToSave) {
    store.dispatch({type: SET_ISLOADING, isLoading: true})
    return todoService.save(todoToSave)
        .then(savedTodo => {
            if (todoToSave._id) {
                store.dispatch({type: UPDATE_TODO, todo: savedTodo})
            } else {
                store.dispatch({type: ADD_TODO, todo: savedTodo})
            }
            return savedTodo
        })
        .catch(err => {
            console.error('todo actions => Failed to save todo', err)
            throw err
        })
        .finally(()=> store.dispatch({type: SET_ISLOADING, isLoading: false}))
    
}

