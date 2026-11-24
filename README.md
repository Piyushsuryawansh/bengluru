# FoodReels

FoodReels is a short-form food discovery app with separate customer and food-partner journeys.

## Requirements

- Node.js 20+
- MongoDB (local or Atlas)
- ImageKit account for video uploads

## 1. Configure the backend

In a terminal:

```bash
cd backend
```

Copy `.env.example` to `.env` and fill in your MongoDB URI, a long random JWT secret, and ImageKit credentials.

Install and start the API:

```bash
npm install
npm run dev
```

The API runs on `http://localhost:3000`. It waits for MongoDB to connect before listening.

## 2. Configure the frontend

Open a second terminal:

```bash
cd frontend
```

Copy `.env.example` to `.env`. For local development it should contain:

```env
Frontend_URL=http://localhost:3000
```

Install and start Vite:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`).

## Customer journey

1. Open the home page and browse reels without signing in.
2. Select **Register** and create a customer account, or sign in.
3. Like or save food reels.
4. Open **Saved** to view and remove saved reels.
5. Open a food partner profile from a reel.

## Food partner journey

1. Open **Register** and choose **Food partner**, or visit `/food-partner/register`.
2. Create a partner account. Successful registration signs the partner in.
3. Upload a video, enter a food name and optional description, then save.
4. The new reel appears in the public customer feed.
5. Food partner profiles are publicly viewable.

## Important environment and deployment notes

- The frontend uses the Vite-exposed variable `Frontend_URL`; do not put secrets in frontend environment files.
- Configure `FRONTEND_ORIGINS` in the backend with a comma-separated list of exact frontend origins.
- In production, use HTTPS and set `NODE_ENV=production` so the authentication cookie is Secure and SameSite=None.
- Keep `JWT_SECRET`, MongoDB credentials, and ImageKit private credentials only in the backend environment.
- Video uploads are limited to 100 MB and require a valid video MIME type.
- The customer served statistic is intentionally shown as unavailable until an order/customer tracking feature exists.

## Build checks

Frontend production build:

```bash
cd frontend
npm run build
```

Backend currently has no automated test suite. Configure test data and run an end-to-end check against a non-production MongoDB and ImageKit account before launch.
