# MartaTodoTask Backend

This is a Node.js backend for managing todo task of Marta using Firebase Realtime Database, express and body-parser. 

## Getting Started

### Prerequisites

- Node.js installed on your machine
- Firebase project with Realtime Database enabled

### Steps For Running

1. Clone the repository:
    - git clone https://github.com/efemazlumoglu/martaBE.git
    
2. Install dependencies:
    - npm install
     
3. Set up Firebase: ( I HAVE ALREADY DID THAT PART YOU DO NOT HAVE TO DO IT )
    - Go to the Firebase console: https://console.firebase.google.com/
    - Create a new project or use an existing one.
    - Navigate to the "Project settings" and find your Firebase project configuration.
    - Copy the Firebase project configuration object.
    - Paste the configuration object into server.js replacing the placeholder values in firebaseConfig.
    
4. Start the server:
    - npm start
    
5. Usage  
    - The server will start running on http://localhost:3000 by default.
    - You can make requests to the following endpoints:
    - GET /tasks: Get all tasks.
    - POST /tasks: Add a new task.
    - PUT /tasks/:taskId: Update a task.
    - DELETE /tasks/:taskId: Delete a task.
    - Make sure to send requests with appropriate JSON data in the request body where required.