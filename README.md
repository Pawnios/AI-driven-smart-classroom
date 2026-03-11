AI-Driven Smart Classroom Scheduler

A full-stack intelligent scheduling system that automates university timetable creation using AI.
This application helps academic institutions manage courses, faculty, classrooms, and timetables while minimizing conflicts and improving resource utilization.

The system provides a modern web dashboard where administrators can manage academic resources and generate optimized timetables using an AI model.

⸻

📌 Project Overview

Creating university timetables manually is time-consuming and prone to errors such as:
	•	Faculty scheduling conflicts
	•	Room allocation conflicts
	•	Uneven distribution of classes
	•	Poor utilization of resources

The AI-Driven Smart Classroom Scheduler solves these problems by combining:
	•	A React dashboard
	•	A Node.js backend API
	•	MongoDB database
	•	AI-based timetable generation

The AI analyzes available courses, faculty, rooms, and time slots and generates a conflict-free weekly timetable.

⸻

✨ Key Features

Dashboard Analytics
	•	Displays total courses, faculty, rooms, and timetable statistics
	•	Real-time data from MongoDB

Course Management
	•	Add / edit / delete courses
	•	Configure credits, department, semester, prerequisites

Faculty Management
	•	Manage instructors and their specialization
	•	Set availability and maximum hours per week

Room Management
	•	Manage classrooms and labs
	•	Configure room capacity and equipment

AI Timetable Generator
	•	Automatically generates schedules using AI
	•	Prevents conflicts between faculty, rooms, and courses
	•	Saves generated timetable to the database

Notifications System
	•	Alerts when timetable generation succeeds or fails
	•	Tracks system events

⸻

🛠 Technology Stack

Frontend
	•	React
	•	Vite
	•	Tailwind CSS
	•	Axios
	•	Lucide Icons
	•	ShadCN UI Components

Backend
	•	Node.js
	•	Express.js
	•	MongoDB
	•	Mongoose

AI Integration
	•	Google Gemini API (configurable — can be replaced with OpenAI / Groq / other LLM APIs)

Database
	•	MongoDB Atlas

Development Tools
	•	Git
	•	GitHub
	•	npm
	•	Concurrently (for running frontend + backend together)

⸻

🏗 Project Architecture

AI-driven-smart-classroom-main

backend
├── models
├── routes
├── utils
├── controllers
├── server.js
└── .env

frontend
├── src
│   ├── components
│   ├── pages
│   ├── App.jsx
│   └── main.jsx
└── vite.config.js

package.json

⸻

🤖 How the AI Timetable Generation Works
	1.	The backend retrieves:
	•	Courses
	•	Faculty
	•	Rooms
	2.	A structured prompt is created containing:
	•	department
	•	semester
	•	available days
	•	time slots
	•	faculty specializations
	3.	The AI model generates a JSON schedule.
	4.	The schedule is validated and enriched with:
	•	course names
	•	faculty names
	•	room names
	5.	The final timetable is stored in MongoDB.

⸻

⚙ Installation Guide

1️⃣ Clone the repository

git clone https://github.com/yourusername/AI-driven-smart-classroom.git
cd AI-driven-smart-classroom

⸻

2️⃣ Install dependencies

Install root dependencies:

npm install

Install backend dependencies:

cd backend
npm install

Install frontend dependencies:

cd ../frontend
npm install

⸻

3️⃣ Create Environment File

Inside the backend folder, create a file named:

.env

Add the following variables:

PORT=5001
MONGO_URI=your_mongodb_connection_string
GOOGLE_API_KEY=your_ai_api_key

Example:

PORT=5001
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/smartclassroom
GOOGLE_API_KEY=your_gemini_api_key

⸻

4️⃣ Run the Application

Go back to the project root folder:

cd ..

Run both frontend and backend together:

npm run dev

The app will start on:

Frontend
http://localhost:5173

Backend API
http://localhost:5001

⸻

🗄 Database Setup

Create a MongoDB Atlas cluster and ensure your database contains these collections:

courses
faculties
rooms
timetables
notifications

You can insert data manually using MongoDB Atlas or through the application UI.

⸻

🔄 Changing the AI Provider

If you want to replace the Gemini API with another AI provider (such as OpenAI or Groq), update the AI logic in:

backend/controllers/timetableGenerator.js

Replace the AI request logic with your preferred API.

Example providers supported easily:
	•	OpenAI
	•	Groq
	•	HuggingFace
	•	OpenRouter

⸻

🔒 Security Note

The .env file is not included in the repository to protect sensitive credentials.

Never commit:

.env
API keys
database passwords

Ensure .env is listed in .gitignore.

⸻

🚀 Example Workflow
	1.	Add courses in the Courses page
	2.	Add faculty and their specialization
	3.	Add rooms and facilities
	4.	Click Generate Timetable
	5.	AI produces a conflict-free schedule
	6.	Timetable is saved and displayed

⸻

🔮 Future Improvements
	•	Multi-department scheduling
	•	Advanced constraint optimization
	•	Faculty preference weighting
	•	Drag-and-drop timetable editor
	•	Export timetable as PDF
	•	Authentication system for administrators

⸻


