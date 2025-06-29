# Library Management System

## Project Description

This project is a full-stack Library Management System built with a Flask backend and a React frontend. It allows users to manage books, users, and borrowing records efficiently. The backend provides a RESTful API, while the frontend offers a user-friendly interface to interact with the system.

## Live Demo

You can access the live version of the application here:  
[Library Management System Live](https://library-management-frontend-2hj1.onrender.com/)

## Features

- Manage books: add, edit, and delete book records.
- Manage users: add, edit, and delete user records.
- Borrow and return books with tracking of borrow records.
- Responsive and intuitive React frontend.
- RESTful API backend built with Flask.

---

## Setup

### Backend (server)

The `server/` directory contains all backend code built with Flask.

To install dependencies and activate the virtual environment, run:

```bash
pipenv install
pipenv shell
```

To start the Flask API server on [`localhost:5555`](http://localhost:5555), run:

```bash
python server/app.py
```

### Frontend (client)

The `client/` directory contains the React frontend application.

To install dependencies, run:

```bash
npm install --prefix client
```

To start the React development server on [`localhost:3000`](http://localhost:3000), run:

```bash
npm start --prefix client
```

---

## Database Setup

To generate the database and migrations, run the following commands inside the `server` directory:

```bash
flask db init
flask db upgrade head
```

You can seed the database by running the `seed.py` script:

```bash
python server/seed.py
```

---

## Usage

- Use the frontend React app to manage books, users, and borrow records.
- The backend API provides RESTful endpoints for all operations.

## License

This project is licensed under the MIT License.
