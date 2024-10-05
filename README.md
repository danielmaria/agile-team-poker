# Agile Team Poker

This monorepo contains both the **frontend** and **backend** of the Agile Team Poker Online application. It is designed to help agile teams estimate tasks collaboratively through a web-based interface. The frontend is built using **React** and hosted on **Surge**, while the backend is developed with **Express.js** and deployed via **Vercel**. We use **Firebase** as the database for storing session data.

## **Table of Contents**

- [Monorepo Architecture](#monorepo-architecture)
- [Technologies](#technologies)
- [Installation](#installation)
- [Pipeline Configuration](#pipeline-configuration)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## **Monorepo Architecture**

In this monorepo, both the frontend and backend projects coexist under a single repository. Each project is located in its own directory: `/frontend` for the React app and `/backend` for the Express.js server.

### **Frontend** (React, Surge):

- **Path**: `/frontend`
- **Deployment**: The frontend is automatically deployed to Surge whenever changes are pushed to the `main` branch or a tag is created. The Surge domain is configured in the deployment pipeline.

### **Backend** (Node.js, Vercel):

- **Path**: `/backend`
- **Deployment**: The backend is automatically deployed to Vercel via a scheduled cron job, ensuring it is always up to date without relying on commit triggers.

### **Database**:

- **Firebase**: The backend uses Firebase for storing data such as session information, player details, and round history.

## **Technologies**

- **Frontend**:
   - React.js for building the user interface
   - Material-UI for UI components
   - React Router for navigation
   - TypeScript for better type safety
   - Surge for deployment

- **Backend**:
   - Express.js for handling API requests
   - UUID for generating unique room identifiers
   - Server-Sent Events (SSE) for real-time updates
   - Firebase for data storage
   - Vercel for deployment

## **Installation**

To install and run both projects locally, follow these steps:

### **Prerequisites**

- Node.js (>= 12.x)
- npm or yarn

### **Steps**

1. Clone the repository:

```bash {"id":"01J9DYGCBPNKV2GZGX4F82MJTQ"}
git clone https://github.com/your-username/agile-team-poker-monorepo.git
cd agile-team-poker-monorepo
```

2. Install dependencies for both projects:

```bash {"id":"01J9DYGCBPNKV2GZGX4FZP6Y5C"}
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. Run the backend:

```bash {"id":"01J9DYGCBPNKV2GZGX4HYCM5R2"}
npm start
```

4. In another terminal, run the frontend:

```bash {"id":"01J9DYGCBPNKV2GZGX4MMDEHBW"}
cd ../frontend
npm start
```

## **Pipeline Configuration**

### **Frontend Pipeline**

The frontend pipeline is configured to automatically deploy the React application to Surge. It triggers on:

1. **Pushes to the `main` branch**: The application is rebuilt and deployed to a development Surge domain.
2. **Tag creation**: The application is deployed to the production Surge domain.

### **Backend Pipeline**

The backend pipeline operates on a **cron schedule**:

- **Deploy to Vercel**: The backend is deployed every weekday at 09:00 UTC.
- **Stop Vercel Deployment**: The Vercel project is stopped daily at 20:00 UTC.

### **Working Directories**

Both pipelines use `working-directory` settings to ensure the correct project is deployed:

- Frontend commands are executed in the `/frontend` directory.
- Backend commands are executed in the `/backend` directory.

## **Project Structure**

```bash {"id":"01J9DYGCBPNKV2GZGX4PCBY3VH"}
agile-team-poker/
├── backend/                  # Express.js backend code
│   ├── package.json
│   └── ...                   # Backend source files
├── frontend/                 # React frontend code
│   ├── package.json
│   └── ...                   # Frontend source files
├── .github/                  # GitHub Actions pipeline configuration
│   └── workflows/
│       ├── frontend-deploy.yml
│       ├── backend-deploy.yml
│       └── backend-stop.yml
├── README.md                 # Global readme (this file)
└── package.json              # Root-level package configuration 
```

## **License**

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
