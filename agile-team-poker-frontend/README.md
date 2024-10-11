# **Agile Team Poker Online**

Agile Team Poker Online is a web-based application designed to help agile teams estimate tasks in a collaborative and fun way. Inspired by the [Agile Team Poker](https://dionatanmoura.com/2022/02/16/agile-team-poker-dbc-um-assessment-para-times-ageis/) approach, this app allows an organizer to create a room, invite players, and estimate tasks together. The game features customizable rooms, session management, and the ability to download game reports.

## **Table of Contents**
- [Demo](#demo)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Technologies](#technologies)

## **Demo**

You can check out a live demo of the app [here](https://danielmaria.github.io/agile-team-poker-frontend).

## **Features**

- Organize and manage estimation sessions in real-time.
- Create private rooms with unique hash links for players.
- Flexible session management: open, close, and reopen questions as needed.
- Players can join rooms with just their name—no password required.
- Generate and download detailed reports of all the votes.
- Mobile-friendly and responsive UI.

## **Installation**

To run this project locally, follow these steps:

### **Prerequisites**

- Node.js (>= 12.x)
- npm or yarn

### **Steps**

1. Clone the repository:

   ```bash
   git clone https://github.com/danielmaria/agile-team-poker.git
   cd agile-team-poker
   ```

2. Install dependencies: Using npm:

```bash
npm install
```

3. Run the application: Using npm:

```bash
npm start
```

## **Usage**

1. Creating a Room
The organizer creates a room by clicking the "Create Room" button and setting a password. The system generates a unique link to share with players.

2. Joining a Room
Players can join the room using the provided link. They must enter their name, which will be used to identify them in the game.

3. Playing the Game
The organizer opens a session for a specific question. Players select and submit their cards during the session. After closing the session, everyone's choices are revealed.

4. Reopening a Session
The organizer can reopen any question for reevaluation and restart the estimation process.

5. End of Game
After the game, the organizer can generate and download a detailed report of all the estimations.

## **Technologies**

This project was built using the following technologies:

- React: Front-end framework for building UI components.
Material-UI: For the user interface components and design.
- React Router: For handling navigation within the app.
- TypeScript: For type safety and better development experience.
