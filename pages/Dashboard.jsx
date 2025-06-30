const { useEffect, useState } = React
const {useSelector} = ReactRedux
import {Chart} from '../cmps/Chart.jsx'
import { showErrorMsg } from '../services/event-bus.service.js'
import { todoService } from '../services/todo.service.js'
import { loadTodos } from '../store/actions/todo.actions.js'

export function Dashboard() {
    const [importanceStats, setImportanceStats] = useState([])
    const todos = useSelector(state=>state.todoModule.todos)

    //why do i need loadtodos if i have a global state?
    useEffect(()=>{
        if (todos.length) loadTodos()
            .catch(() => showErrorMsg('Failed to load todos'))
        todoService.getImportanceStats()
            .then(setImportanceStats)
    }, [])


    return (
        <section className="dashboard">
            <h1>Dashboard</h1>
            {todos ? <h2>Statistics for {todos.length} Todos</h2> : "No todos were loaded"}
            <hr />
            <h4>By Importance</h4>
            <Chart data={importanceStats}/>
        </section>
    )
}