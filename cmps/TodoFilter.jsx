const { useState, useEffect, useRef } = React
import { useEffectUpdate } from "../custom-hooks/useEffectUpdate.js"
import { utilService } from "../services/util.service.js"
import { todoService } from "../services/todo.service.js"

export function TodoFilter({ filterSort, onSetFilterSort }) {
    const debouncedOnSetFilterSort = useRef(utilService.debounce(onSetFilterSort)).current
    const [filterSortToEdit, setFilterSortToEdit] = useState({...filterSort})

    useEffectUpdate(() => {
        // Notify parent
        debouncedOnSetFilterSort(filterSortToEdit)
    }, [filterSortToEdit])

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

            default: break
        }

        setFilterSortToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }



    const { txt, importance } = filterSortToEdit
    return (
        <section className="todo-filter">
            <h2>Filter Todos</h2>
            <form>
                <div className="filter-form-inputs">
                    <input value={txt} onChange={handleChange}
                        type="search" placeholder="By Txt" id="txt" name="txt"
                    />
                    <label htmlFor="importance">Importance: </label>
                    <input value={importance} onChange={handleChange}
                        type="number" placeholder="By Importance" id="importance" name="importance"
                    />
                    <label htmlFor="status">Status: </label>
                    <select name="isDone" id="status" onChange={handleChange}>
                        <option value="all">All</option>
                        <option value="done">Done</option>
                        <option value="active">Active</option>
                    </select>
                </div>  
                <button hidden>Set Filter</button>
                <button onClick={()=>setFilterSortToEdit(todoService.getDefaultFilter())}>Reset Filter and Sort</button>
            </form>
        </section>
    )
}