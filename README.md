This project is a full-stack blog application with CRUD (Create, Read, Update, Delete) operations, user authentication, and security measures such as cookies, CSRF protection, authorization, and authentication.

Getting Started
Clone the Repository:
git clone <repository-url>

Navigate to the Server Directory:
cd server

Install Dependencies:
npm install

Set Up Environment Variables:
Create a .env file in the server directory and add the following variables:

PORT=3000
DATABASE_USER=<database-user>
DATABASE_HOST=<database-host>
DATABASE_PASSWORD=<database-password>
DATABASE_NAME=<database-name>
DATABASE_PORT=<database-port>
TOKEN_USER_SECRET=<token-user-secret>
SECRET_COOKIE_KEY=<secret-cookie-key>
SENDER_EMAIL=<sender-email>
SENDER_PASSWORD=<sender-password>
MAIL_HOST=<mail-host>
MAIL_PORT=<mail-port>

Run the Backend:
nodemon index.js

Run the Frontend:
live-server

Features
User authentication with secure session management and password hashing.
CRUD operations for managing blog posts.
CSRF protection to prevent Cross-Site Request Forgery attacks.
Authorization checks to restrict access to certain routes or actions based on user roles.
Secure storage of sensitive information such as passwords and tokens.
Integration with Nodemailer for sending emails (e.g., password reset emails).

Contributing
Contributions are welcome! Feel free to open issues or pull requests for any improvements or features you'd like to see added to the project.

License
This project is licensed under the MIT License.
