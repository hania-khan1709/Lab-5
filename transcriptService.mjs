import Student from './Student.mjs';
import { calculateAverage as calcAvg, calculateGPA as calcGpa, calculateGrade } from './gradeUtils.mjs';

export function processTranscriptJSON(jsonString) {
  let rawData;
  try {
    rawData = JSON.parse(jsonString);
  } catch (error) {
    throw new SyntaxError('Invalid JSON format: Unable to parse transcript data.');
  }

  const records = Array.isArray(rawData) ? rawData : [rawData];
  const seenIds = new Set();
  const processedStudents = [];

  for (const record of records) {
    if (!record.id) throw new TypeError('Validation Error: Student ID is missing.');
    if (seenIds.has(record.id)) throw new Error(`Validation Error: Duplicate student ID (${record.id}).`);
    seenIds.add(record.id);

    const { id, name = 'Unknown', courses = [] } = record;
    const validatedCourses = [];

    for (const course of courses) {
      if (!course.code) throw new TypeError(`Validation Error: Course code is missing for student ID ${id}.`);
      if (typeof course.marks !== 'number' || course.marks < 0 || course.marks > 100) {
        throw new RangeError(`Range Error: Invalid marks for course ${course.code}.`);
      }
      validatedCourses.push({
        code: course.code,
        marks: course.marks,
        grade: calculateGrade(course.marks)
      });
    }

    const studentInstance = new Student(id, name, validatedCourses);
    processedStudents.push({
      student: studentInstance,
      average: calcAvg(validatedCourses),
      gpa: calcGpa(validatedCourses)
    });
  }

  const reportObject = {
    generatedAt: new Date().toISOString(),
    totalStudents: processedStudents.length,
    records: processedStudents
  };

  return {
    reportObject,
    reportJSON: JSON.stringify(reportObject, null, 2)
  };
}