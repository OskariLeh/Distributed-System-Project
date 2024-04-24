import { ListItem } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';


// This returns a list of events for a given day
const EventList = (props) => {
    if (!props.items){
        return
    }
    const items = props.items

    const listItems = items.map((item) => {
        return (
            <>
            <ListItem key={item.name}>
                <ListItemText primary={item.name} />
                <ListItemText primary={item.description} />
                <ListItemText primary={item.creator} />
            </ListItem>
            <hr/>
            </>
        )
})
    return (
        <div>
            <h1>Events</h1>
            <ol>
                <ListItem >
                    <ListItemText primary="Name of event" />
                    <ListItemText primary="Description" />
                    <ListItemText primary="Creator" />
                </ListItem>
                {listItems}
            </ol>
        </div>
    )
}


export default EventList