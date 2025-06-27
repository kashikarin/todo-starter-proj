import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { updateUser } from "../store/actions/user.actions.js"
import { ActivitiesTable } from "../cmps/activities-table/ActivitiesTable.jsx"

const {useEffect, useState} = React
const {useSelector} = ReactRedux

export function UserDetails(){
    const loggedInUser = useSelector(state => state.userModule.loggedInUser)
    console.log(" loggedInUser:", loggedInUser)
    const [user, setUser] = useState(null)
    console.log(" user:", user)
    
    useEffect(()=>{ 
        if (loggedInUser) loadUserData()
    }, [])
// 
    
    function loadUserData(){
        setUser({
            _id: loggedInUser._id, 
            fullname: loggedInUser.fullname,
            color: loggedInUser.prefs.color || 'black',
            bgColor: loggedInUser.prefs.bgColor || 'white',
            activities: loggedInUser.activities})
    }

    function handleChange({target}) {
        const {name, value} = target
        setUser(prevUser => ({...prevUser, [name]: value}))
    }

    function onSave(ev) {
        ev.preventDefault()
        const {fullname, color, bgColor, _id, activities} = user
        console.log(" user:", user)
        
        const userToSave = {_id, fullname, prefs: {color, bgColor}, activities}
        
        updateUser(userToSave)
            .then(() => showSuccessMsg('user updated successfully'))
            .catch(()=> showErrorMsg('failed to update the user'))
    }
    if (!user) return
    const {fullname, color, bgColor, activities} = user
    console.log(user)
    return(
        <section className="user-profile-container">
            <h3>Profile</h3>
            <form onSubmit={onSave}>
                <label htmlFor="fullname">Name:</label>    
                <input type="text" placeholder='Your name' id='fullname' value={fullname} name='fullname' onChange={handleChange} />
                
                <label htmlFor="color">Color: </label>
                <input type="color" id='color' name='color' value={color} onChange={handleChange}/>

                <label htmlFor="bgColor">BG Color: </label>
                <input type="color" id='bgColor' name='bgColor' value={bgColor} onChange={handleChange}/>
                <button>Save</button>
            </form>
            {activities.length ? <ActivitiesTable activities={activities} /> : `No activities are logged for ${fullname}`}
        </section>
    )
}

