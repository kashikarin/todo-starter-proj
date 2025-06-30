const {useSelector} = ReactRedux

export function DoneRateProgressBar() {
    
    const todosCount = useSelector(state => state.todoModule.todos.length)
    const doneTodosCount = useSelector(state => state.todoModule.todos.filter(todo => todo.isDone).length)  
    
    const doneRate = ((doneTodosCount / todosCount) * 100).toFixed(2) || 0

    return(
        <article className='todos-done-precentage-container'>
            <span>{`You have finished ${doneRate}%`}</span>
            <div className='todos-progessbar-container'>
                <div className="todos-progress-bar-bar"></div>  
                <div style={{width: `${doneRate}%`}} className="todos-progress-bar-value"></div> 
            </div>
        </article>
    )
}