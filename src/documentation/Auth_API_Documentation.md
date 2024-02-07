# API Documentation

## Authentication Routes

### 1. Login

**Endpoint:** `/v1/auth/login`

**Method:** `POST`

**Description:** Authenticates a user by comparing the provided credentials with those stored in the database. If the credentials are valid, it returns a JWT token for accessing protected routes.

**Request Body:**

| Field    | Type   | Description          | Required |
| -------- | ------ | -------------------- | -------- |
| email    | String | User's email address | Yes      |
| password | String | User's password      | Yes      |

**Success Response:**

- **Code:** 200 OK
- **Content:**

```json
{
  "status": "ok",
  "message": "Login successful",
  "token": "jwt.token.here"
}
```

**Error Response:**

- **Code:** 401 Incorrect Password
- **Content:**

```json
{
  "status": "error",
  "error": {
    "code": 401,
    "message": "Incorrect password"
  }
}
```

Or

- **Code:** 404 Not Found
- **Content:**

```json
{
  "status": "error",
  "error": {
    "code": 404,
    "message": "User not found"
  }
}
```

Or

- **Code:** 500 Internal Server Error
- **Content:**

```json
{
  "status": "error",
  "error": {
    "code": 500,
    "message": "Server error"
  }
}
```

### 2. Register

**Endpoint:** `/v1/auth/register`

**Method:** `POST`

**Description:** Registers a new user with the provided details. It hashes the password before saving the user to the database.

**Request Body:**

| Field     | Type    | Description                | Required |
| --------- | ------- | -------------------------- | -------- |
| email     | String  | User's email address       | Yes      |
| password  | String  | User's password            | Yes      |
| firstName | String  | User's first name          | Yes      |
| lastName  | String  | User's last name           | No       |
| PSW       | Boolean | Indicates if user is a PSW | Yes      |

**Success Response:**

- **Code:** 201 Created
- **Content:**

```json
{
  "status": "ok",
  "message": "User registered successfully"
}
```

**Error Response:**

- **Code:** 400 Bad Request
- **Content:**

```json
{
  "status": "error",
  "error": {
    "code": 400,
    "message": "User already exists"
  }
}
```

Or

- **Code:** 500 Internal Server Error
- **Content:**

```json
{
  "status": "error",
  "error": {
    "code": 500,
    "message": "Error creating user"
  }
}
```


### 3. Verify Email

**Endpoint:** `/v1/auth/verifyemail`

**Method:** `PATCH`

**Description:** Verifies a user's email address using a token sent to the user's email. This route updates the user's email verification status in the database.

**Request Body:**

| Field | Type   | Description                    | Required |
|-------|--------|--------------------------------|----------|
| token | String | Token sent to the user's email | Yes      |

**Success Response:**

- **Code:** 200 OK
- **Content:**

```json
{
  "status": "ok",
  "message": "Email verified successfully"
}
```

**Error Response:**

- **Code:** 400 Bad Request
- **Content:**

```json
{
  "status": "error",
  "error": {
    "code": 400,
    "message": "No token provided"
  }
}
```

Or

- **Code:** 400 Bad Request
- **Content:**

```json
{
  "status": "error",
  "error": {
    "code": 400,
    "message": "Invalid or expired token"
  }
}
```

Or

- **Code:** 500 Internal Server Error
- **Content:**

```json
{
  "status": "error",
  "error": {
    "code": 500,
    "message": "Error verifying email"
  }
}
```

### 4. Password Reset Request

**Endpoint:** `/v1/auth/passwordreset`

**Method:** `POST`

**Description:** Initiates a password reset process by sending a reset token to the user's registered email address if the user is found.

**Request Body:**

| Field | Type   | Description          | Required |
|-------|--------|----------------------|----------|
| email | String | User's email address | Yes      |

**Success Response:**

- **Code:** 200 OK
- **Content:**

```json
{
  "status": "ok",
  "message": "Forgot password token created and sent to [user's email]"
}
```

**Error Response:**

- **Code:** 400 Bad Request
- **Content:**

```json
{
  "status": "error",
  "error": {
    "code": 400,
    "message": "No email provided"
  }
}
```

Or

