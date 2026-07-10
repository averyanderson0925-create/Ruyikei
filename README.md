# CRUD App

## Railway deployment

### Backend
- Create a Railway project for the backend service.
- Set the root directory to backend.
- Add these environment variables:
  - DATABASE_URL
  - JWT_SECRET
  - ADMIN_EMAIL
  - ADMIN_PASSWORD
  - ENCRYPTION_KEY
  - PORT

### Frontend
- Create a second Railway project for the frontend service.
- Set the root directory to client.
- Add these environment variables:
  - REACT_APP_API_URL=https://<your-backend-domain>/api
  - PORT

### Notes
- The backend uses PostgreSQL and will create the required tables automatically on startup.
- The frontend is configured to use the API URL from the environment variable.
