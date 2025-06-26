import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { updateUser } from "../store/actions/user.actions.js"

// const {useParams} = ReactRouterDOM
const {useEffect, useState} = React
const {useSelector} = ReactRedux

export function UserDetails(){
    // const params = useParams()
    const loggedInUser = useSelector(state => state.userModule.loggedInUser)
    const [user, setUser] = useState(null)
    
    useEffect(()=>{ 
        if (loggedInUser) {
            setUser({
            _id: loggedInUser._id,
            fullname: loggedInUser.fullname,
            color: loggedInUser.prefs.color || 'black',
            bgColor: loggedInUser.prefs.bgColor || 'white'})           
    }}, [])

    function handleChange({target}) {
        const {name, value} = target
        setUser(prevUser => ({...prevUser, [name]: value}))
    }

    function onSave(ev) {
        ev.preventDefault()
        const {fullname, color, bgColor, _id} = user
        console.log(" user:", user)
        
        const userToSave = {_id, fullname, prefs: {color, bgColor}}
        
        updateUser(userToSave)
            .then(() => showSuccessMsg('user updated successfully'))
            .catch(()=> showErrorMsg('failed to update the user'))
    }
    if (!user) return
    const {fullname, color, bgColor} = user

    return(
        <section className="user-profile-container">
            <h3>Profile</h3>
            <article className="user-profile-details-container">
                <form onSubmit={onSave}>
                    <label htmlFor="fullname">Name:</label>    
                    <input type="text" placeholder='Your name' id='fullname' value={fullname} name='fullname' onChange={handleChange} />
                    
                    <label htmlFor="color">Color: </label>
                    <input type="color" id='color' name='color' value={color} onChange={handleChange}/>

                    <label htmlFor="bgColor">BG Color: </label>
                    <input type="color" id='bgColor' name='bgColor' value={bgColor} onChange={handleChange}/>
                    <button>Save</button>
                </form>
            </article> 
        </section>
    )
}

