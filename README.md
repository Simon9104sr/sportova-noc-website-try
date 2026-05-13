# Sportova Noc - Sports Night Events Platform

A full-stack web application for organizing and participating in sports events.

## Features

- **User Authentication**: Register and login with email/password
- **Event Management**: Create, view, and browse sports events
- **Event Participation**: Join or leave events with participant tracking
- **User Profiles**: View user information and event history
- **Multiple Sports**: Support for various sports types (Football, Basketball, Tennis, etc.)

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MySQL** for database
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** for cross-origin requests

### Frontend
- **React 18**
- **React Router** for navigation
- **Axios** for API calls
- **CSS3** for styling

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- MySQL (v5.7+)
- npm or yarn

### Backend Setup

1. **Clone the repository and navigate to the backend**
   ```bash
   cd sportova-noc-website-try
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Create database**
   ```bash
   mysql -u root -p < db/schema.sql
   ```

4. **Configure environment variables**
   - Copy `.env` and update with your database credentials:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=sportova_noc
   JWT_SECRET=your_super_secret_jwt_key_change_this
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```

5. **Start the backend server**
   ```bash
   npm run dev
   ```
   Backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to client directory**
   ```bash
   cd client
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```
   Frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event details
- `POST /api/events` - Create new event (requires auth)
- `PUT /api/events/:id` - Update event (creator only)
- `POST /api/events/:id/join` - Join event (requires auth)
- `POST /api/events/:id/leave` - Leave event (requires auth)

## Usage

1. **Register/Login**: Create an account or login with existing credentials
2. **Browse Events**: View all available sports events on the homepage
3. **Create Event**: Click "Create Event" to organize a new sports night
4. **Join Events**: Click on an event and join as a participant
5. **View Participants**: See who's joining your events
6. **Manage Profile**: View your profile information

## Project Structure

```
sportova-noc-website-try/
├── server.js                 # Main server file
├── package.json             # Backend dependencies
├── .env                      # Environment variables
├── db/
│   ├── connection.js        # Database connection
│   └── schema.sql           # Database schema
├── routes/
│   ├── auth.js              # Authentication routes
│   └── events.js            # Event routes
├── middleware/
│   └── auth.js              # JWT verification middleware
└── client/
    ├── package.json         # Frontend dependencies
    ├── public/
    │   └── index.html       # HTML template
    └── src/
        ├── index.js         # React entry point
        ├── App.js           # Main React component
        ├── index.css        # Global styles
        ├── components/
        │   └── Navigation.js # Navigation component
        └── pages/
            ├── Login.js             # Login page
            ├── Register.js          # Register page
            ├── EventsList.js        # Events listing page
            ├── EventDetail.js       # Event details page
            ├── CreateEvent.js       # Create event page
            └── Profile.js           # User profile page
```

## Future Enhancements

- Event search and filtering
- Rating and review system
- Event categories and advanced filtering
- User messaging system
- Email notifications
- Admin dashboard
- Event images/gallery
- Map integration for location display

## License

ISC

## Support

For issues or questions, please open an issue in the repository.