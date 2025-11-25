📚 Nalanda Digital Library – MERN + Next.js

A modern library management system built with Next.js (App Router) on the frontend and Node.js + Express + MongoDB on the backend.
Includes admin dashboard, authentication, book management, borrowing system, and history tracking.

🚀 Features
👤 Authentication & User Roles

Secure JWT-based login & registration

Protected routes using middleware

admin & member access control

📖 Book Management

Add / Update / Delete books

Browse books with search & filters

Pagination support

🔄 Borrowing System

Borrow and return books

Track borrowing history

Available copies update automatically

Prevent duplicate borrowing

📊 Admin Dashboard

Total inventory

Currently borrowed books count

Available books count

Members count

Visual reports

🛠️ Tech Stack
Category	Technology
Frontend	Next.js 16, React 19, TailwindCSS, Zustand
Backend	Node.js, Express, MongoDB, Mongoose
Auth	JWT + HTTP-Only cookies
UI	Tailwind CSS components
Tools	TypeScript, ESLint, Sonner toast
📦 Installation & Setup
Backend
cd backend
npm install
npm run dev


Create .env file:

PORT=8000
MONGO_URI=mongodb://localhost:27017/libbackend
JWT_SECRET=your-secret-key
CLIENT_URL=http://localhost:5173

Frontend
cd my-app
npm install
npm run dev


Create .env file:

NEXT_PUBLIC_API_URL=http://localhost:8000

🧪 Scripts
"scripts": {
  "dev": "next dev -p 5173",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "type-check": "tsc --noEmit"
}


Run TypeScript type check:

npm run type-check

📂 Project Structure
Frontend
my-app/
 ├── app/
 │   ├── admin/
 │   └── user/
 ├── components/
 ├── lib/api/
 └── store/

Backend
backend/
 ├── controllers/
 ├── routes/
 ├── models/
 ├── middleware/
 └── services/

✨ Roadmap

Email notifications for due books

Payment support for fines

Export admin reports

Mobile app version

🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to open an issue or create a PR.

📄 License

This project is open-source and available under the MIT License.

⭐ Show Your Support

If you like this project, star the repo ⭐ and share your feedback!
