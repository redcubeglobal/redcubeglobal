# JRN University Examination Form Portal

A lightweight examination module for Janardhan Rai Nagar Rajasthan Vidyapeeth University.

## Features
- Candidate registration form with:
  - Enrollment No, ABCID, Name, Father Name, Mother Name
  - Email, Mobile, AADHAR-registered mobile
  - Gender, Category, Course, Semester
- Dynamic subject mapping by course + semester
- Optional subject selection (up to 2)
- Previous exam details (10th/12th/previous exam)
- Document upload fields (photo, signature, marksheets)
- Result Management module:
  - Filter by Course + Semester
  - Subject-wise marks entry for Internal / External / Practical
  - Automatic total calculation per subject
- Admin panel:
  - Candidate listing and document list preview by file names
  - Verification action
  - Admit card generation and print/download
- Local persistence in browser using `localStorage`

## Run (Preview)
```bash
python3 -m http.server 8080
```

Visit: `http://localhost:8080`
