# DevConnect 🚀

DevConnect is a full-stack developer networking platform built with the MERN stack. It allows developers to create profiles, discover other developers, send connection requests, manage connections, and build their professional network.

## ✨ Features

* 🔐 User authentication with JWT and cookies
* 👤 Developer profile management
* 🖼️ Profile photo support
* 💻 Skills and developer information
* 🤝 Send connection requests
* ✅ Accept or reject connection requests
* 🚫 Ignore users
* 👥 Manage connections
* 🔎 Personalized developer feed
* 💾 Persistent authentication
* 📱 Responsive UI
* 🎨 Modern React-based interface

## 🛠️ Tech Stack

### Frontend

* React.js
* React Router DOM
* Redux Toolkit
* Axios
* Tailwind CSS
* Vite
* Sonner

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt
* CORS
* dotenv

## 📁 Project Structure

```text
DevConnect/
├── backend/
│   ├── src/
│   ├── package.json
│   └── ...
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md
```

## ⚙️ Getting Started

Follow these steps to run DevConnect locally.

### 1. Clone the repository

```bash
git clone https://github.com/ankit-jadaun/DevConnect.git
cd DevConnect
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Configure backend environment variables

Create a `.env` file inside the `backend` folder.

Example:

```env
PORT=7777
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Do not share your actual `.env` file or secret keys publicly.

### 4. Start the backend

```bash
npm run dev
```

The backend will start on your configured port.

### 5. Install frontend dependencies

Open another terminal:

```bash
cd frontend
npm install
```

### 6. Start the frontend

```bash
npm run dev
```

Vite will provide a local development URL, usually:

```text
http://localhost:5173
```

## 🔑 Authentication

DevConnect uses JWT-based authentication.

After successful login:

* The server generates a JWT.
* The JWT is stored using an HTTP cookie.
* Protected routes verify the authenticated user.
* The frontend sends requests with credentials enabled.

## 🤝 Connection System

Users can:

1. Discover developers through the feed.
2. Send an interested request.
3. Ignore a developer.
4. Receive connection requests.
5. Accept or reject requests.
6. View accepted connections.

## 🔒 Security

Sensitive configuration values are stored in environment variables.

The following files should never be committed:

```text
.env
.env.*
node_modules/
```

## 🚧 Future Improvements

* Real-time messaging
* Developer search and filters
* Notifications
* Profile verification
* Better recommendation algorithm
* Image optimization
* Deployment with AWS
* CI/CD pipeline

## 👨‍💻 Author

**Ankit Jadaun**

Full Stack Developer | MERN

GitHub:
https://github.com/ankit-jadaun

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.
