const courseData = {
  BA: {
    semesters: ["Semester 1", "Semester 2", "Semester 3", "Semester 4", "Semester 5", "Semester 6"],
    mandatory: {
      "Semester 1": ["Hindi Literature", "English Prose", "Political Science-I"],
      "Semester 2": ["History of India", "English Poetry", "Sociology-I"],
      "Semester 3": ["Public Administration", "Economics-I", "Geography-I"],
      "Semester 4": ["Philosophy", "Economics-II", "Geography-II"],
      "Semester 5": ["Modern History", "Political Thought", "Sociology-II"],
      "Semester 6": ["Indian Constitution", "Rural Development", "Project Viva"]
    },
    optional: ["Computer Application", "Music", "Drawing", "Physical Education"]
  },
  BSC: {
    semesters: ["Semester 1", "Semester 2", "Semester 3", "Semester 4", "Semester 5", "Semester 6"],
    mandatory: {
      "Semester 1": ["Physics-I", "Chemistry-I", "Mathematics-I"],
      "Semester 2": ["Physics-II", "Chemistry-II", "Mathematics-II"],
      "Semester 3": ["Biology-I", "Computer Fundamentals", "Environmental Science"],
      "Semester 4": ["Biology-II", "Statistics", "Research Methodology"],
      "Semester 5": ["Lab Work-I", "Applied Mathematics", "Elective Theory-I"],
      "Semester 6": ["Lab Work-II", "Elective Theory-II", "Project"]
    },
    optional: ["Biotech", "Electronics", "Data Science", "Psychology"]
  },
  MA: {
    semesters: ["Semester 1", "Semester 2", "Semester 3", "Semester 4"],
    mandatory: {
      "Semester 1": ["Research Methods", "Core Paper-I", "Core Paper-II"],
      "Semester 2": ["Core Paper-III", "Core Paper-IV", "Seminar"],
      "Semester 3": ["Specialization-I", "Specialization-II", "Dissertation Prep"],
      "Semester 4": ["Dissertation", "Viva Voce", "Internship"]
    },
    optional: ["Communication Skills", "Statistics for Humanities", "Digital Archiving", "Comparative Studies"]
  },
  MBA: {
    semesters: ["Semester 1", "Semester 2", "Semester 3", "Semester 4"],
    mandatory: {
      "Semester 1": ["Management Principles", "Accounting", "Business Communication"],
      "Semester 2": ["Marketing", "Operations", "HRM"],
      "Semester 3": ["Finance", "Business Analytics", "Internship Review"],
      "Semester 4": ["Major Project", "Viva", "Strategic Management"]
    },
    optional: ["Digital Marketing", "International Business", "Investment Banking", "Supply Chain"]
  },
  MVA: {
    semesters: ["Semester 1", "Semester 2", "Semester 3", "Semester 4"],
    mandatory: {
      "Semester 1": ["Drawing & Composition", "History of Art", "Studio Practice-I"],
      "Semester 2": ["Studio Practice-II", "Art Criticism", "Material Study"],
      "Semester 3": ["Creative Project-I", "Exhibition Design", "Teaching Practice"],
      "Semester 4": ["Creative Project-II", "Portfolio", "Viva"]
    },
    optional: ["Sculpture", "Print Making", "Digital Illustration", "Photography"]
  }
};

const form = document.getElementById("examForm");
const courseSelect = document.getElementById("course");
const semesterSelect = document.getElementById("semester");
const mandatorySubjects = document.getElementById("mandatorySubjects");
const optionalSubjects = document.getElementById("optionalSubjects");
const candidateRows = document.getElementById("candidateRows");
const candidates = [];

function bootCourses() {
  courseSelect.innerHTML = '<option value="">Select Course</option>';
  Object.keys(courseData).forEach((course) => {
    const option = document.createElement("option");
    option.value = course;
    option.textContent = course;
    courseSelect.append(option);
  });
}

function bootSemesters(course) {
  semesterSelect.innerHTML = '<option value="">Select Semester</option>';
  if (!courseData[course]) {
    return;
  }
  courseData[course].semesters.forEach((semester) => {
    const option = document.createElement("option");
    option.value = semester;
    option.textContent = semester;
    semesterSelect.append(option);
  });
}

function renderSubjects() {
  const course = courseSelect.value;
  const semester = semesterSelect.value;
  mandatorySubjects.innerHTML = "";
  optionalSubjects.innerHTML = "";

  if (!course || !semester) {
    return;
  }

  courseData[course].mandatory[semester].forEach((subject) => {
    const li = document.createElement("li");
    li.textContent = subject;
    mandatorySubjects.append(li);
  });

  courseData[course].optional.forEach((subject) => {
    const label = document.createElement("label");
    label.className = "checkbox";
    label.innerHTML = `<input type="checkbox" name="optional" value="${subject}"> ${subject}`;
    optionalSubjects.append(label);
  });
}

