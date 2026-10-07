# DevConnect

DevConnect is a full-stack developer networking platform built with the MERN stack. Users can create a developer profile, discover people in a personalized feed, send connection requests, manage connections, and unlock premium networking features.

## Features

- JWT authentication stored in an HTTP cookie
- Sign up, log in, log out, and persistent sessions
- Developer profiles with photo, bio, age, gender, and skills
- Profile editing and password changes
- Personalized feed with pagination
- Interested, ignored, accepted, and rejected connection requests
- Connections list and pending-request count
- Premium memberships with monthly and yearly plans
- Razorpay payment creation and server-side signature verification
- Premium verification badge
- Super Likes for premium users, limited to five per day
- Real-time Super Like notifications with Socket.IO
- Email notifications for new connection requests
- Responsive React UI with Tailwind CSS and DaisyUI

## Tech stack

### Frontend

- React 19
- Vite
- React Router
- Redux Toolkit and React Redux
- Axios
- Tailwind CSS and DaisyUI
- Sonner and React Toastify
- Socket.IO Client

### Backend

- Node.js
- Express 5
- MongoDB and Mongoose
- JSON Web Token (JWT)
- bcrypt
- cookie-parser
- CORS
- Razorpay
- Socket.IO

## Project structure


DevConnect/
├── backend/
│   ├── src/
│   │   ├── config/          # MongoDB connection
│   │   ├── middlewares/     # Authentication middleware
│   │   ├── Models/          # User, connection, and payment models
│   │   ├── routes/          # Auth, profile, user, request, and payment APIs
│   │   └── utils/           # Validation, plans, Razorpay, and Socket.IO helpers
│   ├── package.json
│   └── .env                 # Create locally; never commit
├── frontend/
│   ├── src/
│   │   ├── components/      # Pages and reusable UI components
│   │   └── utils/           # Redux slices, constants, and socket client
│   ├── public/
│   └── package.json
├── package.json
├── .gitignore
└── README.md
```

## Prerequisites

Install the following before starting:

- Node.js 18 or newer
- npm
- A MongoDB database (local MongoDB or MongoDB Atlas)
- Razorpay test credentials if you want to test premium payments

Check your versions:

```bash
node --version
npm --version
```

## Run locally

### 1. Clone the repository

```bash
git clone https://github.com/ankit-jadaun/DevConnect.git
cd DevConnect
```

### 2. Configure the backend

Create `backend/.env`:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<database>
JWT_SECRET_KEY=replace_with_a_long_random_secret
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_test_secret
```

`MONGODB_URI` and `JWT_SECRET_KEY` are required. The Razorpay variables are required only when using premium payments, but adding them during development is recommended.

Never commit `.env`, `.env.*`, private keys, or payment secrets.

### 3. Install backend dependencies and start the API

Open a terminal:

```bash
cd backend
npm install
npm run dev
```

The backend starts at `http://localhost:3000`. Use `npm start` for a non-watch production-style start.

### 4. Install frontend dependencies and start the UI

Open a second terminal from the repository root:

```bash
cd frontend
npm install
npm run dev
```

Open the Vite URL shown in the terminal, normally `http://localhost:5173`.

The frontend automatically uses:

- `http://localhost:3000` when opened on `localhost`
- `/api` on non-localhost hosts

For a deployed frontend, configure the hosting server or reverse proxy to forward `/api` and Socket.IO traffic to the backend.

## Available scripts

### Backend

Run these from `backend/`:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the API with Nodemon |
| `npm start` | Start the API with Node |

### Frontend

Run these from `frontend/`:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build in `frontend/dist` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## Application routes

| Route | Description |
| --- | --- |
| `/` | Developer feed |
| `/login` | Log in |
| `/signup` | Create an account |
| `/profile` | View and edit your profile |
| `/connections` | View accepted connections |
| `/requests` | Review received requests |
| `/premium` | View plans and purchase Premium |

Most application pages require a logged-in user. Visiting a protected page without a valid cookie redirects to `/login`.

## API overview

The backend exposes all routes from the root URL (`http://localhost:3000` locally).

### Authentication

