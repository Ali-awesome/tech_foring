# 🧑‍💼 Job Portal Web App (Next.js + Material UI + JWT)

This is a simple job portal web application built using **Next.js**, **Material UI**, and **JWT authentication**. The application allows users to **register, log in, view, create, edit, and delete job posts**. It also uses **private routing** to protect job-related pages.

---

## ✅ Features Implemented

* 🔐 **JWT Authentication** (Register + Login)
* 👤 **Private Routes** (no access without login)
* 🏠 Home page UI inspired by [career.techforing.com](https://career.techforing.com)
* 📋 **CRUD on Job Posts**

  * ✅ Create
  * ✅ Read
  * ✅ Delete
  * ✅ Edit is optional and implemented
* 💼 Material UI used for all design
* 🧱 Dynamic routing with Next.js

---

## 🛠 Tech Stack

* Frontend: **Next.js (Pages Router)**
* UI Library: **Material UI v6+**
* Auth: **JWT**
* Backend: Built with Next.js API Routes

---

## 📂 Project Structure

```
tech_foring
├── README.md
├── components
│   ├── CreateUpdateModal.tsx
│   └── HomePage.tsx
├── eslint.config.mjs
├── lib
│   ├── auth.ts
│   └── db.ts
├── middleware.ts
├── models
│   ├── Category.ts
│   ├── Job.ts
│   └── User.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── pages
│   ├── _app.tsx
│   ├── _document.tsx
│   ├── api
│   │   ├── categories
│   │   │   └── index.ts
│   │   ├── jobs
│   │   │   ├── [id].ts
│   │   │   └── index.ts
│   │   ├── login.ts
│   │   ├── logout.ts
│   │   ├── me.ts
│   │   ├── profile.ts
│   │   └── register.ts
│   ├── index.tsx
│   └── login.tsx
├── postcss.config.mjs
├── public
│   ├── favicon.ico
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── styles
│   └── globals.css
├── tsconfig.json
└── yarn.lock
```

---

## 🚀 Getting Started (Local Setup)

```bash
# Clone the repo
https://github.com/your-username/job-portal.git

cd job-portal

# Install dependencies
npm install; or,
yarn install

# Run the app
npm run dev; or,
yarn dev

# Visit: http://localhost:3000
```

> ⚠️ NOTE: Make sure you’re using **Node.js v18+**

---

## 📝 Important Notes

1. **It may take a moment to log in or create a job** — be patient as state and token validation occur.

2. **To create a job**:

   * Type the job **title, company, description**, and
   * **Type the category and press `Enter`** to add it to the job.

3. All pages (except `/login`) are protected by **Private Routing** — users **must be logged in** to access them.

---

## 🌐 Deployment

The app is hosted on **Vercel**. Live Link: https://tech-foring-ef5qcssf9-sanaullahs-projects-574b8a1a.vercel.app/login

---

**Happy coding!**
