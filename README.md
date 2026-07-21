
# Scale

---

## Introduction

Scale is a full-stack climbing logbook built to help climbers track sessions, projects, and long-term progress. I created it to replace scattered notes and spreadsheets with a clean, notebook-inspired interface designed specifically for climbing. The project has given me hands-on experience building a complete MERN application with authentication, data visualization, CRUD functionality, and responsive design, as well as backend architecture, testing, and deployment workflows.

---

## Visit The Site

Check it out [here](https://scale-kappa.vercel.app/)

--- 

- ## Dashboard
<img width="1448" height="796" alt="Screenshot 2026-07-16 at 5 45 24 PM" src="https://github.com/user-attachments/assets/fa060feb-15a1-423f-94d7-8dcc0e127559" />

- ## Logbook
<img width="1447" height="794" alt="Screenshot 2026-07-16 at 5 45 58 PM" src="https://github.com/user-attachments/assets/dc41e94d-dfb3-4f78-991b-ff70c43bc2b1" />

- ## Projects Page
<img width="1442" height="791" alt="Screenshot 2026-07-16 at 5 46 46 PM" src="https://github.com/user-attachments/assets/2aef79e6-f344-4afc-a506-1296698febdd" />

- ## Analytics (includes more than this!)
<img width="1443" height="797" alt="Screenshot 2026-07-16 at 5 47 07 PM" src="https://github.com/user-attachments/assets/2fd71431-b282-438f-b0f5-068eef41ead5" />

---

## Features

**Authentication:** 

- User registration and login
- JWT-based authentication
- Protected API routes
- Secure password hashing with bcrypt

**Climbing Logbook:** 
- Create and manage climbing sessions
- Record individual climbs within sessions
- Track:
  - Grade
  - Attempts
  - Status (attempt, project, send)
  - Notes
  - Tags
  - Location

**Progress Tracking:**
- Dashboard with climbing statistics
- Session history
- Project tracking
- Progress visualization through charts and analytics

**Dark Mode:** 
- Complete light and dark mode support powered by CSS variables and Tailwind CSS, with all pages and charts adapting automatically.

**Responsive Layout:** 
- Designed to work across desktop, tablet, and mobile devices while maintaining a clean reading experience.

**Demo Account:** 
- A demo account is available for recruiters and visitors to explore the application without creating an account. 

---

## Technologies Used

### Frontend
- React
- Vite
- Tailwind CSS v4
- React Router
- Recharts

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt

### DevOps / Testing
- Docker
- Docker Compose
- GitHub Actions
- Jest
- Supertest
- MongoDB Memory Server

### Deployment

Frontend:
- Vercel

Backend:
- Render

Database:
- MongoDB Atlas
---

## Architecture
```
Scale
│
├── client
│   └── React + Vite frontend
│
├── server
│   └── Express REST API
│
├── MongoDB
│   └── User, Session, and Climb data
│
└── GitHub Actions
    └── Automated testing and Docker builds
```
---

## API Testing
The backend includes automated integration tests covering:

- Health checks
- User registration
- User login
- Invalid authentication attempts
- Protected route authorization
- Complete climbing workflow:
  - Creating a session
  - Adding climbs
  - Retrieving climbing data

Tests are written with:

- Jest
- Supertest
- MongoDB Memory Server

Run tests locally:

```
cd server
npm install
npm test
```

---

## How to Run Locally

### Prerequisites

Install:
- Node.js
- npm
- MongoDB
- Docker (Optional)

### Clone the repository

```bash
git clone https://github.com/ashlygenaot/scale.git
cd scale
```

### Install dependencies

Frontend:

```bash
npm install
```

Backend:

```bash
cd server
npm install
```

### Configure environment variables

Create a `.env` file inside the server directory:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### Start the backend

```bash
npm run dev
```

### Start the frontend

```bash
npm run dev
```

### Open the app

Visit:

```
http://localhost:5173
```

## Running with Docker

Build and start the application:

```
docker compose up --build
```

Docker runs:

- React frontend container
- Express backend container
- Environment-based configuration

---
### CI/CD

Every push to the main branch triggers GitHub Actions to:

1. Install dependencies
2. Run backend tests
3. Build Docker images
4. Start application services
5. Verify application health

---

## Future Features I Would Add

- Outdoor crag database integration
- Route photos and beta videos
- Friend activity and shared sessions
- Personal records and milestone tracking
- Climbing goals and training plans
- CSV export and data backup
- Interactive climbing heatmaps

---

Thanks for checking out **Scale**! I'm continually adding new features and improving the climbing experience. If you have suggestions or feedback, feel free to reach out or open an issue.
