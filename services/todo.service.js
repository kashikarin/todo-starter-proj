import { utilService } from './util.service.js'
import { storageService } from './async-storage.service.js'

const TODO_KEY = 'todoDB'
// const PAGE_SIZE = 3
_createTodos()

export const todoService = {
    query,
    get,
    remove,
    save,
    getEmptyTodo,
    getDefaultFilter,
    getFilterFromSearchParams,
    getImportanceStats,
}
// For Debug (easy access from console):
window.cs = todoService

function query(filterSort = {}) {   
    return storageService.query(TODO_KEY)
        .then(todos => {
            if (filterSort.txt) {
                const regExp = new RegExp(filterSort.txt, 'i')
                todos = todos.filter(todo => regExp.test(todo.txt))
            }

            if (filterSort.importance) {
                todos = todos.filter(todo => todo.importance >= filterSort.importance)
            }

            if (filterSort.isDone === 'active') {
                todos = todos.filter(todo => todo.isDone !== true)
            }

            if (filterSort.isDone === 'done') {
                todos = todos.filter(todo => todo.isDone !== false)
            }

            if (filterSort.sorting === 'text') {
                todos = todos.sort((a, b) => a.txt.localeCompare(b.txt))
            }

            if (filterSort.sorting === 'importance') {
                todos = todos.sort((a, b) =>  b.importance - a.importance)
            }
            return todos
        })
}

function get(todoId) {
    return storageService.get(TODO_KEY, todoId)
        .then(todo => {
            todo = _setNextPrevTodoId(todo)
            return todo
        })
}

function remove(todoId) {
    return storageService.remove(TODO_KEY, todoId)
}

function save(todo) {
    if (todo._id) {
        // TODO - updatable fields
        todo.updatedAt = Date.now()
        return storageService.put(TODO_KEY, todo)
    } else {
        todo.createdAt = todo.updatedAt = Date.now()

        return storageService.post(TODO_KEY, todo)
    }
}

function getEmptyTodo(txt = '', importance = 5) {
    return { txt, importance, isDone: false }
}

function getDefaultFilter() {
    return { txt: '', importance: 0, isDone: '' }
}

function getFilterFromSearchParams(searchParams) {
    const defaultFilter = getDefaultFilter()
    const filterSort = {}
    for (const field in defaultFilter) {
        filterSort[field] = searchParams.get(field) || ''
    }
    return filterSort
}


function getImportanceStats() {
    return storageService.query(TODO_KEY)
        .then(todos => {
            const todoCountByImportanceMap = _getTodoCountByImportanceMap(todos)
            if (!todos.length) {
                return Object.keys(todoCountByImportanceMap).map(speedName => ({ title: speedName, value: 0}))
            } else {
                return Object.keys(todoCountByImportanceMap).map(speedName => ({ title: speedName, value: Math.round((todoCountByImportanceMap[speedName]/todos.length)*100) }))
            }
        })
    
}

function _createTodos() {
    let todos = utilService.loadFromStorage(TODO_KEY)
    if (!todos || !todos.length) {
        todos = []
        const txts = ['Learn React', 'Master CSS', 'Practice Redux']
        for (let i = 0; i < 20; i++) {
            const txt = txts[utilService.getRandomIntInclusive(0, txts.length - 1)]
            todos.push(_createTodo(txt + (i + 1), utilService.getRandomIntInclusive(1, 10)))
        }
        utilService.saveToStorage(TODO_KEY, todos)
    }
}

function _createTodo(txt, importance) {
    const todo = getEmptyTodo(txt, importance)
    todo._id = utilService.makeId()
    todo.createdAt = todo.updatedAt = Date.now() - utilService.getRandomIntInclusive(0, 1000 * 60 * 60 * 24)
    return todo
}

function _setNextPrevTodoId(todo) {
    return storageService.query(TODO_KEY).then((todos) => {
        const todoIdx = todos.findIndex((currTodo) => currTodo._id === todo._id)
        const nextTodo = todos[todoIdx + 1] ? todos[todoIdx + 1] : todos[0]
        const prevTodo = todos[todoIdx - 1] ? todos[todoIdx - 1] : todos[todos.length - 1]
        todo.nextTodoId = nextTodo._id
        todo.prevTodoId = prevTodo._id
        return todo
    })
}

function _getTodoCountByImportanceMap(todos) {
    const todoCountByImportanceMap = todos.reduce((map, todo) => {
        if (todo.importance < 3) map.low++
        else if (todo.importance < 7) map.normal++
        else map.urgent++
        return map
    }, { low: 0, normal: 0, urgent: 0 })
    return todoCountByImportanceMap
}


// Data Model:
// const todo = {
//     _id: "gZ6Nvy",
//     txt: "Master Redux",
//     importance: 9,
//     isDone: false,
//     createdAt: 1711472269690,
//     updatedAt: 1711472269690
// }

