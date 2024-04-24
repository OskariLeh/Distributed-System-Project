import { Box, Button, Container, IconButton } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import TextField from '@mui/material/TextField';
import React, { useState, useEffect } from 'react'
import Row from "./Row"
import EventList from './EventList';


function Calendar() {
    const authToken = localStorage.getItem("auth_token")
    // Checks if logged in
    if (!authToken){
        window.location.href = "/login"
    }

    // Default value set to current date
    let [dateData, setDateData] = useState(new Date())
    // Saves the data to submit events
    let [submitData, setSubmitData] = useState({})
    // Saves event data from database
    let [eventData, setEventData] = useState({})
    
    const daysInMonth = (year, month) => new Date(year, month, 0).getDate()

    // Gets event data from database 
    useEffect(() => {
    function getEvents() {  
        const authToken = localStorage.getItem("auth_token")   
        fetch(`event/${dateData.getFullYear() + "-" + (dateData.getMonth()+1) + "-" + dateData.getDate()}`, {
            method: "GET",
            headers: {
              "Content-type": "application/json",
              "Authorization": "Bearer " + authToken
            },
            body: JSON.stringify()
          })
          .then(response => response.json())
          .then(data => {
            if (data.fail === true) {
              localStorage.removeItem("auth_token")
            } else {
                console.log("success")
                setEventData(data)
            }
          })  
        }
        getEvents()
    }, [dateData]) 
    
    // Handles changing month back
    const monthBack = () => {
        let currentDate = dateData
        if (currentDate.getMonth === 0) {
            let newDate = new Date(currentDate.getFullYear()-1, currentDate.getMonth(), 0)
            setDateData(newDate)
        } else {
            let newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0)
            setDateData(newDate)
        }     
    }

    // Handles changing month forward
    const monthForward = () => {
        let currentDate = dateData
        if (currentDate.getMonth === 11) {
            let newDate = new Date(currentDate.getFullYear()+1, currentDate.getMonth()+1, 1)
            setDateData(newDate)
        } else {
            let newDate = new Date(currentDate.getFullYear(), currentDate.getMonth()+1, 1)
            setDateData(newDate)
        }   
    }

    // Handles the click event on calendar day
    const handleClick = (day) => {
        let currentDate = dateData
        let newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
        setDateData(newDate)
    }

    // Submits data to database
    const handleSubmit = async () => {
        submitData.date = (dateData.getFullYear() + "-" + (dateData.getMonth()+1) + "-" + dateData.getDate() + "T" + submitData.date)
        console.log(submitData)
        await fetch("event", {
            method: "POST",
            headers: {
              "Content-type": "application/json",
              "Authorization": "Bearer " + authToken
            },
            body: JSON.stringify(submitData)
          })
          .then(response => {
            if (response.status === 200){
              console.log("Added to database")
              window.location.href = "/"
            }
          })
    }

    // Saves form data to variable submitData
    const handleChange = (e) => {
        setSubmitData({...submitData, [e.target.name]: e.target.value})
      }
    
    // Logs out the current user
    const handleLogout = () => {
        localStorage.removeItem("auth_token")
        window.location.href = "/login"
    }

    // Adds the current user to participants of an event
    const handleJoin = (item) => {
        let joinBody = {
            name: item.name,
            date: item.date
        }
        console.log(joinBody)
        fetch("event/join", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "Authorization": "Bearer " + authToken
            },
            body: JSON.stringify(joinBody)
            })
            .then(response => {
            if (response.status === 200){
                console.log("Added participant")
                window.location.href = "/"
            }
            })
        }

  return (
    <div>
        <Box sx={{height: "70vh", width: "100%"}}>
        <Button variant="contained" sx={{marginRight: "15px", position: "absolute", top: "10px", left:"30px"}} onClick={handleLogout}>Logout</Button>
            <Box sx={{display: "flex", alignItems: "center", flexDirection: "row", marginLeft: "50% "}}>
                <IconButton sx={{alignSelf: "center"}} onClick={monthBack}>
                    <ArrowBackIcon/>
                </IconButton>
                <h2 id='month'>{dateData.toLocaleDateString("en-GB", {month: "long"})}</h2>
                <IconButton onClick={monthForward}>
                    <ArrowForwardIcon/>
                </IconButton>
                <h2 id="year">{dateData.getFullYear()}</h2>
            </Box>
            <Row
                handleClick={handleClick}
                start={1}
                stop={7} 
                numberOfDays={7} />
            <Row
                handleClick={handleClick}
                start={8}
                stop={14} 
                numberOfDays={7} />
            <Row
                handleClick={handleClick}
                start={15}
                stop={21} 
                numberOfDays={7} />
            <Row
                handleClick={handleClick}
                start={22}
                stop={28} 
                numberOfDays={7} />
            <Row
                handleClick={handleClick}
                start={29}
                stop={31} 
                numberOfDays={daysInMonth(dateData.getFullYear(), dateData.getMonth()+1) - 28} />
            
        </Box>
        <hr />
        <Box sx={{height: "30vh", width: "100%"}}>
            <Container sx={{position: "relative", border: "solid black", boxSizing: "border-box", height: "70px"}}>
                <h3>Add event</h3>
                <TextField name="name" label="Name of event" variant="standard" sx={{marginRight: "15px" , position: "absolute", top: "1px", left: "200px"}} onChange={handleChange}/>
                <TextField name="description" label="Description" variant="standard" sx={{marginRight: "15px", position: "absolute", top: "1px", right: "500px"}} onChange={handleChange}/>
                <TextField name="date" label="Enter time as 'HH:mm'" variant="standard" sx={{marginRight: "15px", position: "absolute", top: "1px", right: "200px"}} onChange={handleChange}/>
                <Button variant="contained" sx={{marginRight: "15px", position: "absolute", top: "10px", right:"30px"}} onClick={handleSubmit}>Submit</Button>
            </Container>
            <h3>{dateData.toLocaleDateString("en-GB", {weekday: "long"}) + " " + dateData.getDate()+ "." + (dateData.getMonth()+1) + "." + dateData.getFullYear()}</h3>

            <EventList items={eventData.events} handleJoin={handleJoin}/>

            
        </Box>
    </div>
  )
}

export default Calendar