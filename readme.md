Here's the updated README with the live URL and repository URL included:

# Hello React Realtime Chat Application

## Overview

The Hello React Realtime Chat Application is a chat application built using React and Firebase. It allows users to register, log in, and engage in real-time chat conversations. The app uses Firebase for authentication, data storage, and real-time updates.

## Features

- User registration and login
- Real-time chat messaging
- Protected routes based on authentication state
- File and image attachments in chat messages
- User search functionality
- Chat history and message deletion

## Project Structure

The project is organized into several components and context providers to manage the state and functionality of the application.

### Components

1. **App.jsx**

   - Main component that sets up routing and context providers.
   - Protects routes using the authentication context.

2. **Home.jsx**

   - The main interface of the chat application.
   - Contains `Sidebar` and `Chat` components.

3. **Login.jsx**

   - Component for user login.
   - Uses Firebase authentication for user sign-in.

4. **Register.jsx**

   - Component for user registration.
   - Uses Firebase authentication for user sign-up and profile setup.

5. **Sidebar.jsx**

   - Contains user chat list and search functionality.
   - Displays user information and provides a logout option.

6. **Chat.jsx**

   - Displays the current chat conversation.
   - Contains `Messages` and `Input` components.

7. **Messages.jsx**

   - Displays a list of messages in the current chat.

8. **Message.jsx**

   - Individual message component.
   - Displays message text, images, and deletion option for the sender.

9. **Input.jsx**

   - Provides input fields for sending text, file, and image messages.

10. **Search.jsx**
    - Allows users to search for other users to start a chat.

### Context Providers

1. **AuthContext.jsx**

   - Manages user authentication state.
   - Provides the current user information to other components.

2. **ChatContext.jsx**
   - Manages the state of the current chat.
   - Provides chat data and dispatches actions to update the chat state.

### Firebase Configuration

The application uses Firebase for authentication, Firestore for data storage, and Firebase Storage for file and image uploads. The Firebase configuration is set up in `firebase.js`.

## Installation and Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/Abdul-Rahman-E/hello-react-chat.git
   cd hello-react-chat
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your Firebase configuration:

   ```env
   VITE_API_KEY=your_api_key
   VITE_AUTH_DOMAIN=your_auth_domain
   VITE_PROJECT_ID=your_project_id
   VITE_STORAGE_BUCKET=your_storage_bucket
   VITE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_APP_ID=your_app_id
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

## Usage

- Open the application in your browser.
- Register a new user account or log in with an existing account.
- Use the search bar to find other users and start a chat.
- Send text, files, and images in chat conversations.
- Logout using the logout button in the sidebar.

## Live Demo

You can access the live application at [https://hello-react-chat.netlify.app/](https://hello-react-chat.netlify.app/).

## Repository

The project repository is available at [https://github.com/Abdul-Rahman-E/hello-react-chat](https://github.com/Abdul-Rahman-E/hello-react-chat).

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---

Feel free to contribute to the project by submitting issues or pull requests on the GitHub repository. For any questions, please contact the project maintainer at abdulrahimaneassak@gmail.com.
