# Little Chef Database Interface

## Overview

This project provides a simple web-based interface to interact with the Little Chef MySQL database. It demonstrates basic database operations through a Node.js backend and a lightweight HTML frontend.

## Features

* Connects Node.js backend to MySQL database
* Implements CRUD operations (Create, Read, Update, Delete)
* Provides a simple GUI to interact with the `cuisine` table
* Supports search functionality

## Tech Stack

* Node.js
* Express
* MySQL
* HTML + JavaScript (Fetch API)

## Setup Instructions

1. Install dependencies:

```
npm install
```

2. Create a `.env` file in the root directory:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=little_chef
PORT=3001
```

3. Start the backend server:

```
node --env-file=.env index.js
```

4. Open `index.html` in your browser to use the GUI.

## Notes

* This implementation currently focuses on the `cuisine` table for demonstrating CRUD operations.
* Additional tables can be added using the same structure if needed.
* The project is designed to satisfy assignment requirements for database interaction via a GUI.
