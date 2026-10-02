# DevConnect 🚀

**DevConnect** is a full-stack developer networking platform built with the **MERN stack**. It allows developers to create profiles, discover other developers, send connection requests, manage connections, and build their professional network.

## ✨ Features

* 🔐 JWT-based user authentication
* 👤 Developer profile management
* 🖼️ Profile photo support
* 💻 Skills and developer information
* 🤝 Send connection requests
* ✅ Accept or reject connection requests
* 🚫 Ignore users
* 👥 Manage connections
* 🔎 Personalized developer feed
* 🍪 Cookie-based authentication
* 📱 Responsive user interface
* 🎨 Modern React UI

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

## 📂 Project Structure

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
└── .gitignore
```

## 🚀 Getting Started

Follow these steps to run the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/ankit-jadaun/DevConnect.git
cd DevConnect
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
PORT=7777
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Then start the backend:

```bash
npm run dev
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will usually be available at:

```text
http://localhost:5173
```

## 🔐 Authentication

DevConnect uses **JWT-based authentication** with HTTP cookies.

The authentication flow includes:

1. User logs in with their credentials.
2. The backend validates the credentials.
3. A JWT is generated.
4. The JWT is stored in a cookie.
5. Protected routes verify the authenticated user.
6. The frontend sends authenticated API requests using credentials.

## 🤝 Connection System

Users can:

1. Discover developers through the feed.
2. Send connection requests.
3. Ignore developers.
4. Receive connection requests.
5. Accept or reject requests.
6. View their connections.

Users who already have a connection or pending request are excluded from the feed.

## 🔒 Environment Variables

Sensitive information is stored using environment variables.

Never commit:

```text
.env
.env.*
node_modules/
```

Make sure your actual database credentials and JWT secrets are never exposed publicly.

## 🧩 Future Improvements

* 💬 Real-time developer messaging
* 🔔 Notifications
* 🔎 Developer search and filters
* 🎯 Improved developer recommendations
* 👤 Profile verification
* 🖼️ Image optimization
* ☁️ AWS deployment
* 🔄 CI/CD pipeline

## 👨‍💻 Author

**Ankit Jadaun**

Full Stack Developer | MERN

[GitHub](https://github.com/ankit-jadaun)

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.
