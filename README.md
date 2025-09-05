## LIVE LINK 🔗

[VISIT\_HERE](#) *(https://quick-cart-fljo.vercel.app)*

## Description 📚

Quick Cart is a modern, responsive e-commerce web application designed for seamless shopping. Users can browse products, add items to their cart, manage orders, and complete secure payments. The app integrates cloud storage for media, secure authentication, and real-time cart synchronization for a smooth shopping experience.

---

## Table of Contents 📑

* [Features ✨](#features-%E2%9C%A8)
* [Tech Stack 💻](#tech-stack-%F0%9F%92%BB)
* [Installation 🛠️](#installation-%F0%9F%95%A7)
* [Usage 🚀](#usage-%F0%9F%9A%80)
* [Project Structure 📂](#project-structure-%F0%9F%97%82)
* [Footer 👣](#footer-%F0%9F%91%A3)

---

## Features ✨

* **Secure Authentication:** Signup/login via email and Google using Firebase.
* **Dynamic Product Listing:** Products fetched dynamically from the server.
* **Cloud Storage Integration:** Product images stored in Appwrite file bucket storage, not in the database.
* **Cart Management:** Add, remove, and update items in the cart; cart synced with the server.
* **State Management & Validation:** Uses Zustand for state management and Zod for input validation.
* **Complex Cart Features:** Implemented advanced cart functionalities using DSA concepts.
* **Secure Payments:** Integrated Razorpay for seamless and secure payment processing.
* **Profile Management:** Update profile info, change password, manage wishlist, and view orders.
* **Responsive Design:** Mobile-first design ensuring smooth experience across devices.
* **Component-Based Architecture:** Structured, reusable components for maintainability.

---

## Tech Stack 💻

* **Frontend:**

  * React
  * TypeScript
  * Zustand (state management)
  * Zod (validation)
  * TailwindCSS / Vanilla CSS
  * Axios

* **Backend:**

  * Node.js
  * Express
  * MongoDB (for product and cart data)
  * PostgreSQL (for order management)

* **Cloud & Services:**

  * Appwrite (file storage / bucket)
  * Firebase (authentication)
  * Cloudinary (media hosting for images/videos)
  * Razorpay (payment integration)

---

## Installation 🛠️

1. **Clone the repository:**

   ```bash
   git clone <REPO_URL>
   cd Quick-Cart
   ```

2. **Frontend Setup:**

   ```bash
   cd CLIENT
   npm install
   ```

   * Create `.env.local` with:

     ```
     REACT_APP_BACKEND_URL=<backend_url>
     REACT_APP_FIREBASE_CONFIG=<firebase_config>
     ```

3. **Backend Setup:**

   ```bash
   cd SERVER
   npm install
   ```

   * Create `.env` file with:

     ```
     MONGODB_URI=<mongodb_uri>
     POSTGRES_URI=<postgres_uri>
     APPWRITE_PROJECT_ID=<appwrite_project_id>
     APPWRITE_API_KEY=<appwrite_api_key>
     RAZORPAY_KEY_ID=<razorpay_key>
     RAZORPAY_SECRET=<razorpay_secret>
     ```

---

## Usage 🚀

1. **Start the Backend:**

   ```bash
   cd SERVER
   npm run dev
   ```

   * Runs on default port 4000 (changeable via `.env`).

2. **Start the Frontend:**

   ```bash
   cd CLIENT
   npm run dev
   ```

   * Runs on default port 5173 (Vite server).

3. **Access the Application:**
   Open your browser at `http://localhost:5173` to use Quick Cart.

---

## Use Cases

* **Shopping Experience:** Browse products, add to cart, manage wishlist, and place orders.
* **Cart Management:** Real-time synchronization between client and server ensures accuracy.
* **Secure Checkout:** Complete payments via Razorpay securely.
* **Profile Customization:** Users can update profile, password, and view orders.
* **Cloud Media Handling:** Product images stored in Appwrite bucket for performance and scalability.
* **Responsive Design:** Access Quick Cart on any device without layout issues.

---

## Project Structure 📂

```

CLIENT/
├── node_modules/
├── public/               # Static assets like images and icons
├── src/
│   ├── assets/           # Static assets used in the app
│   ├── components/       # Reusable UI components
│   ├── config/           # App configuration files
│   ├── context/          # React context providers or Zustand store
│   ├── interface/        # TypeScript interfaces and types
│   ├── layouts/          # Layouts for different pages
│   ├── lib/              # Utility libraries
│   ├── modules/          # Feature-specific modules
│   ├── pages/            # React page components
│   ├── router/           # Application routing
│   ├── schema/           # Zod validation schemas
│   ├── scripts/          # Helper scripts or custom hooks
│   ├── services/         # API calls and business logic
│   ├── styles/           # CSS or Tailwind styling files
│   ├── utils/            # Utility functions
│   ├── App.tsx           # Root React component
│   ├── global.css        # Global CSS
│   ├── main.tsx          # React entry point
│   └── vite-env.d.ts     # Vite TypeScript declarations
├── .env
├── .gitignore
├── bun.lock
├── components.json
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── README.md
└── tsconfig.app.json


SERVER/
├── node_modules/
├── prisma/
├── src/
│   ├── authentication/   # Handles user login/signup and token management
│   ├── config/           # Configuration files (env, database, constants)
│   ├── controllers/      # API request handlers
│   ├── database/         # Database connection and models
│   ├── interfaces/       # TypeScript interfaces/types
│   ├── main/             # Entry point modules or server initialization
│   ├── routes/           # Express route definitions
│   ├── schema/           # Database schemas
│   ├── scripts/          # Helper scripts or seed scripts
│   ├── services/         # Business logic or third-party integrations
│   └── utils/            # Utility functions and constants
├── .env
├── .gitignore
├── bun.lock
├── index.ts              # Server entry point
├── package.json
├── request.rest          # API testing requests
├── README.md
└── tsconfig.json

```

---

## Footer 👣

* Repository Name: Quick Cart
* Repository URL: \[[Quick-cart](https://github.com/Varunjoshi-19/Quick_Cart)]
* Author: Varun Joshi
* Contact: [varunjoshi6283@gmail.com](mailto:varunjoshi6283@gmail.com)

