# Expense Tracker
Track your expenses with ease using this mobile-friendly app, designed to give you clear insights into your financial habits.

## Features
* Mobile-Friendly Design: Accessible and intuitive interface for on-the-go expense tracking.
* User Authentication: Secure login and signup with session management using cookies.
* Session Storage: User data stored as a session in MongoDB for enhanced security and performance.
* GraphQL-Powered Backend: Built with Apollo Server for efficient data querying and mutations.
* Expense Tracking: Create, read, update, and delete (CRUD) user accounts and transaction records.
* Dynamic Charts: Visual representation of categorized expenses, fetching data dynamically from the server.

## Tech Stack
### Frontend
- React.js with Vite: Dynamic and responsive user interface.
- Apollo Client: Handles GraphQL queries and mutations for efficient data fetching.
### Backend
- Node.js with Express: RESTful API setup alongside GraphQL endpoints.
- Apollo Server: Powerful GraphQL server implementation.
### Database
- MongoDB: Stores user data, sessions, and transactions.
### Authentication
- Passport.js: Handles user authentication with cookies for session management.
- bcrypt: Password hashing for secure storage.

### Deployed website link
  https://graphql-expense-tracker-dnei.onrender.com/login
  
Please note! Since the app hosted on a free plan on Render after 15min inactivity the web service can take up to a minute to get back online 
