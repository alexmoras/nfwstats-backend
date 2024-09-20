# NFWStats Backend
API backend for NFW MS SQL database.

The NFWStats Backend exposes an API for the NFW MS SQL database, allowing applications to query the database through an easy to use REST API.

This is very much a work-in-progress and simply a "translation layer" at the moment for the frontend, which is the main project.

## Available Features / DB Tables
- **MatchingEvents**  
  This is the "processing stats" table which shows how many faces have been seen by the system.

## API Structure

| URL | METHOD | USE CASE |
| --- | --- | --- |
| /processing-stats | GET | Returns the current "MatchingEvents" table value. Used to establish number of faces seen by system. |
| /processing-stats | DELETE | Truncates the "MatchingEvents" table, resetting a deployment. |
| /database | GET | Returns the current `backend -> database` connection status. |
| /database | POST | Initialises a new connection to the database. |

## Config
The configuration file used by the API server, stored in a `.env` file at the root of the directory.

| Key | Example | Description |
| --- | --- | --- |
| DB_USER | "Admin" | Database username - must be manually created |
| DB_PASS | "@Password1" | Database password - set at time of user creation |
| DB_HOST | "localhost\\SQLEXPRESS" | Database server URL (for SQL EXPRESS installs, the instance must be included and use double back-slashes) |
| DB_NAME | "Watch" | Database name - for most installs, this will be "Watch" |

## Get Started
The backend (and frontend) is deployed in Docker meaning it can run anywhere. Its as simple as installing the runtime, building the image, and spinning it up. I'll walk you through that now...

### Prerequisites
Docker. That's it. Oh, and well obviously an NFW server.
1. Docker and Docker Compose installed on the NFWStats host.
2. NFWStats user created in the NFW Microsoft SQL database server.  
   By default, NFW is installed with Microsot SQL Express and uses basic Windows Authentication. This means that it uses the local Windows account. To be able to connect remotely, you need to create a user in the database with the correct permissions for the relevant tables (I used Microsoft SQL Studio to do this).

### Steps
1. Clone the git repo in to a location where you want the server files to be stored with `git clone https://github.com/alexmoras/nfwstats-backend.git`.
2. Copy the example config file and modify it to reflect your setup by running `cp .env.example .env && nano .env`.
3. Lets start the server! Run `docker compose up -d`.
4. If all has gone well, the server is up and you should be able to see it by visiting `http://127.0.0.1:5000/database` in a web-browser.