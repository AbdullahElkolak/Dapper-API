# Dapper

A social networking, photo-sharing app developed with Express.js.

Node provides the RESTful API. React provides the frontend and accesses the API, the React front-end is at https://github.com/kudzai3/Dapper-React.git. MongoDB stores like a hoarder.

## Requirements

- [Node and npm](http://nodejs.org)
- MongoDB: Make sure you have your own local or remote MongoDB database URI configured in `config/env/development.js`

## Installation

1. Clone the repository: `git clone https://github.com/kudzai3/Dapper-API.git`
2. Install the application: `npm install`
3. Place your own MongoDB URI in `config/env/development.js`, also configure other environment variables
3. Start the server: `node server.js`
