import React, { useMemo, useState } from 'react';

const COURSES = ['MA', 'MBA', 'MVA', 'BA', 'BSC'];
const SEMESTERS = [1, 2, 3, 4];
const GENDERS = ['Male', 'Female', 'Other'];
const CATEGORIES = ['General', 'OBC', 'SC', 'ST', 'EWS'];

const subjectMap = {
  MA: {
    1: ['Classical Theory', 'Research Methods', 'Indian Literature'],
    2: ['Modern Theory', 'Linguistics', 'Comparative Literature'],
    3: ['Literary Criticism', 'Translation Studies', 'World Literature'],
    4: ['Dissertation', 'Postcolonial Studies', 'Elective']
  },
  MBA: {
    1: ['Management Principles', 'Accounting', 'Business Communication'],
    2: ['Marketing', 'Finance', 'Operations'],
    3: ['HRM', 'Business Analytics', 'Strategic Management'],
    4: ['Entrepreneurship', 'Project Management', 'Major Project']
  },
  MVA: {
    1: ['Art History', 'Studio Practice I', 'Visual Language'],
    2: ['Studio Practice II', 'Digital Arts', 'Aesthetics'],
    3: ['Curatorial Studies', 'Mixed Media', 'Art Criticism'],
    4: ['Portfolio Development', 'Exhibition Design', 'Major Studio']
  },
  BA: {
    1: ['History', 'Political Science', 'Sociology'],
    2: ['Economics', 'English', 'Geography'],
    3: ['Public Administration', 'Philosophy', 'Hindi'],
    4: ['Psychology', 'Education', 'Environmental Studies']
  },
  BSC: {
    1: ['Mathematics', 'Physics', 'Chemistry'],
    2: ['Biology', 'Computer Science', 'Statistics'],
    3: ['Data Structures', 'Organic Chemistry', 'Algebra'],
    4: ['Machine Learning', 'Electronics', 'Numerical Methods']
  }
};

const emptyStudent = {
  name: '',
  abcid: '',
  enrollmentNumber: '',
  rollNumber: '',
  motherName: '',
  gender: GENDERS[0],
  category: CATEGORIES[0],
  caste: '',
  course: COURSES[0],
  semester: 1
};

function toNumber(input) {
  const parsed = Number(input);
  if (Number.isNaN(parsed) || parsed < 0) return 0;
  return Math.min(parsed, 100);
}

function formLabel(field) {
  const labels = {
    name: 'Name',
    abcid: 'ABCID',
    enrollmentNumber: 'Enrollment Number',
    rollNumber: 'Roll Number',
    motherName: 'Mother Name',
    gender: 'Gender',
    category: 'Category',
    caste: 'Caste',
    course: 'Course',
    semester: 'Semester'
  };
  return labels[field] ?? field;
}

