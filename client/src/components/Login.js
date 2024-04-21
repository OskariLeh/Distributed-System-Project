import React, { useState } from 'react'
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import { Button, TextField } from '@mui/material'

function Login() {
  let [userData, setUserData] = useState({})

  // Submits the form and tries to login
  // Saves jsonwebtoken to local storage on success
  const loginButton = async () => {
    await fetch("/user/login", {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(userData)
    })
    .then(response => {
      if (response.status === 200){
        response.json()
        .then(data => {
          if (data.token){
            localStorage.setItem("auth_token", data.token)
            window.location.href="/"
        } 
        })
      }
    })
  }       
      
  const handleChange = (e) => {
    setUserData({...userData, [e.target.name]: e.target.value})
  }

  return (
    <>
      <Container maxWidth="sm">
        <Box sx={{ bgcolor: '#FFFFFF', height: '50vh', marginTop: "50px", minHeight: 400, border: "solid black", borderRadius: "25px"}}>
            <h2>Email</h2>
            <TextField id="email-input" name='email' label="example@example.com" variant="filled" onChange={handleChange}/>
            <h2>Password</h2>
            <TextField id="password-input" name='password' label="Password" variant="filled" type='password' onChange={handleChange} />   
            <div>
                <Button variant="outlined" sx={{ marginTop: "30px" }} onClick={() => loginButton()}>Login </Button> 
            </div>

            <div>
                <p>Don't have an account?</p>
                <a href='/signUp'>Sign up</a>
            </div>
        </Box> 
      </Container>
    </>
  )
}

export default Login