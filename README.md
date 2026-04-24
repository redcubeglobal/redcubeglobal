# JRN University Examination Form Portal

A lightweight full-stack-style (single-page) examination module for Janardhan Rai Nagar Rajasthan Vidyapeeth University.

## Features
- Candidate registration form with:
  - Enrollment No, ABCID, Name, Father Name, Mother Name
  - Email, Mobile, AADHAR-registered mobile
  - Gender, Category, Course, Semester
- Dynamic subject mapping by course + semester
- Optional subject selection (up to 2)
- Previous exam details (10th/12th/previous exam)
- Document upload fields (photo, signature, marksheets)
- Admin panel:
  - Candidate listing
  - Verification action
  - Admit card generation & download via print dialog

## Run
Since this is static HTML/CSS/JS, simply open `index.html` in a browser or use a local server:

```bash
python3 -m http.server 8080
```

Then visit: `http://localhost:8080`
