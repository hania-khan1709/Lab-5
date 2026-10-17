function fakeFetch(url) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (url === '/network-error') {
        return reject(new Error('Network failure'));
      }
      if (url === '/invalid-json') {
        return resolve({
          ok: true,
          json: async () => { throw new SyntaxError('Invalid JSON format'); }
        });
      }
      if (url === '/404') {
        return resolve({ ok: false, status: 404, statusText: 'Not Found' });
      }
      if (url === '/500') {
        return resolve({ ok: false, status: 500, statusText: 'Internal Server Error' });
      }
      const dataMap = {
        '/users': [{ id: 1, name: 'Ali' }, { id: 2, name: 'Sara' }, { id: 3, name: 'Usman' }],
        '/courses': [{ code: 'CS301' }, { code: 'CS302' }, { code: 'CS401' }],
        '/results': [
          { studentId: 1, marks: 85 },
          { studentId: 2, marks: 74 },
          { studentId: 3, marks: 42 }
        ]
      };

      if (dataMap[url]) {
        resolve({
          ok: true,
          json: async () => dataMap[url]
        });
      } else {
        resolve({ ok: false, status: 404, statusText: 'Not Found' });
      }
    }, 200);
  });
}
async function getJSON(url, fetchImplementation = fakeFetch) {
  const response = await fetchImplementation(url);
  
  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
  }
  
  return await response.json();
}

async function fetchWithTimeout(url, milliseconds, fetchImplementation = fakeFetch) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), milliseconds);

  try {
    const fetchPromise = fetchImplementation(url, { signal: controller.signal });
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout/Abort')), milliseconds)
    );

    const response = await Promise.race([fetchPromise, timeoutPromise]);
    
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError' || error.message.includes('Timeout')) {
      throw new Error('Request timed out or aborted');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId); 
  }
}

async function loadDashboard() {
  console.log('=== CONCURRENT DASHBOARD LOADING ===');
  try {
    const [users, courses, results] = await Promise.all([
      getJSON('/users'),
      getJSON('/courses'),
      getJSON('/results')
    ]);

    const totalStudents = users.length;
    const totalCourses = courses.length;

    const totalMarks = results.reduce((sum, r) => sum + r.marks, 0);
    const overallAverage = totalMarks / results.length;

    let highestStudent = results[0];
    results.forEach(r => {
      if (r.marks > highestStudent.marks) highestStudent = r;
    });

    const failedStudentsCount = results.filter(r => r.marks < 50).length;

    const dashboardReport = {
      totalStudents,
      totalCourses,
      overallAverage: Number(overallAverage.toFixed(2)),
      highestPerformingStudentId: highestStudent.studentId,
      failedStudentsCount
    };

    console.log('Dashboard Report Generated Successfully:');
    console.log(dashboardReport);

  } catch (error) {
    console.error('Dashboard Loading Error:', error.message);
  }
}
loadDashboard();