// backend/utils/timetableGenerator.js

import Groq from "groq-sdk";
import Course from "../models/course.js";
import Faculty from "../models/Faculty.js";
import Room from "../models/Room.js";
import Timetable from "../models/Timetable.js";
import Notification from "../models/Notification.js";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

/* -------------------- Initialize Groq -------------------- */

let groq;

try {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is missing");
  }

  groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
  });

  console.log("Groq AI initialized successfully");
} catch (error) {
  console.error("Failed to initialize Groq:", error.message);
}

/* -------------------- Configuration -------------------- */

const WEEKS = 13;

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday"
];

const TIME_SLOTS = [
  { start: "09:00", end: "10:00" },
  { start: "10:00", end: "11:00" },
  { start: "11:15", end: "12:15" },
  { start: "14:15", end: "15:15" },
  { start: "15:15", end: "16:15" },
  { start: "16:30", end: "17:30" }
];

const BREAK_SLOT = { start: "12:15", end: "13:15" };

/* -------------------- Helper Functions -------------------- */

function getWeeklySessions(course) {
  if (course.totalHours && Number(course.totalHours) > 0) {
    return Math.ceil(Number(course.totalHours) / WEEKS);
  }

  return Number(course.hoursPerWeek) || 3;
}

function parseAIResponse(text) {
  if (!text || typeof text !== "string") return [];

  const clean = text
    .replace(/```(?:json)?\n?/gi, "")
    .replace(/```\n?/g, "")
    .trim();

  try {
    const parsed = JSON.parse(clean);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("Failed to parse AI JSON response:", e);
    return [];
  }
}

/* -------------------- Main Generator -------------------- */

export async function generateTimetableWithAI(request) {

  console.log("=== STARTING AI TIMETABLE GENERATION ===");
  console.log("Request:", request);

  if (!groq) {
    throw new Error("Groq client not initialized. Check GROQ_API_KEY.");
  }

  try {

    const { department, semester, academicYear } = request;

    if (!department || !semester || !academicYear) {
      throw new Error(
        "Department, semester, and academic year are required."
      );
    }

    /* -------- Fetch DB Data -------- */

    console.log("Fetching DB data...");

    const allCourses = await Course.find({});
    const allFaculty = await Faculty.find({});
    const allRooms = await Room.find({});

    const relevantCourses = allCourses.filter(
      (c) =>
        (c.department || "").toLowerCase() === department.toLowerCase() &&
        Number(c.semester) === Number(semester)
    );

    if (relevantCourses.length === 0) {
      throw new Error(
        `No courses found for ${department}, Semester ${semester}`
      );
    }

    const relevantFaculty = allFaculty.filter(
      (f) =>
        (f.department || "").toLowerCase() === department.toLowerCase()
    );

    /* -------- Prompt for AI -------- */

    const prompt = `
You are an expert university timetable scheduler.

Generate a complete weekly timetable.

Department: ${department}
Semester: ${semester}

Days:
${JSON.stringify(DAYS)}

Time Slots:
${JSON.stringify(TIME_SLOTS)}

Break Time (Do not schedule):
${BREAK_SLOT.start}-${BREAK_SLOT.end}

Courses:
${relevantCourses
  .map(
    (c) =>
      `Course "${c.name}" | ID: ${c._id} | Weekly Sessions: ${getWeeklySessions(
        c
      )}`
  )
  .join("\n")}

Faculty:
${relevantFaculty
  .map(
    (f) =>
      `Faculty "${f.name}" | ID: ${f._id} | Specialization: ${JSON.stringify(
        f.specialization || []
      )}`
  )
  .join("\n")}

Rooms:
${allRooms.map((r) => `Room "${r.name}" | ID: ${r._id}`).join("\n")}

Return ONLY a JSON array.

Example entry:

{
  "courseId": "string",
  "facultyId": "string",
  "roomId": "string",
  "day": "Monday",
  "startTime": "09:00",
  "endTime": "10:00"
}
`;

    /* -------- Call Groq -------- */

    console.log("Sending request to Groq AI...");

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "Return ONLY valid JSON timetable data. No explanations."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.2
    });

    const responseText = completion.choices[0].message.content;

    console.log(
      "AI Response received:",
      responseText ? "Success" : "Empty"
    );

    const schedule = parseAIResponse(responseText);

    if (schedule.length === 0) {
      console.error("AI raw response:", responseText);
      throw new Error(
        "AI failed to generate a valid timetable schedule."
      );
    }

    console.log(`AI generated ${schedule.length} schedule entries.`);

    /* -------- Enrich Schedule -------- */

    const enrichedSchedule = schedule.map((entry) => {

      const course = relevantCourses.find(
        (c) => String(c._id) === entry.courseId
      );

      const faculty = relevantFaculty.find(
        (f) => String(f._id) === entry.facultyId
      );

      const room = allRooms.find(
        (r) => String(r._id) === entry.roomId
      );

      return {
        ...entry,
        courseName: course ? course.name : "Unknown",
        facultyName: faculty ? faculty.name : "Unknown",
        roomName: room ? room.name : "Unknown",
        timeSlot: `${entry.startTime}-${entry.endTime}`
      };
    });

    /* -------- Save Timetable -------- */

    const totalHours = enrichedSchedule.length;

    const availableSlots = DAYS.length * TIME_SLOTS.length;

    const utilizationRate = Math.round(
      (totalHours / availableSlots) * 100
    );

    const timetableData = {

      name: `${department} - Semester ${semester} ${academicYear}`,

      department,

      semester: String(semester),

      year: parseInt(academicYear),

      schedule: enrichedSchedule,

      conflicts: [],

      status: "draft",

      metadata: {
        totalHours,
        utilizationRate,
        conflictCount: 0
      }
    };

    const timetable = new Timetable(timetableData);

    const created = await timetable.save();

    console.log(
      `Timetable saved successfully! ID: ${created._id}`
    );

    /* -------- Success Notification -------- */

    await new Notification({
      title: "AI Timetable Generated",
      message: `Generated timetable "${created.name}" with ${totalHours} entries.`,
      type: "success"
    }).save();

    return created;

  } catch (err) {

    console.error("Error generating timetable:", err);

    await new Notification({
      title: "Timetable Generation Failed",
      message: err.message || "Unknown error",
      type: "error"
    }).save();

    throw err;
  }
}