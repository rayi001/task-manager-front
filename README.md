# TaskSphere Frontend

A modern, responsive task management application built with React and Tailwind CSS.

## User Story 9: React Frontend Application Creation

This frontend application implements User Story 9, providing a complete web interface for the TaskSphere task management system.

## Features

- **User Authentication**: Login, Register, Profile management
- **Task Management**: Create, Read, Update, Delete tasks
- **Task Status Tracking**: To Do, In Progress, Completed
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Clean, intuitive interface with Tailwind CSS
- **Real-time Updates**: Instant task status changes
- **Dashboard**: Overview of task statistics

## Tech Stack

- **Frontend**: React 18.2.0
- **Routing**: React Router DOM 6.8.0
- **Styling**: Tailwind CSS 3.3.0
- **HTTP Client**: Axios 1.4.0
- **State Management**: React Context API + useReducer

## Project Structure

```
task-manager-front/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Dashboard.js
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── Profile.js
│   │   ├── TaskList.js
│   │   ├── TaskForm.js
│   │   ├── TaskDetail.js
│   │   └── Navbar.js
│   ├── contexts/
│   │   ├── AuthContext.js
│   │   └── TaskContext.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend API running on http://localhost:8000

### Installation

1. Clone the repository:
```bash
git clone https://github.com/rayi001/task-manager-front.git
cd task-manager-front
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open http://localhost:3000 in your browser

## API Integration

The frontend connects to the Django REST API backend:

- **Base URL**: http://localhost:8000/api/
- **Authentication**: JWT tokens
- **Endpoints**: All CRUD operations for tasks and user management

## Pages

- **/login**: User login
- **/register**: User registration
- **/dashboard**: Task overview dashboard
- **/tasks**: Task list with filters
- **/tasks/new**: Create new task
- **/tasks/:id**: Task details
- **/tasks/:id/edit**: Edit task
- **/profile**: User profile

## Features

### Authentication
- User registration with validation
- Secure login with JWT tokens
- Persistent login state
- Profile management
- Logout functionality

### Task Management
- Create tasks with title, description, status
- View task list with status badges
- Edit existing tasks
- Delete tasks with confirmation
- Filter tasks by status
- Real-time task updates

### UI/UX
- Responsive design for all devices
- Loading states and error handling
- Smooth animations and transitions
- Intuitive navigation
- Modern card-based layout

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
