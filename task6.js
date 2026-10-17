const studentsDB = {
  101: { id: 101, name: 'Ali', completedCourses: ['CS101', 'CS201'] },
  102: { id: 102, name: 'Sara', completedCourses: [] } // Missing prerequisites
};

const coursesDB = {
  'CS401': { code: 'CS401', prerequisite: 'CS201', seatsAvailable: 5, registeredStudents: [] },
  'CS501': { code: 'CS501', prerequisite: 'CS301', seatsAvailable: 0, registeredStudents: [] } // Full course
};

function loadStudent(studentId, callback) {
  setTimeout(() => {
    const student = studentsDB[studentId];
    if (!student) {
      return callback(new Error(`Student with ID ${studentId} does not exist.`));
    }
    callback(null, student);
  }, 300);
}

function checkPrerequisites(student, courseCode, callback) {
  setTimeout(() => {
    const course = coursesDB[courseCode];
    if (!course) {
      return callback(new Error(`Course ${courseCode} does not exist.`));
    }
    const hasCompleted = student.completedCourses.includes(course.prerequisite);
    if (!hasCompleted) {
      return callback(new Error(`Prerequisite (${course.prerequisite}) not completed for course ${courseCode}.`));
    }
    callback(null, { student, course });
  }, 300);
}

function checkSeats(data, callback) {
  setTimeout(() => {
    const { student, course } = data;
    if (course.registeredStudents.includes(student.id)) {
      return callback(new Error(`Student ${student.id} already registered for course ${course.code}.`));
    }
    if (course.seatsAvailable <= 0) {
      return callback(new Error(`Course ${course.code} is full.`));
    }
    callback(null, data);
  }, 300);
}

function registerCourse(data, callback) {
  setTimeout(() => {
    const { student, course } = data;
    course.registeredStudents.push(student.id);
    course.seatsAvailable -= 1;
    const confirmation = {
      studentId: student.id,
      course: course.code,
      status: 'REGISTERED'
    };
    callback(null, confirmation);
  }, 300);
}

function registerStudentWorkflow(studentId, courseCode, finalCallback) {
  loadStudent(studentId, (err, student) => {
    if (err) return finalCallback(err);

    checkPrerequisites(student, courseCode, (err, data) => {
      if (err) return finalCallback(err);

      checkSeats(data, (err, validData) => {
        if (err) return finalCallback(err);

        registerCourse(validData, (err, confirmation) => {
          if (err) return finalCallback(err);

          finalCallback(null, confirmation);
        });
      });
    });
  });
}
console.log('=== RUNNING LEGACY CALLBACK REGISTRATION TESTS ===\n');

console.log('--- Test 1: Successful Registration (Student 101, Course CS401) ---');
registerStudentWorkflow(101, 'CS401', (err, result) => {
  if (err) {
    console.error('Registration Failed:', err.message);
  } else {
    console.log('Registration Success:', result);
  }

  console.log('\n--- Test 2: Prerequisite Failure (Student 102, Course CS401) ---');
  registerStudentWorkflow(102, 'CS401', (err, result) => {
    if (err) {
      console.error('Registration Failed:', err.message);
    } else {
      console.log('Registration Success:', result);
    }

    console.log('\n--- Test 3: Course Full Failure (Student 101, Course CS501) ---');
    registerStudentWorkflow(101, 'CS501', (err, result) => {
      if (err) {
        console.error('Registration Failed:', err.message);
      } else {
        console.log('Registration Success:', result);
      }

      console.log('\n=== CALLBACK MAINTAINABILITY EXPLANATION ===');
      console.log('Why callback-based dependent workflows become difficult to maintain:');
      console.log('1. Callback Hell (Pyramid of Doom): As more dependent asynchronous steps are added (e.g., billing, auditing, notifications), code indents heavily to the right, severely reducing readability.');
      console.log('2. Boilerplate Error Handling: Every nested layer requires repetitive `if (err) return finalCallback(err)` checks, increasing maintenance overhead.');
      console.log('3. Control Flow Fragility: Managing execution order and handling asynchronous boundaries manually without native Promise syntax makes debugging and scaling complex workflows error-prone.');
    });
  });
});