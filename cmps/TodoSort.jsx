
const {useState, useEffect} = React

export function TodoSort({onSetFilterBy}){
    const [sorting, setSorting] = useState({sorting: ""})

    useEffect(()=>{
        onSetFilterBy(sorting)
    }, [sorting])


    function handleSort({target}){
        setSorting({sorting: target.value})
    }

    return(
        <div className="sorting-container">
            <select name="sorting" id="sort" onChange={handleSort}>
                <option value="">Sort By</option>
                <option value="text">Text</option>
                <option value="importance">Importance</option>
            </select>
        </div>
    )
}