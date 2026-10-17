const getStudent = (studentId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (studentId === 101) {
        resolve({ id: 101, name: 'Ali', completedCourses: ['CS201'] });
      } else {
        reject(new Error('Student does not exist.'));
      }
    }, 200);
  });
};

const getCourse = (courseCode) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (courseCode === 'CS401') {
        resolve({ code: 'CS401', prerequisite: 'CS201', seats: 5 });
      } else {
        reject(new Error('Course does not exist.'));
      }
    }, 200);
  });
};

const checkPrerequisites = (data) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const { student, course } = data;
      if (student.completedCourses.includes(course.prerequisite)) {
        resolve(data);
      } else {
        reject(new Error('Prerequisite not completed.'));
      }
    }, 200);
  });
};

const checkSeats = (data) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const { course } = data;
      if (course.seats > 0) {
        resolve(data);
      } else {
        reject(new Error('Course is full.'));
      }
    }, 200);
  });
};

const registerStudent = (data) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const { student, course } = data;
      resolve({
        studentId: student.id,
        course: course.code,
        status: 'REGISTERED'
      });
    }, 200);
  });
};

const sendEmail = () => Promise.resolve({ service: 'Email', status: 'fulfilled' });
const sendSMS = () => Promise.reject(new Error('SMS Gateway timeout')); // Simulated failure
const writeAuditLog = () => Promise.resolve({ service: 'Audit', status: 'fulfilled' });

const courseServerA = () => new Promise((resolve) => setTimeout(() => resolve('Data from Server A'), 400));
const courseServerB = () => new Promise((resolve) => setTimeout(() => resolve('Data from Server B'), 100));

async function runTask7() {
  console.log('=== PART A: Registration Chain ===');
  try {
    const registrationResult = await getStudent(101)
      .then(student => getCourse('CS401').then(course => ({ student, course })))
      .then(data => checkPrerequisites(data))
      .then(data => checkSeats(data))
      .then(data => registerStudent(data));

    console.log('Registration Success:', registrationResult);

    console.log('\n=== PART B: Post-Registration Services ===');
    const postResults = await Promise.allSettled([sendEmail(), sendSMS(), writeAuditLog()]);
    const formattedReport = postResults.map(res => ({
      service: res.value?.service || 'SMS',
      status: res.status
    }));
    console.log(formattedReport);

    console.log('\n=== PART C: Service Selection ===');
    const firstSuccess = await Promise.any([courseServerA(), courseServerB()]);
    console.log('Accepted first successful course server result:', firstSuccess);
    console.log('Justification: Promise.any is chosen because it ignores early rejections and waits for the first successfully resolved promise, unlike Promise.race which returns the first settled state regardless of success or failure.');

  } catch (error) {
    console.error('Workflow Error:', error.message);
  }
}

runTask7();