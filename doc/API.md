# users-manager-backend

## API DOCUMENTATIONS

## Create a developer/admin account
### REQUEST
`\api\v1\account\register`
```Javascript
{
  firstName: 'emmanuel', \\ alphabets only,
  lastName: 'daniel', \\ alphabets only,
  email: 'emmsdan.inc@gmail.com',
  role: 'ADMIN', \\ two roles [ADMIN, DEVELOPER]
}
```
### RESPONSES
#### SUCCESS
```Javascript
{
    "message": "Hi, follow the link sent to your email, to activate your account.",
    "statusCode": "201",
    "data": {
        "id": "a0071e6c-849d-42e3-83db-e86810b293a3",
        "createdAt": "2019-08-04T12:38:29.062Z",
        "updatedAt": "2019-08-04T12:38:29.062Z",
        "firstName": "emmanuel",
        "lastName": "daniel",
        "email": "emmsdan.inc@gmail.com",
        "role": "ADMIN",
        "isActive": false
    }
}
```
#### ERRORS

| **validation error**
```Javascript
{
    "message": "Invalid credentials.",
    "statusCode": "422",
    "error": [
        {
            "email": [
                "A user with this email already exist."
            ]
        }
    ]
}
```

| **server error**
```Javascript
{
    "message": "This is a server error. It's not your failt but the server.",
    "statusCode": "500",
    "errorCode": "1501"
}
```