export default function App() {
  const [students, setStudents] = useState([]);
  const [studentForm, setStudentForm] = useState(emptyStudent);
  const [resultCourse, setResultCourse] = useState(COURSES[0]);
  const [resultSemester, setResultSemester] = useState(1);
  const [marksState, setMarksState] = useState({});
  const [lastSavedResult, setLastSavedResult] = useState('');

  const currentSubjects = useMemo(
    () => subjectMap[studentForm.course]?.[studentForm.semester] ?? [],
    [studentForm.course, studentForm.semester]
  );

  const resultStudents = useMemo(
    () => students.filter((s) => s.course === resultCourse && Number(s.semester) === Number(resultSemester)),
    [students, resultCourse, resultSemester]
  );

  const handleStudentChange = (event) => {
    const { name, value } = event.target;
    setStudentForm((prev) => ({
      ...prev,
      [name]: name === 'semester' ? Number(value) : value
    }));
  };

  const registerStudent = (event) => {
    event.preventDefault();
    const id = students.length + 1;
    const nextStudent = { ...studentForm, id, subjects: currentSubjects };
    setStudents((prev) => [...prev, nextStudent]);
    setStudentForm((prev) => ({ ...emptyStudent, course: prev.course, semester: prev.semester }));
  };

  const updateMarks = (studentId, subject, field, value) => {
    setMarksState((prev) => {
      const studentMarks = prev[studentId] ?? {};
      const current = studentMarks[subject] ?? { internal: 0, external: 0, practical: 0 };
      return {
        ...prev,
        [studentId]: {
          ...studentMarks,
          [subject]: {
            ...current,
            [field]: toNumber(value)
          }
        }
      };
    });
  };

  const saveResultSheet = (student) => {
    const marks = marksState[student.id] ?? {};
    const total = student.subjects.reduce((acc, subject) => {
      const row = marks[subject] ?? { internal: 0, external: 0, practical: 0 };
      return acc + row.internal + row.external + row.practical;
    }, 0);
    setLastSavedResult(`Saved result for ${student.name} (${student.rollNumber}) with grand total ${total}.`);
  };

  return (
    <main className="container">
      <h1>University Exam Management Module</h1>

      <section className="card">
        <h2>1) Student Registration</h2>
        <form onSubmit={registerStudent} className="grid">
          {Object.keys(emptyStudent).map((field) => (
            <label key={field}>
              {formLabel(field)}
              {field === 'course' ? (
                <select name={field} value={studentForm[field]} onChange={handleStudentChange}>
                  {COURSES.map((course) => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
              ) : field === 'semester' ? (
                <select name={field} value={studentForm[field]} onChange={handleStudentChange}>
                  {SEMESTERS.map((sem) => (
                    <option key={sem} value={sem}>{sem}</option>
                  ))}
                </select>
              ) : field === 'gender' ? (
                <select name={field} value={studentForm[field]} onChange={handleStudentChange}>
                  {GENDERS.map((gender) => (
                    <option key={gender} value={gender}>{gender}</option>
                  ))}
                </select>
              ) : field === 'category' ? (
                <select name={field} value={studentForm[field]} onChange={handleStudentChange}>
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              ) : (
                <input name={field} value={studentForm[field]} onChange={handleStudentChange} required={field !== 'caste'} />
              )}
            </label>
          ))}
          <div className="subjects">
            <strong>Mapped Subjects:</strong> {currentSubjects.join(', ')}
          </div>
          <button type="submit">Register Student</button>
        </form>
      </section>

      <section className="card">
        <h2>2) Result Management</h2>
        <div className="filters">
          <label>
            Course
            <select value={resultCourse} onChange={(event) => setResultCourse(event.target.value)}>
              {COURSES.map((course) => (
                <option key={course} value={course}>{course}</option>
              ))}
            </select>
          </label>
          <label>
            Semester
            <select value={resultSemester} onChange={(event) => setResultSemester(Number(event.target.value))}>
              {SEMESTERS.map((sem) => (
                <option key={sem} value={sem}>{sem}</option>
              ))}
            </select>
          </label>
        </div>

        {resultStudents.map((student) => {
          const rows = marksState[student.id] ?? {};
          const grandTotal = student.subjects.reduce((sum, subject) => {
            const row = rows[subject] ?? { internal: 0, external: 0, practical: 0 };
            return sum + row.internal + row.external + row.practical;
          }, 0);

          return (
            <article className="student-card" key={student.id}>
              <h3>{student.name} ({student.rollNumber})</h3>
              <table>
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Internal</th>
                    <th>External</th>
                    <th>Practical</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {student.subjects.map((subject) => {
                    const row = rows[subject] ?? { internal: 0, external: 0, practical: 0 };
                    const total = row.internal + row.external + row.practical;
                    return (
                      <tr key={subject}>
                        <td>{subject}</td>
                        {['internal', 'external', 'practical'].map((field) => (
                          <td key={field}>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={row[field]}
                              onChange={(event) => updateMarks(student.id, subject, field, event.target.value)}
                            />
                          </td>
                        ))}
                        <td>{total}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="result-actions">
                <strong>Grand Total: {grandTotal}</strong>
                <button type="button" onClick={() => saveResultSheet(student)}>Save Result</button>
              </div>
            </article>
          );
        })}

        {resultStudents.length === 0 && <p>No students found for selected course/semester.</p>}
        {lastSavedResult && <p className="saved-message">{lastSavedResult}</p>}
      </section>
    </main>
  );
}
