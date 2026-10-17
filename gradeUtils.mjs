export function calculateGrade(marks) {
  if (marks >= 85) return 'A';
  if (marks >= 80) return 'A-';
  if (marks >= 75) return 'B+';
  if (marks >= 70) return 'B';
  if (marks >= 65) return 'B-';
  if (marks >= 60) return 'C+';
  if (marks >= 50) return 'C';
  return 'F';
}

export function calculateAverage(courses) {
  if (!courses || courses.length === 0) return 0;
  const total = courses.reduce((sum, course) => sum + course.marks, 0);
  return Number((total / courses.length).toFixed(2));
}

export function calculateGPA(courses) {
  if (!courses || courses.length === 0) return 0.0;
  let totalGradePoints = 0;
  courses.forEach(course => {
    let gp = 0.0;
    const m = course.marks;
    if (m >= 85) gp = 4.0;
    else if (m >= 80) gp = 3.7;
    else if (m >= 75) gp = 3.3;
    else if (m >= 70) gp = 3.0;
    else if (m >= 65) gp = 2.7;
    else if (m >= 60) gp = 2.3;
    else if (m >= 50) gp = 2.0;
    else gp = 0.0;
    totalGradePoints += gp;
  });
  return Number((totalGradePoints / courses.length).toFixed(2));
}