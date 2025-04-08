# Task Management Application

A full-stack MERN application for managing tasks with user authentication and real-time updates.

## Features

- User Authentication (Register/Login)
- Task Management (CRUD operations)
- Task Categories and Priorities
- Due Dates and Reminders
- Task Filtering and Search
- Responsive Design

## Tech Stack

- **Frontend**: React, TypeScript, Material-UI
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB
- **Authentication**: JWT

## Project Structure

```
mern-capstone/
├─ backend/
│   ├─ src/
│   │   ├─ controllers/
│   │   ├─ models/
│   │   ├─ routes/
│   │   ├─ middleware/
│   │   └─ server.ts
│   ├─ package.json
│   └─ tsconfig.json
├─ frontend/
│   ├─ src/
│   │   ├─ components/
│   │   ├─ pages/
│   │   ├─ services/
│   │   └─ App.tsx
│   ├─ package.json
│   └─ tsconfig.json
└─ README.md
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd mern-capstone
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

4. Create a `.env` file in the backend directory:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/task-manager
   JWT_SECRET=your-secret-key
   ```

5. Start the development servers:

   Backend:
   ```bash
   cd backend
   npm run dev
   ```

   Frontend:
   ```bash
   cd frontend
   npm start
   ```

## API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Task Endpoints

- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/:id` - Get a single task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details

---

# Week 8: Capstone Project Guidelines

## Project Overview

This Task Management Application is the final project for the MERN stack development course. It demonstrates the implementation of:

- Full-stack development with MERN
- Project planning and architecture
- Authentication and authorization
- CRUD operations
- Modern UI/UX practices
- Deployment best practices

## Evaluation Criteria

The project will be evaluated based on:

- **Functionality (30%)** – All core features are working as expected
- **Code Quality (20%)** – Well-structured, maintainable TypeScript code
- **UI/UX (20%)** – Clean, responsive, and user-friendly interface
- **Documentation (15%)** – Comprehensive README and API documentation
- **Presentation (15%)** – Clear project demonstration

## Implementation Timeline

| Milestone            | Description                                  | Status     |
| -------------------- | -------------------------------------------- | ---------- |
| Project Setup        | Initialize MERN stack with TypeScript        | Completed  |
| Backend Development  | Auth & Task API implementation               | Completed  |
| Frontend Development | UI components and API integration            | In Progress|
| Testing & Debugging  | Unit and integration tests                   | Pending    |
| Deployment           | Deploy on Vercel/Render                      | Pending    |
