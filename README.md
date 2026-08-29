# NotSoLucky — Server

This repository contains the Express and MongoDB API for [NotSoLucky](https://github.com/Julianrussmeyer/not-so-lucky-client), an educational German Lotto 6aus49 simulator. The application helps users explore the long-term cost and low probability of lottery play without spending real money.

## Features

- Register and log in with a username or email
- Hash passwords before storing them
- Authenticate protected requests with JSON Web Tokens
- Create, read, update, and delete user-owned Lotto tickets
- Limit each user to six saved tickets
- Validate lottery selections, Supernumber, frequency, and duration
- Simulate Lotto 6aus49 draws for periods of up to 100 years
- Calculate ticket costs, winnings, and profit or loss
- Accumulate simulation statistics for each user
- Prevent users from accessing or changing another user's tickets

## Tech stack

- Node.js
- Express
- MongoDB and Mongoose
- JSON Web Tokens
- bcryptjs
- CORS
- Morgan
- dotenv

## Getting started

### Requirements

- Node.js
- npm
- A MongoDB database

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Julianrussmeyer/not-so-lucky-server.git
   cd not-so-lucky-server
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the project root:

   ```env
   PORT=5005
   MONGODB_URL=your-mongodb-connection-string
   TOKEN_SECRET=your-secret-key
   ```

   Replace the example values with your own configuration. Do not commit the `.env` file.

4. Start the development server:

   ```bash
   npm run dev
   ```

The API health check is available at `GET /health`.

## Available scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the server with Nodemon |
| `npm start` | Start the server with Node.js |

## API overview

### Authentication and user statistics

| Method | Route | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/auth/signup` | Public | Create an account |
| `POST` | `/auth/login` | Public | Log in and receive a token |
| `GET` | `/auth/verify` | Protected | Verify a token and return its user |
| `GET` | `/auth/stats` | Protected | Return the user's accumulated statistics |

### Lotto tickets

All Lotto ticket routes require a valid bearer token.

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/games/lotto-6of49/tickets` | Return the user's tickets |
| `POST` | `/games/lotto-6of49/tickets` | Create a ticket |
| `GET` | `/games/lotto-6of49/tickets/:ticketId` | Return one ticket |
| `PATCH` | `/games/lotto-6of49/tickets/:ticketId` | Update a ticket |
| `DELETE` | `/games/lotto-6of49/tickets/:ticketId` | Delete a ticket |
| `POST` | `/games/lotto-6of49/tickets/:ticketId/simulate` | Simulate a saved ticket |

Send protected requests with an authorization header in this format:

```text
Authorization: Bearer <token>
```

## Related repository

- [NotSoLucky client](https://github.com/Julianrussmeyer/not-so-lucky-client)

## Project context

NotSoLucky was built as the final project for Ironhack's Web Development Part-Time course. It is an educational simulation and does not support real-money gambling.