- **Code:** 404 Not Found
- **Content:**

```json
{
  "status": "error",
  "error": {
    "code": 404,
    "message": "User not found"
  }
}
```

Or

- **Code:** 500 Internal Server Error
- **Content:**

```json
{
  "status": "error",
  "error": {
    "code": 500,
    "message": "Error sending email"
  }
}
```

### 5. Password Reset

**Endpoint:** `/v1/auth/passwordreset`

**Method:** `PATCH`

**Description:** Resets the user's password using the token sent to the user's email and a new password provided by the user.

**Request Body:**

| Field    | Type   | Description                           | Required |
|----------|--------|---------------------------------------|----------|
| token    | String | Token sent to the user's email        | Yes      |
| password | String | New password to set for the user      | Yes      |

**Success Response:**

- **Code:** 200 OK
- **Content:**

```json
{
  "status": "ok",
  "message": "Password reset successfully"
}
```

**Error Response:**

- **Code:** 400 Bad Request
- **Content:**

```json
{
  "status": "error",
  "error": {
    "code": 400,
    "message": "No token provided"
  }
}
```

Or

- **Code:** 400 Bad Request
- **Content:**

```json
{
  "status": "error",
  "error": {
    "code": 400,
    "message": "Invalid or expired token"
  }
}
```

Or

- **Code:** 500 Internal Server Error
- **Content:**

```json
{
  "status": "error",
  "error": {
    "code": 500,
    "message": "Error resetting password"
  }
}
```

### 6. Verify Password Reset Token

**Endpoint:** `/v1/auth/passwordreset`

**Method:** `GET`

**Description:** Verifies the validity of a password reset token before allowing a password reset operation. This step is crucial for front-end applications to ensure the token is valid and not expired.

**Query Parameters:**

| Parameter | Type   | Description                              | Required |
|-----------|--------|------------------------------------------|----------|
| token     | String | Token sent to the user's email for reset | Yes      |

**Success Response:**

- **Code:** 200 OK
- **Content:**

```json
{
  "status": "ok",
  "message": "Token is valid"
}
```

**Error Response:**

- **Code:** 400 Bad Request
- **Content:**

```json
{
  "status": "error",
  "error": {
    "code": 400,
    "message": "No token provided"
  }
}
```

Or

- **Code:** 400 Bad Request
- **Content:**

```json
{
  "status": "error",
  "error": {
    "code": 400,
    "message": "Invalid or expired token"
  }
}
```

Or

- **Code:** 500 Internal Server Error
- **Content:**

```json
{
  "status": "error",
  "error": {
    "code": 500,
    "message": "Error verifying token"
  }
}
```


## Notes

1. **Security Considerations:** Always use HTTPS to make API requests to ensure data privacy and security, especially for authentication routes and any operations involving sensitive user information.

2. **Rate Limiting:** Be aware of any rate limits that apply to the API endpoints. Exceeding these limits may result in temporary suspension of access to the API services.

3. **Authentication Tokens:** The JWT token provided upon successful authentication must be included in the `Authorization` header as a Bearer / JWT token for accessing protected routes. Example: `Authorization: JWT/Bearer <your_jwt_token_here>`.

4. **Token Expiry:** JWT tokens have an expiration time. Ensure that your application handles token expiry gracefully, prompting users to re-authenticate if necessary.

5. **Error Handling:** Pay close attention to the error codes and messages returned by the API. Proper error handling in your application will improve the user experience and aid in troubleshooting.

6. **Versioning:** The API endpoints are versioned (e.g., `/v1/auth/login`). It's important to use the correct version to ensure compatibility and access to the latest features.

7. **Data Validation:** Input data for requests should be validated on the client side to ensure it meets the API's expected format, reducing unnecessary requests and improving application efficiency.

8. **Deprecation Policy:** Keep an eye on the API documentation for any announcements regarding deprecated endpoints or features, and update your application to use the latest versions as needed.

9. **User Privacy:** Ensure that your application respects user privacy, complying with relevant laws and regulations regarding data protection and privacy, such as GDPR or CCPA.

10. **Feedback and Support:** If you encounter any issues or have suggestions for improving the API, contact the `pswprojectdevp@gmail.com`