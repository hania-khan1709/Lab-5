// Task 2 - Academic Performance Intelligence Engine

const results = [
  { id: 1, name: 'Ali', department: 'CS', course: 'FSWD', marks: 47 },
  { id: 2, name: 'Sara', department: 'CS', course: 'FSWD', marks: 73 },
  { id: 3, name: 'Usman', department: 'SE', course: 'FSWD', marks: 64 },
  { id: 4, name: 'Hina', department: 'AI', course: 'FSWD', marks: 91 },
  { id: 5, name: 'Ahmed', department: 'SE', course: 'FSWD', marks: 82 },
  { id: 6, name: 'Zoya', department: 'AI', course: 'FSWD', marks: 91 }
];

function getGradeDetails(marks) {
  let grade, gradePoints;
  
  if (marks >= 85) { grade = 'A'; gradePoints = 4.0; }
  else if (marks >= 80) { grade = 'A-'; gradePoints = 3.7; }
  else if (marks >= 75) { grade = 'B+'; gradePoints = 3.3; }
  else if (marks >= 70) { grade = 'B'; gradePoints = 3.0; }
  else if (marks >= 65) { grade = 'B-'; gradePoints = 2.7; }
  else if (marks >= 60) { grade = 'C+'; gradePoints = 2.3; }
  else if (marks >= 50) { grade = 'C'; gradePoints = 2.0; }
  else { grade = 'F'; gradePoints = 0.0; }

  const status = marks >= 50 ? 'PASS' : 'FAIL';
  return { grade, gradePoints, status };
}

const processedResults = results.map(student => {
  const details = getGradeDetails(student.marks);
  return {
    ...student,
    ...details
  };
});

const rankedMeritList = [...results].sort((a, b) => {
  if (b.marks !== a.marks) {
    return b.marks - a.marks; 
  }
  return a.name.localeCompare(b.name); 
});

const departmentStats = results.reduce((acc, student) => {
  const dept = student.department;
  
  if (!acc[dept]) {
    acc[dept] = {
      students: 0,
      totalMarks: 0,
      highest: student.marks,
      passed: 0
    };
  }

  acc[dept].students += 1;
  acc[dept].totalMarks += student.marks;

  if (student.marks > acc[dept].highest) {
    acc[dept].highest = student.marks;
  }

  if (student.marks >= 50) {
    acc[dept].passed += 1;
  }

  return acc;
}, {});

Object.keys(departmentStats).forEach(dept => {
  const stats = departmentStats[dept];
  stats.average = Number((stats.totalMarks / stats.students).toFixed(2));
  delete stats.totalMarks; 
});

const firstAbove85 = results.find(student => student.marks > 85);
const firstFailedIndex = results.findIndex(student => student.marks < 50);
const hasFailed = results.some(student => student.marks < 50);
const allValidMarks = results.every(student => student.marks >= 0 && student.marks <= 100);
const totalMarksSum = results.reduce((sum, student) => sum + student.marks, 0);
const overallAverage = totalMarksSum / results.length;
const aboveOverallAverageStudents = results.filter(student => student.marks > overallAverage);

const topThreeNames = [...results]
  .sort((a, b) => b.marks - a.marks)
  .slice(0, 3)
  .map(student => student.name);

console.log('=== A. RESULT PROCESSING ===');
console.log(JSON.stringify(processedResults, null, 2));

console.log('\n=== B. RANKED MERIT LIST ===');
console.log(JSON.stringify(rankedMeritList, null, 2));

console.log('\n=== C. DEPARTMENT STATISTICS ===');
console.log(JSON.stringify(departmentStats, null, 2));

console.log('\n=== D. ACADEMIC QUERIES ===');
console.log('1. First student scoring > 85:', firstAbove85);
console.log('2. Index of first failed student:', firstFailedIndex);
console.log('3. At least one student failed:', hasFailed);
console.log('4. Every student has valid marks (0-100):', allValidMarks);
console.log('5. Overall average marks:', overallAverage.toFixed(2));
console.log('   Students above overall average:', aboveOverallAverageStudents.map(s => s.name));
console.log('6. Names of the top 3 students:', topThreeNames);