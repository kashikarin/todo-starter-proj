const { useState } = React
const { Link, NavLink } = ReactRouterDOM
const {useSelector} = ReactRedux
import { logout } from '../store/actions/user.actions.js'
import { UserMsg } from "./UserMsg.jsx"
import { LoginSignup } from './LoginSignup.jsx'
import { showErrorMsg } from '../services/event-bus.service.js'
import { DoneRateProgressBar } from './DoneRateProgressBar.jsx'


export function AppHeader() {
    const user = useSelector(state => state.userModule.loggedInUser)
    
    function onLogout() {
        logout()
            .catch(() => showErrorMsg('OOPs try again'))
    }

    function getUserPrefs(){
        if (!user || !user.prefs) return
        const {color, bgColor} = user.prefs
        return {color, backgroundColor: bgColor}
    }

    return (
        <header style={getUserPrefs()} className="app-header full main-layout">
            <section className="header-container">
                <h1>React Todo App</h1>
                {user ? (
                    < section className='user-header-details'>

                        <Link to={`/user/${user._id}`}>Hello {user.fullname}</Link>
                        <span>balance: {user.balance}</span>
                        <button onClick={onLogout}>Logout</button>
                    </ section >
                ) : (
                    <section>
                        <LoginSignup  />
                    </section>
                )}
                {user && <DoneRateProgressBar />}
                <nav className="app-nav">
                    <NavLink to="/" >Home</NavLink>
                    <NavLink to="/about" >About</NavLink>
                    <NavLink to="/todo" >Todos</NavLink>
                    <NavLink to="/dashboard" >Dashboard</NavLink>
                </nav>
            </section>
            <UserMsg />
        </header>
    )
}
