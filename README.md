TECHSA Member Management System (MVP)
A centralized digital database and membership portal for the Technology Student Association (TECHSA). This system automates member registration, generates unique IDs, and provides an administrative interface for record management.

🚀 Project Overview
The goal of this MVP is to transition TECHSA from manual record-keeping to a secure, automated digital system. Members can register online, log in to view their status, and receive a unique registration number automatically.

Key Features (MVP)
Member Registration: Self-service sign-up form for new members.

Secure Authentication: Secure login for existing members and administrators.

Unique ID Generation: Automated logic to assign membership numbers (e.g., TSA-2026-001).

Member Dashboard: A private view for members to see their "Active/Pending" status.

Admin Panel: A restricted view for leadership to approve or update member records.

🛠 Tech Stack
Frontend: React.js (Vite)

Backend: Ruby on Rails (API-only mode)

Database: PostgreSQL

Authentication: Devise + JWT (JSON Web Tokens)

📂 Project Structure
This repository uses a decoupled architecture. To run the full application, you must start both the backend and frontend servers.

Plaintext
techsa-membership/
├── techsa-backend/        # Ruby on Rails API
│   ├── app/models/        # Member & Admin logic
│   ├── db/migrate/        # Database schema
│   └── ...
└── techsa-frontend/       # React User Interface
    ├── src/components/    # Dashboard, Login, Registration
    ├── src/pages/         # Admin Panel, Home
    └── ...
🗓 Feasible MVP Roadmap
Phase 1: Backend Foundation (Ruby on Rails)
[ ] Initialize Rails API with PostgreSQL.

[ ] Create Member model with fields: first_name, last_name, student_id, email, status.

[ ] Implement before_create logic to generate unique Registration Numbers.

[ ] Set up Authentication (JWT) so members can log in securely.

Phase 2: Frontend Interface (React)
[ ] Design a clean, responsive Registration Form.

[ ] Create a Login page that stores the user's token.

[ ] Build the Member Dashboard to display the Unique ID and Membership Status.

Phase 3: Administration & Deployment
[ ] Build a simple Admin Table to toggle member status from "Pending" to "Active".

[ ] Connect Frontend "Fetch" requests to the Backend API.

[ ] Deploy the Backend (e.g., Render) and Frontend (e.g., Vercel).

⚙️ Installation & Setup
Prerequisites
Ruby (v3.0+) & Rails (v7.0+)

Node.js & npm

PostgreSQL

Getting Started
Clone the repository:
git clone [repository-url]

Setup Backend:

Bash
cd techsa-backend
bundle install
rails db:create db:migrate
rails s -p 3001
Setup Frontend:

Bash
cd techsa-frontend
npm install
npm run dev
🤝 Contributing
As a TECHSA project, we welcome contributions from student developers. Please ensure you create a feature branch before submitting a Pull Request.
