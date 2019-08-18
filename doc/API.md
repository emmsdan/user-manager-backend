# users-manager-backend

## API DOCUMENTATIONS

## Create a developer/admin account
### REQUEST
`POST`:  `\api\v1\account\register`
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

## Confirm developer/admin account
### REQUEST
`POST`: `\api\v1\account\confirm-signup`
```Javascript
{
  company: 'Emmsdan Inc',
  password: 'd567/&%$hbsvfga<>el',
  email: 'raoul.emmsdan@gmail.com',
  token: '$2b$08$CAjxIQTTqcUjwwpT911lK.q8rFhmHQ/XmsW6rrEKicDFRnnboPOL.',
}
```
### RESPONSES
#### SUCCESS
```Javascript
{
    "type": "success",
    "message": "Account Activated. Please, Login.",
    "statusCode": "200",
    "data": {
        "id": "07fbb307-149a-4364-9ce0-dfacfd29b1ac",
        "updatedAt": "2019-08-08T19:43:50.618Z",
        "firstName": "Raoul",
        "lastName": "Gislason",
        "email": "raoul.emmsdan@gmail.com",
        "company": "EmmsDan Inc",
        "role": "DEVELOPER",
        "isActive": true
    }
}
```

## Forgot Password
### REQUEST 
`POST`: `\api\v1\account\login-reset`
```Javascript
{
  email: 'raoul.emmsdan@gmail.com',
}
```
### RESPONSES
#### SUCCESS
```Javascript
{
    "type": "success",
    "message": "Please check your inbox and click the link.",
    "statusCode": "200",
}
```

## Request One Time Login
### REQUEST 
`POST`: `\api\v1\account\login-reset`
```Javascript
{
    email: 'raoul.emmsdan@gmail.com',
}
```
### RESPONSES
#### SUCCESS
```Javascript
{
    "type": "success",
    "message": "Please check your inbox and click the link.",
    "statusCode": "200",
}
```

## Change Password
### HEADERS 
`POST`: `\api\v1\account\change-password`
```Javascript
{
    accessToken: 'iofnwionj3reoivreinf.fgindsfjkdsnflksdfds.ffo3ur', // from email url
}
```
### REQUEST 
`POST`: `\api\v1\account\change-password`
```Javascript
{
    password: '9djin23jn',
}
```
### RESPONSES
#### SUCCESS
```Javascript
{
    "type": "success",
    "message": "Your password has been changed successfully.",
    "statusCode": "200",
}
```
#### ERRORS
```Javascript
{
    "type": "error",
    "message": "You can't use your current or last 2 password.",
    "statusCode": "200",
    "error": ""
}
```

#### GENERIC ERRORS

| **jwt/token error**
```javascript
{
    "type": "error",
    "message": "Invalid token/url, provided.",
    "statusCode": "401"
}
```

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
    "message": "This is a server error. It's not your fault but the server.",
    "statusCode": "500",
    "errorCode": "1501"
}
```
