import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Text "mo:base/Text";

actor ExamManagement {
  public type StudentInput = {
    name : Text;
    abcid : Text;
    enrollmentNumber : Text;
    rollNumber : Text;
    motherName : Text;
    gender : Text;
    category : Text;
    caste : Text;
    course : Text;
    semester : Nat;
    subjects : [Text];
  };

  public type Student = {
    id : Nat;
    name : Text;
    abcid : Text;
    enrollmentNumber : Text;
    rollNumber : Text;
    motherName : Text;
    gender : Text;
    category : Text;
    caste : Text;
    course : Text;
    semester : Nat;
    subjects : [Text];
  };

  public type SubjectMarksInput = {
    subject : Text;
    internal : Nat;
    external : Nat;
    practical : Nat;
  };

  public type SubjectMarks = {
    subject : Text;
    internal : Nat;
    external : Nat;
    practical : Nat;
    total : Nat;
  };

  public type ResultInput = {
    studentId : Nat;
    course : Text;
    semester : Nat;
    marks : [SubjectMarksInput];
  };

  public type Result = {
    studentId : Nat;
    course : Text;
    semester : Nat;
    marks : [SubjectMarks];
    grandTotal : Nat;
  };

  stable var nextStudentId : Nat = 1;
  stable var studentsStable : [Student] = [];
  stable var resultsStable : [Result] = [];

  let studentsMap = HashMap.HashMap<Nat, Student>(16, Nat.equal, Nat.hash);
  let resultsMap = HashMap.HashMap<Text, Result>(16, Text.equal, Text.hash);

  system func postupgrade() {
    for (s in studentsStable.vals()) {
      studentsMap.put(s.id, s);
    };
    for (r in resultsStable.vals()) {
      resultsMap.put(resultKey(r.studentId, r.course, r.semester), r);
    };
  };

  system func preupgrade() {
    studentsStable := Iter.toArray(studentsMap.vals());
    resultsStable := Iter.toArray(resultsMap.vals());
  };

  func resultKey(studentId : Nat, course : Text, semester : Nat) : Text {
    Nat.toText(studentId) # "::" # course # "::" # Nat.toText(semester)
  };

  func computeSubjectTotal(m : SubjectMarksInput) : SubjectMarks {
    {
      subject = m.subject;
      internal = m.internal;
      external = m.external;
      practical = m.practical;
      total = m.internal + m.external + m.practical;
    }
  };

  public shared func registerStudent(payload : StudentInput) : async Student {
    let id = nextStudentId;
    nextStudentId += 1;

    let stored : Student = {
      id = id;
      name = payload.name;
      abcid = payload.abcid;
      enrollmentNumber = payload.enrollmentNumber;
      rollNumber = payload.rollNumber;
      motherName = payload.motherName;
      gender = payload.gender;
      category = payload.category;
      caste = payload.caste;
      course = payload.course;
      semester = payload.semester;
      subjects = payload.subjects;
    };

    studentsMap.put(id, stored);
    stored
  };

  public query func listStudents(course : Text, semester : Nat) : async [Student] {
    let buf = Buffer.Buffer<Student>(0);
    for (s in studentsMap.vals()) {
      if (s.course == course and s.semester == semester) {
        buf.add(s);
      };
    };
    Buffer.toArray(buf)
  };

  public query func listAllStudents() : async [Student] {
    Iter.toArray(studentsMap.vals())
  };

  public shared func saveResult(payload : ResultInput) : async Result {
    let computedMarks = Array.map<SubjectMarksInput, SubjectMarks>(payload.marks, computeSubjectTotal);
    let grandTotal = Array.foldLeft<SubjectMarks, Nat>(computedMarks, 0, func(acc, row) {
      acc + row.total
    });

    let stored : Result = {
      studentId = payload.studentId;
      course = payload.course;
      semester = payload.semester;
      marks = computedMarks;
      grandTotal = grandTotal;
    };

    resultsMap.put(resultKey(payload.studentId, payload.course, payload.semester), stored);
    stored
  };

  public query func getResult(studentId : Nat, course : Text, semester : Nat) : async ?Result {
    resultsMap.get(resultKey(studentId, course, semester))
  };
};
