# Scale

## Visit The Site

Check it out [here :)](https://scale-kappa.vercel.app/)

--- 

- ## Dashboard
<img width="1446" height="796" alt="Screenshot 2026-07-14 at 5 52 48 PM" src="https://github.com/user-attachments/assets/f547d694-94fd-4a90-bae6-a4c50cccaa35" />


- ## Logbook
<img width="1451" height="797" alt="Screenshot 2026-07-16 at 12 03 08 AM" src="https://github.com/user-attachments/assets/8cf0c1c4-9a9b-4361-8935-cfd3580ea653" />

- ## Projects Page
<img width="1447" height="738" alt="Screenshot 2026-07-16 at 12 03 56 AM" src="https://github.com/user-attachments/assets/4d9b2bac-a1a3-4fc8-90e6-3abafbc5cc13" />

- ## Analytics (includes more than this!)
<img width="1444" height="792" alt="Screenshot 2026-07-16 at 12 04 30 AM" src="https://github.com/user-attachments/assets/372594ea-d527-4b04-b7f3-fa74839d2b33" />



---

## Introduction

Scale is a full-stack climbing logbook built to help climbers track sessions, projects, and long-term progress. I created it to replace scattered notes and spreadsheets with a clean, notebook-inspired interface designed specifically for climbing. The project has given me hands-on experience building a complete MERN application with authentication, data visualization, CRUD functionality, and responsive design.

---

## Features

- **Dashboard:** Personalized dashboard displaying weekly climbing statistics, hours on the wall, active projects, recent climbs, and local weather conditions.

- **Logbook:** Record and organize climbing sessions with details including location, duration, notes, and individual climbs.

- **Session Management:** Create, edit, and delete sessions while logging each climb with its grade, type, attempts, result, and notes.

- **Projects:** Track ongoing climbing projects separately from regular sends. Mark projects as completed, undo completed projects, and maintain a history of long-term accomplishments.

- **Analytics:** Visualize climbing progress with interactive charts showing grade progression, grade distribution, climbing volume, weekly trends, send rate, favorite climbing styles, and project success.

- **Dark Mode:** Complete light and dark mode support powered by CSS variables and Tailwind CSS, with all pages and charts adapting automatically.

- **Responsive Layout:** Designed to work across desktop, tablet, and mobile devices while maintaining a clean reading experience.

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
---

## Deployment

Frontend:
- Vercel

Backend:
- Render

Database:
- MongoDB Atlas
---

## How to Run Locally

### Prerequisites

Install:
- Node.js
- npm
- MongoDB

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

---

Thanks for checking out **Scale**! I'm continually adding new features and improving the climbing experience. If you have suggestions or feedback, feel free to reach out or open an issue.
