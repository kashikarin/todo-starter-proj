import { DoneRateProgressBar } from "./DoneRateProgressBar.jsx"
const {useSelector} = ReactRedux
export function AppFooter() {
        const user = useSelector(state => state.userModule.loggedInUser)

    function getUserPrefs(){
        if (!user || !user.prefs) return
        const {color, bgColor} = user.prefs
        return {color, backgroundColor: bgColor}
    }

    return (
        <header style={getUserPrefs()} className="app-footer full main-layout">
            <div className="footer-progress-bar-container">
               { user && <DoneRateProgressBar />} 
            </div>
        </header>
    )
}
