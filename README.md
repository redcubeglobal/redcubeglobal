# University Exam Management Module (React + Motoko)

This project now provides a cleaner full-stack baseline for a university exam workflow with two focused modules.

## 1) Student Registration
- Captures Name, ABCID, Enrollment Number, Roll Number, Mother Name, Gender, Category, Caste, Course, and Semester.
- Dynamically maps subjects from selected `Course + Semester`.
- Supports courses: **MA, MBA, MVA, BA, BSC** and semester sets from **1 to 4**.

## 2) Result Management
- Filter by Course and Semester to load the matching student list.
- Enter **Internal, External, and Practical** marks for each mapped subject.
- Auto-calculates per-subject totals and shows a student-level **Grand Total**.

## Stack
- Frontend: React + Vite (`src/frontend`)
- Backend: Motoko canister (`src/backend/main.mo`)

## Backend API
- `registerStudent(StudentInput) -> Student`
- `listStudents(course, semester) -> [Student]`
- `listAllStudents() -> [Student]`
- `saveResult(ResultInput) -> Result` (computes per-subject total + grand total)
- `getResult(studentId, course, semester) -> ?Result`

## Local run (frontend)
```bash
npm install
npm run dev
```

## Notes
In restricted environments where npm registry access is blocked, dependency installation and browser preview may fail.
