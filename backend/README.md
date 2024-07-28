# TODO API for front-end task

This repository contains the backend for the TODO API. The API provides functionality for managing tasks with user authentication.

## Setup Instructions

1. **Clone Repository:** Clone this repository to your local machine.
2. **Install Dependencies:** Navigate to the project directory and create a virtual environment. Then, install the dependencies using the following commands:

   Create a new python virtual env

   ```python
   python3 -m venv .venv
   ```

   Activate the newly created virtual environment

   ```bash
   source .venv/bin/activate
   ```

   install the requirements

   ```bash
   pip install -r requirements.txt
   ```

3. **Run the Server:**

   ```bash
   python main.py
   ```

4. **Access API Documentation:**
   - Once the server is running, access the API documentation at `http://127.0.0.1:8000/docs`.

## API Routes

- **Signup:** `POST /signup`
  - Allows users to sign up by providing their email and password.
- **Login:** `POST /login`
  - Enables users to log in with their email and password.
- **Create Task:** `POST /create_task`
  - Creates a new task for the authenticated user.
- **Get Task:** `POST /get_task`
  - Retrieves tasks for the authenticated user.
- **Update Task:** `PUT /update_task`
  - Updates an existing task for the authenticated user.
- **Delete Task:** `DELETE /delete_task`
  - Deletes a task for the authenticated user.
- **Mark Task as Done:** `PUT /done_task`
  - Marks a task as complete for the authenticated user.

Use the provided credentials for testing the functionality of the TODO API.
