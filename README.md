**Project Overview:**
This project (TaskPilot) is a Task Management Application that allows users to register, log in, and manage tasks through a REST API built with Express.js and connected to a PostgreSQL database. It also includes features like task creation, task listing, task updating, and task deletion. The application uses JWT (JSON Web Tokens) for user authentication and bcrypt for password hashing. The search functionality is managed using Redux, allowing state management across components. The backend is deployed on Render, and the frontend is deployed on Netlify.

Key Features:

**User Authentication:**

Sign Up and Login features with secure JWT-based authentication.
JWT token used for authenticating requests to protected routes, like adding or viewing tasks.

**Task Management:**

Add Task: Authenticated users can create tasks.

Fetch Tasks: Retrieve all tasks assigned to the user.

Delete Task: Remove tasks from the database.

View Task: View detailed information for a specific task.

Update Task: Modify existing tasks.

**Search Functionality with Redux:**

Users can search for tasks using a search input.
The search query is stored in the Redux store, and the tasks are filtered based on this query in the frontend.

**Detailed Code Breakdown:**

**1. Authentication Routes:**

Register (POST /register):

Accepts user details (name, email, password), checks if the user exists, hashes the password using bcrypt, and stores the user in the database.
Sends a success message if the registration is successful or an error if the user already exists.

Login (POST /login):

Accepts email and password, finds the user in the database, compares the password using bcrypt, and generates a JWT token if the credentials are correct.
Sends the user data along with the JWT token on successful login.

JWT Authentication Middleware:

The authenticateToken middleware ensures that routes like task creation, updating, and deleting are protected by validating the JWT token passed in the Authorization header.

**2. Task Management Routes:**

Add Task (POST /tasks):

Authenticated users can create tasks with a title, description, status, and userId.
If successful, the task is added to the database, and a success message is returned.

Fetch Tasks (GET /tasks/:userId):

Fetches all tasks associated with the provided userId. This route is protected by the JWT middleware to ensure only authenticated users can access their tasks.

View Task (GET /task/:id):

Fetches a single task by its ID. Returns an error message if the task does not exist.

Update Task (PUT /tasks/:id):

Updates an existing task. Users can update the task's title, description, and status. This route also uses the JWT middleware to verify the user.

Delete Task (DELETE /tasks/:id):

Deletes a task by its ID. If the task is successfully deleted, a confirmation message is returned.

**Task Flow:**

**User Registration:**

A new user registers by providing their name, email, and password. The password is hashed and stored in the database.

**User Login:**

After logging in with their credentials, the user receives a JWT token that allows them to authenticate subsequent requests.

**Task Management:**

The user can perform CRUD (Create, Read, Update, Delete) operations on tasks.
They can add tasks with a title, description, and status, and view or update their existing tasks.

**JWT Token:**

The token is used to authenticate the user on protected routes, ensuring that users can only modify their own tasks.

**Setup Instructions:**

**Prerequisites:**

Node.js (version 14 or higher)

PostgreSQL for database

npm for managing dependencies

Fork and Clone the Repository:

git clone <repository_url>

cd <project_directory>

**Install Dependencies:** Run the following command to install all necessary dependencies:

       npm install
       
**Setup Database:**

Ensure you have PostgreSQL installed and running.
Create a database and set up the necessary tables (users, tasks).
Use the following SQL to create the users and tasks tables:

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255)
);

CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  status VARCHAR(50),
  userId INTEGER REFERENCES users(id)
);

**Start the Backend Locally:** If you want to run the backend locally:

     node server.js
     
The server will start running on http://localhost:5000.

**Start the Frontend Locally:** If you want to run the frontend locally:

Navigate to the frontend directory and install dependencies:

		npm install
  
Run the frontend:

	npm run dev

The frontend will be accessible at http://localhost:5173


1. Sign up/ Login page
![image](https://github.com/user-attachments/assets/13c542db-f2a7-428d-b2ec-eb932d68342c)
2. Dashboard
   ![image](https://github.com/user-attachments/assets/1a538498-55f0-41b8-a95f-fa546f3c0c14)
3. Task Detail page
   ![image](https://github.com/user-attachments/assets/2c471a11-d08d-46ba-9720-aaac31841e9d)

4. Task add/ update page
   
![image](https://github.com/user-attachments/assets/d1b561c3-2a21-46b0-8daa-2dfc91558177)

5. Search functionality
   ![image](https://github.com/user-attachments/assets/142a4622-b313-4efc-ab29-6935603b3543)
6. User profile page
   ![image](https://github.com/user-attachments/assets/25b251df-3dc2-48b6-b394-0aeff1ff3796)



**Conclusion:**
This project is a full-stack task management system with user authentication and task management functionality. The backend is built using Express.js, PostgreSQL, JWT, and bcrypt to manage users, tasks,
and secure API endpoints. It offers functionality for user registration, login, task creation, and task management, with a focus on security using JWT for authentication.
