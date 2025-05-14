# CleanSmart Backend

Node.js backend server for the CleanSmart Android app.

## Setup

1. Install dependencies:
```
npm install
```

2. Create a `.env` file in the root directory with:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

3. Start the server:
```
npm start
```

For development:
```
npm run dev
```

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login a user
- `POST /api/auth/logout` - Logout a user
- `DELETE /api/auth/delete-account` - Delete user account and all associated data

#### Delete Account

```
DELETE /api/auth/delete-account
```

Request body:
```json
{
  "email": "user@example.com",
  "password": "user_password",
  "confirmation": "DELETE"
}
```

Response:
```json
{
  "success": true,
  "message": "Your account has been successfully deleted"
}
```

Error Response:
```json
{
  "success": false,
  "message": "Error message details"
}
```

Notes:
- The 'confirmation' field with value 'DELETE' is required to prevent accidental account deletion
- All associated data including task groups and tasks will be permanently deleted
- Requires user authentication with valid email and password

### Task Groups

#### 1. Get Task Groups by User ID

```
GET /api/taskGroups/{userId}
```

Response:
```json
{
  "success": true,
  "taskGroups": [
    {
      "id": "string",
      "userId": "string",
      "areaName": "string",
      "imageBase64": "string",
      "tasks": ["string"],
      "progress": 0,
      "dateCreated": 0
    }
  ]
}
```

#### 2. Create Task Group

```
POST /api/taskGroups
```

Request body:
```json
{
  "taskGroup": {
    "userId": "string",
    "areaName": "string",
    "imageBase64": "string",
    "tasks": ["string"],
    "progress": 0,
    "dateCreated": 0
  }
}
```

Response:
```json
{
  "success": true,
  "taskGroup": {
    "id": "string",
    "userId": "string",
    "areaName": "string",
    "imageBase64": "string",
    "tasks": ["string"],
    "progress": 0,
    "dateCreated": 0
  }
}
```

#### 3. Update Task Group Progress

```
PUT /api/taskGroups/{taskGroupId}
```

Request body:
```json
{
  "progress": 50
}
```

Response:
```json
{
  "success": true,
  "taskGroup": {
    "id": "string",
    "userId": "string",
    "areaName": "string",
    "imageBase64": "string",
    "tasks": ["string"],
    "progress": 50,
    "dateCreated": 0
  }
}
```

#### 4. Delete Task Group

```
DELETE /api/taskGroups/{taskGroupId}
```

Response:
```json
{
  "success": true,
  "message": "Task group deleted successfully"
}
```

### Tasks

#### 1. Delete Task

```
DELETE /api/tasks/{taskGroupId}/{taskIndex}
```

Response:
```json
{
  "success": true,
  "message": "Task deleted successfully",
  "taskGroup": {
    "id": "string",
    "userId": "string",
    "areaName": "string",
    "imageBase64": "string",
    "tasks": ["string"],
    "progress": 0,
    "dateCreated": 0
  }
}
```

You can also use the alternative endpoint:
```
DELETE /api/taskGroups/{taskGroupId}/tasks/{taskIndex}
```

## Notes

- The server runs on port 5000 by default
- CORS is enabled to allow connections from the Android app
- For Android emulators or physical devices, connect to the server using your local IP address (192.168.1.9:5000) 