| Method | Endpoint | Auth |
| --- | --- | --- |
| `POST` | `/signup` | Public |
| `POST` | `/login` | Public |
| `POST` | `/logout` | Public |

### Profile and discovery

| Method | Endpoint | Auth |
| --- | --- | --- |
| `GET` | `/profile/view` | Required |
| `PATCH` | `/profile/edit` | Required |
| `PATCH` | `/profile/password` | Required |
| `GET` | `/feed?page=1` | Required |
| `GET` | `/user/connections` | Required |
| `GET` | `/user/requests/recieved` | Required |

> The `recieved` spelling is part of the current API route and must be kept when calling it.

### Connection requests

| Method | Endpoint | Auth |
| --- | --- | --- |
| `POST` | `/request/send/:status/:toUserId` | Required |
| `POST` | `/request/review/:status/:requestId` | Required |

Supported send statuses are `interested`, `ignored`, and `superliked`. Review statuses are `accepted` and `rejected`.

Super Likes require an active Premium membership and are limited to five per day. A successful Super Like also sends a real-time `superLikeReceived` event through Socket.IO.

### Payments

| Method | Endpoint | Auth |
| --- | --- | --- |
| `POST` | `/payment/create` | Required |
| `POST` | `/payment/verify` | Required |

Plans are defined on the backend, so the server—not the browser—controls the amount:

| Plan | Price | Duration |
| --- | ---: | ---: |
| `monthly` | ₹199 | 30 days |
| `yearly` | ₹1,499 | 365 days |

Use Razorpay test keys while developing. The payment flow creates an order, opens Razorpay Checkout in the browser, verifies the Razorpay signature on the backend, and then extends the user's Premium expiry date.

## Authentication and data flow

1. A user signs up or logs in.
2. The backend signs a JWT using `JWT_SECRET_KEY`.
3. The JWT is stored in the `token` cookie.
4. Protected requests send that cookie with `withCredentials: true`.
5. The backend middleware verifies the token and loads the user from MongoDB.
6. Expired Premium memberships are automatically marked as non-premium.

Socket.IO uses the same authentication cookie. Only authenticated users can connect, and each user receives events in a private room.

## Deployment notes

### Build the frontend

```bash
cd frontend
npm install
npm run build
```

Deploy the generated `frontend/dist` directory to a static host or serve it from your web server.

### Start the backend

```bash
cd backend
npm install
npm start
```

Set the backend environment variables on the server. Do not copy local `.env` files into a public repository or frontend build.

If the frontend and backend use different domains, configure secure cookie and HTTPS settings appropriate for that deployment.

## Troubleshooting

### The frontend cannot load data

- Confirm the backend is running on port `3000`.
- Confirm MongoDB is reachable and `MONGODB_URI` is correct.
- Open the app through the Vite URL, normally `http://localhost:5173`.
- Check that browser requests include credentials and that the backend CORS origin matches the frontend URL.

### Login immediately redirects back to `/login`

- Confirm `JWT_SECRET_KEY` is set.
- Clear stale cookies and log in again.
- Check that the frontend and backend are using the same host (`localhost`, not a mix of `127.0.0.1` and `localhost`).

### Premium checkout does not open

- Confirm `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are set in `backend/.env`.
- Use Razorpay test credentials for local development.
- Check the browser console and backend logs for order-creation errors.

### Real-time Super Like notifications do not appear

- Confirm the backend Socket.IO server is reachable.
- Confirm the user is logged in before opening the app.
- In production, make sure the reverse proxy supports WebSocket upgrades and forwards Socket.IO traffic.

## Security checklist

- Keep `.env` files out of Git.
- Use a long, unique `JWT_SECRET_KEY`.
- Keep `RAZORPAY_KEY_SECRET` only on the backend.
- Use Razorpay test keys for development.
- Use HTTPS in production.
- Restrict CORS to the deployed frontend origin.
- Do not expose passwords or payment secrets in frontend code.

## Contributing

1. Create a feature branch.
2. Make the smallest focused change.
3. Run `npm run lint` and `npm run build` from `frontend/`.
4. Test the relevant API flow locally.
5. Open a pull request with a clear description.

## Author

**Ankit Jadaun**

[GitHub](https://github.com/ankit-jadaun)