function readFiles(fileList) {
  return Array.from(fileList || []).map((file) => ({
    name: file.name,
    sizeKB: Math.ceil(file.size / 1024)
  }));
}

function tableRow(candidate, index) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${candidate.enrollmentNo}</td>
    <td>${candidate.name}</td>
    <td>${candidate.course} / ${candidate.semester}</td>
    <td class="${candidate.verified ? "status-verified" : ""}">${candidate.verified ? "Verified" : "Pending"}</td>
    <td>
      <button class="action-btn verify" data-action="verify" data-index="${index}">Verify</button>
      <button class="action-btn admit" data-action="admit" data-index="${index}">Download Admit Card</button>
    </td>
  `;
  return row;
}

function renderCandidates() {
  candidateRows.innerHTML = "";
  candidates.forEach((candidate, index) => candidateRows.append(tableRow(candidate, index)));
}

function buildAdmitCard(candidate) {
  if (!candidate.verified) {
    alert("Candidate must be verified before admit card generation.");
    return;
  }

  const template = document.getElementById("admitCardTemplate");
  const node = template.content.cloneNode(true);
  node.querySelector('[data-field="name"]').textContent = candidate.name;
  node.querySelector('[data-field="enrollmentNo"]').textContent = candidate.enrollmentNo;
  node.querySelector('[data-field="abcId"]').textContent = candidate.abcId;
  node.querySelector('[data-field="course"]').textContent = candidate.course;
  node.querySelector('[data-field="semester"]').textContent = candidate.semester;
  node.querySelector('[data-field="gender"]').textContent = candidate.gender;
  node.querySelector('[data-field="category"]').textContent = candidate.category;
  node.querySelector('[data-field="subjects"]').textContent = [...candidate.mandatorySubjects, ...candidate.optionalSubjects].join(", ");

  const win = window.open("", "_blank");
  win.document.write("<html><head><title>Admit Card</title><link rel='stylesheet' href='styles.css'></head><body></body></html>");
  win.document.body.append(node);
  win.document.close();
  win.focus();
  win.print();
}

courseSelect.addEventListener("change", () => {
  bootSemesters(courseSelect.value);
  renderSubjects();
});

semesterSelect.addEventListener("change", renderSubjects);

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const optionalChecked = Array.from(document.querySelectorAll('input[name="optional"]:checked')).map((item) => item.value);

  if (optionalChecked.length > 2) {
    alert("Please choose up to 2 optional subjects only.");
    return;
  }

  const course = formData.get("course");
  const semester = formData.get("semester");

  const candidate = {
    enrollmentNo: formData.get("enrollmentNo"),
    abcId: formData.get("abcId"),
    name: formData.get("name"),
    fatherName: formData.get("fatherName"),
    motherName: formData.get("motherName"),
    email: formData.get("email"),
    mobile: formData.get("mobile"),
    aadhaarMobile: formData.get("aadhaarMobile"),
    gender: formData.get("gender"),
    category: formData.get("category"),
    course,
    semester,
    mandatorySubjects: courseData[course].mandatory[semester],
    optionalSubjects: optionalChecked,
    previousExams: {
      exam10: formData.get("exam10"),
      exam12: formData.get("exam12"),
      prevExam: formData.get("prevExam")
    },
    documents: {
      photo: readFiles(form.photo.files),
      signature: readFiles(form.signature.files),
      doc10: readFiles(form.doc10.files),
      doc12: readFiles(form.doc12.files),
      docPrevious: readFiles(form.docPrevious.files)
    },
    verified: false
  };

  candidates.push(candidate);
  renderCandidates();
  form.reset();
  mandatorySubjects.innerHTML = "";
  optionalSubjects.innerHTML = "";
  alert("Candidate form submitted successfully.");
});

candidateRows.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) {
    return;
  }

  const index = Number(button.dataset.index);
  if (Number.isNaN(index)) {
    return;
  }

  if (button.dataset.action === "verify") {
    candidates[index].verified = true;
    renderCandidates();
    return;
  }

  if (button.dataset.action === "admit") {
    buildAdmitCard(candidates[index]);
  }
});

document.querySelectorAll(".tab-btn").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach((btn) => btn.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach((panel) => panel.classList.remove("active"));
    button.classList.add("active");
    document.getElementById(button.dataset.tab).classList.add("active");
  });
});

bootCourses();
