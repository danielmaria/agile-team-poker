# Agile Team Poker Online - Backend

This is the backend for Agile Team Poker Online, a web-based application for agile teams to estimate tasks in a collaborative and structured manner. The backend is built with **Express.js** and uses **UUID** for generating unique room identifiers. It supports RESTful APIs for managing rooms, players, and rounds, with server-sent events (SSE) for real-time updates.

## **Table of Contents**
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Technologies](#technologies)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## **Features**
- **Room Management**: Create and manage game rooms for multiple players.
- **Real-time updates**: Players are updated in real time using Server-Sent Events (SSE).
- **Rounds and Movements**: Organizers can start rounds, players can submit their estimations, and all moves are stored and broadcast to other players.
- **In-memory storage**: All data is stored in memory for simplicity (no database).
- **Report generation**: Tracks player movements and round history, enabling a full history of the estimation session.

## **Installation**

### **Prerequisites**
- Node.js (>= 12.x)
- npm or yarn

### **Steps**

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/agile-team-poker-backend.git
   cd agile-team-poker-backend
    ```

2. Install dependencies: Using npm:
`npm install`

3. Run the server: Using npm:
`npm start`

## **Usage**
The backend serves as an API that facilitates real-time communication for estimation sessions, allowing users to create rooms, join them, and submit votes. Data is broadcast to all participants using Server-Sent Events (SSE).

1. Create a Room
The organizer creates a room by sending a POST request to /rooms.
This generates a unique room identifier (UUID) and the organizer's profile is stored.

2. Join a Room
Players join a room using the room's unique identifier by sending a POST request to /rooms/:roomHash/players.
Players provide their name, and they are added to the room's participant list.

3. Start and Play Rounds
The organizer can start a round by posting to /rooms/:roomHash/rounds with the subject to estimate.
Players submit their estimates (mood and future predictions) for the round, which is broadcast to all participants.

## **API Endpoints**
Rooms
Create Room: POST /rooms

Body: { organizerName, profile, password }
Returns: { roomHash }
Join Room: POST /rooms/:roomHash/players

Body: { playerName, profile, password }
Returns: { message: "Joined room successfully" }
Get Room History: GET /rooms/:roomHash

Returns: Full event history for the specified room.
Rounds
Start Round: POST /rooms/:roomHash/rounds

Body: { organizerName, subjectId, password }
Starts a new round for estimation.
Submit Move: POST /rooms/:roomHash/rounds/:subjectId/moves

Body: { playerName, future, mood }
Players submit their estimations for the current round.
Close Round: PATCH /rooms/:roomHash/rounds/:subjectId

Body: { organizerName, password }
Closes the round, preventing further moves.
Events (SSE)
Real-time Updates: GET /rooms/:roomHash/events
Query params: ?playerName=<playerName>
Opens a connection for real-time updates via Server-Sent Events (SSE).
Subjects
Get All Subjects: GET /subjects
Returns a list of all subjects available for estimation.

## **Technologies**

This backend is built using the following technologies:

- Express.js: Web framework for Node.js.
- UUID: For generating unique identifiers for rooms.
- Server-Sent Events (SSE): To push real-time updates to clients.