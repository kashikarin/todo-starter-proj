import { utilService } from "../../services/util.service.js";

export function ActivitiesTable({activities}){
        console.log(activities);
        
        return (<table border="1" className="data-table">
            <thead>
                <tr>
                    <th style={{width: '1em'}}>&nbsp;</th>
                    <th style={{width: '5em'}}>Time</th>
                    <th>Txt</th>
                </tr>
            </thead>
            <tbody>
                {activities.length && activities.map((activity, i) => <tr key={i} >
                    <td></td>
                    <td>{utilService.elapsedTime(activity.at)}</td>
                    <td>{activity.txt}</td>
                </tr>)}
            </tbody>
        </table>)
    }
