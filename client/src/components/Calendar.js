import { Box, Button, Container, IconButton } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import TextField from '@mui/material/TextField';
import React, { useState, useEffect } from 'react'
import Row from "./Row"
import EventList from './EventList';


function Calendar() {
    const authToken = localStorage.getItem("auth_token")
    if (!authToken){
        window.location.href = "/login"
    }

    // Default value set to current date
    let [dateData, setDateData] = useState(new Date())
    let [submitData, setSubmitData] = useState({})
    let [eventData, setEventData] = useState({})
    
    const daysInMonth = (year, month) => new Date(year, month, 0).getDate()

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

    const handleClick = (day) => {
        let currentDate = dateData
        let newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
        setDateData(newDate)
    }

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
            }
          })
    }

    const handleChange = (e) => {
        setSubmitData({...submitData, [e.target.name]: e.target.value})
      }

  return (
    <div>
        <Box sx={{height: "70vh", width: "100%"}}>
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
            <h3>{dateData.toLocaleDateString("en-GB", {weekday: "long"}) + " " + dateData.getDate()+ "." + (dateData.getMonth()+1) + "." + dateData.getFullYear()}</h3>

            <EventList items={eventData.events}/>

            <Container sx={{position: "absolute", bottom: "10px", left: "30vh", border: "solid black", boxSizing: "border-box", height: "70px"}}>
                <TextField name="name" label="Name of event" variant="standard" sx={{marginRight: "15px"}} onChange={handleChange}/>
                <TextField name="description" label="Description" variant="standard" sx={{marginRight: "15px"}} onChange={handleChange}/>
                <TextField name="date" label="Enter time as 'HH:mm'" variant="standard" sx={{marginRight: "15px"}} onChange={handleChange}/>
                <Button variant="contained" onClick={handleSubmit}>Submit</Button>
            </Container>
        </Box>
    </div>
  )
}

export default Calendar