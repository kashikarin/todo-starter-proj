import { TodoPreview } from "./TodoPreview.jsx"
const { Link } = ReactRouterDOM
const {useState} = React

export function TodoList({ todos, onRemoveTodo, onToggleTodo }) {
    const [todoColors, setTodoColors] = useState({})
    function handleColorClick(todoId, idx){
        setTodoColors(prevColors => ({...prevColors, [todoId]: {color: colorPalette[idx]}}))
    }
    
    const colorPalette = ['#007991', '#9395D3', '#F2D0A4', '#EA9E8D', '#CE84AD'];
    return (
        <ul className="todo-list">
            {todos.length === 0? 'No todos to show' : todos.map(todo => (<li key={todo._id} style={{backgroundColor: todoColors[todo._id]? todoColors[todo._id].color : 'transparent', backgroundImage: todoColors[todo._id] ? 'none' : undefined}}>
                        
                    <TodoPreview todo={todo} onToggleTodo={()=>onToggleTodo(todo)} />
                    <section>
                        <button onClick={() => onRemoveTodo(todo._id)}>Remove</button>
                        <button><Link to={`/todo/${todo._id}`}>Details</Link></button>
                        <button><Link to={`/todo/edit/${todo._id}`}>Edit</Link></button>
                    </section>
                    <section className="color-selection-pallete">
                        {[0,1,2,3,4].map(coloredDiv => (<div 
                                                        key={coloredDiv}
                                                        className={`color color${coloredDiv}`}
                                                        style={{backgroundColor: colorPalette[coloredDiv]}}
                                                        onClick={()=> handleColorClick(todo._id, coloredDiv)}
                                                        >
                                                        </div>))}
                    </section>
                </li>)
            )}
        </ul>
    )
}