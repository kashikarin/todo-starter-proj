import { todoService } from "../../services/todo.service.js"

//todos
export const SET_TODOS = 'SET_TODOS'
export const SET_DONE_TODOS_PERCENT = 'SET_DONE_TODOS_PERCENT'
export const SET_MAX_PAGE = 'SET_MAX_PAGE'
export const REMOVE_TODO = 'REMOVE_TODO'
export const ADD_TODO = 'ADD_TODO'
export const UPDATE_TODO = 'UPDATE_TODO'
export const UNDO_TODOS = 'UNDO_TODOS'
//isloading:
export const SET_ISLOADING = 'SET_ISLOADING'
//filterSort:
export const SET_FILTERSORT = 'SET_FILTERSORT'



const initialState = {
    todos: [],
    lastTodos: [],
    isLoading: false,
    filterSort: todoService.getDefaultFilter()
}

export function todoReducer(state = initialState, cmd){
    switch (cmd.type){
        //cars
        case SET_TODOS:
            return {...state, 
                    todos: cmd.todos}
        case REMOVE_TODO:
            return {...state,
                    lastTodos: [...state.todos], 
                    todos: state.todos.filter(todo => todo._id !== cmd.todoId)}
        case ADD_TODO: 
            return {...state, 
                    todos: [...state.todos, cmd.todo]}
        case UPDATE_TODO:
            return {...state, 
                    todos: state.todos.map(todo => todo._id === cmd.todo._id? cmd.todo : todo)}
        case UNDO_TODOS: 
            return {...state,
                    todos: [...state.lastTodos]}
        case SET_ISLOADING:
            return {...state, 
                    isLoading: cmd.isLoading}
        case SET_FILTERSORT:
            return {...state,
                    filterSort: {...cmd.filterSort}}

        default: return state
    }

}