# API definition
## Users
### Registration
```
POST /user/register

{
    name: string,
    email: string,
    password: string
}
```
Returns:
- 200 OK, if successful
- 400 BAD REQUEST, if given arguments are incorrect
- 409 CONFLICT, if given email is already registered
- 500 INTERNAL SERVER ERROR, if something goes wrong

### Login
```
POST /user/login

{
    email: string,
    password: string
}
```
Returns:
- 200 OK with body `{token: <jwt string>}`, if successful. Expiration set to 2h.
- 400 BAD REQUEST, if given arguments are incorrect
- 404 NOT FOUND, if given user is not registered 
- 403 FORBIDDEN, if given password is incorrect

## Events
### Event creation
```
POST /event/

Authorization: "Bearer <jwt>"

{
    name: string,
    description: string,
    date: string of format "YYYY-MM-DDTHH:mm"
}
```
Returns:
- 200 OK, if successful
- 400 BAD REQUEST, if given arguments are incorrect
- 409 CONFLICT, if the given date already has an event with the given name
- 500 INTERNAL SERVER ERROR, if something goes wrong

### Getting events
```
GET /event/YYYY-MM-DD

Authorization: "Bearer <jwt>"
```

Returns:
- 200 OK, if successful, with body:
```
{
    events: [
        {
            name: string,
            description: string,
            creator: string,
            participants: [string]
        }
    ]
}
```
- 400 BAD REQUEST, if given arguments are incorrect
- 500 INTERNAL SERVER ERROR, if something goes wrong

### Joining events / Registering for existing events
```
POST /event/join

Authorization: "Bearer <jwt>"

{
    name: string,
    date: string of format "YYYY-MM-DDTHH:mm"
}
```

Returns:
- 200 OK, if successful
- 400 BAD REQUEST, if given arguments are incorrect
- 500 INTERNAL SERVER ERROR, if something goes wrong