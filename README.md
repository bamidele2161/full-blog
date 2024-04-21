This project is a full-stack blog application with CRUD (Create, Read, Update, Delete) operations, user authentication, and security measures such as cookies, CSRF protection, authorization, and authentication.

## Getting Started

Clone the Repository: <br>
`git clone <repository-url>`

Navigate to the Server Directory:<br>
`cd server`

Install Dependencies:<br>
`npm install`

### Set Up Environment Variables:

Create a .env file in the server directory using .env.example as the template:

### Run the Server:

`nodemon index.js`

From the root directory, navigate to the Client Directory:<br>
`cd client`

### Run the Client:

`live-server`

## Features

- User authentication with secure session management and password hashing.
- CRUD operations for managing blog posts.
- CSRF protection to prevent Cross-Site Request Forgery attacks.
- Authorization checks to restrict access to certain routes or actions based on user roles.
- Secure storage of sensitive information such as passwords and tokens.
- Integration with Nodemailer for sending emails (e.g., password reset emails).

## Contributing

Contributions are welcome! Feel free to open issues or pull requests for any improvements or features you'd like to see added to the project.

## License

This project is licensed under the MIT License.
