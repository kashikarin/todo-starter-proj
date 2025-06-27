const { useState, useEffect } = React
import { useEffectUpdate } from "../custom-hooks/useEffectUpdate.js"

export function TodoFilter({ filterBy, onSetFilterBy }) {

    const [filterByToEdit, setFilterByToEdit] = useState({...filterBy})

    useEffectUpdate(() => {
        // Notify parent
        onSetFilterBy(filterByToEdit)
    }, [filterByToEdit])

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

        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }

    // Optional support for LAZY Filtering with a button
    function onSubmitFilter(ev) {
        ev.preventDefault()
        onSetFilterBy(filterByToEdit)
    }

    const { txt, importance } = filterByToEdit
    return (
        <section className="todo-filter">
            <h2>Filter Todos</h2>
            <form onSubmit={onSubmitFilter}>
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
            </form>
        </section>
    )
}