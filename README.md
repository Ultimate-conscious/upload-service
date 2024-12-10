# Upload Service

This is an upload service built with Node.js, Express, Prisma, and PostgreSQL. It allows users to sign up, log in, upload files, download files, and delete files. The service uses JWT for authentication and Multer for handling file uploads.

## Features

- User authentication (sign up, log in)
- File upload with size and type restrictions
- File download
- File deletion
- List all files for a user

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- npm (v6 or higher)

## Setup

1. Clone the repository:

    ```sh
    git clone https://github.com/your-username/upload-service.git
    cd upload-service
    ```

2. Install dependencies:

    ```sh
    npm install
    ```

3. Set up the environment variables:

    - Create a `.env` file in the root directory.
    - Copy the contents of `.env.example` into `.env`.
    - Update the values in `.env` with your configuration.

4. Set up the database:

    - Ensure PostgreSQL is running.
    - Update the `DATABASE_URL` in the `.env` file with your PostgreSQL connection string.
    - Run the Prisma migrations to set up the database schema:

    ```sh
    npx prisma migrate dev
    ```

5. Start the server:

    ```sh
    npm start
    ```

6. The server will be running at `http://localhost:3000`.

## API Endpoints

### User Routes

- `POST /user/signup`: Sign up a new user.
- `POST /user/login`: Log in an existing user.

### File Routes

- `POST /file/upload`: Upload a file (requires authentication).
- `GET /file/download/:fileId`: Download a file by ID (requires authentication).
- `DELETE /file/delete/:fileId`: Delete a file by ID (requires authentication).
- `GET /file/list`: List all files for the authenticated user.

## Further Improvements

- Improve error handling and validation.
- Add unit and integration tests.
- Implement rate limiting to prevent abuse.
- Add support for more file types.
- Implement a more graceful authentication middleware.
- Add user roles and permissions.
- Improve the user interface for file management.

## License

This project is licensed under the MIT License.