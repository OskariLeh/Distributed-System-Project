import React, { useState } from 'react'
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import { Button, TextField } from '@mui/material'

function SignUp() {
  let [userData, setUserData] = useState({})

  // On button press try to register with given information
  const signUpButton = async () => {
    await fetch("/user/register", {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(userData)
    })
    .then(response => {
      if (response.status === 200){
        window.location.href = "/login"
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
            <TextField id="email-input" label="example@example.com" variant="filled" name='email' onChange={handleChange}/>
            <h2>Username</h2>
            <TextField id="username-input" label="Username" variant="filled" name='name' onChange={handleChange}/>
            <h2>Password</h2>
            <TextField id="password-input" label="Password" variant="filled" name='password' type='password' onChange={handleChange}/>   
            <div>
                <Button variant="outlined" sx={{ marginTop: "30px" }} onClick={() => signUpButton()}>Sign Up </Button> 
            </div>
        </Box> 
      </Container>
    </>
  )
}

export default SignUp