const applicants = [
  {
    id: 'A101',
    name: 'Sara Khan',
    age: '19',
    matricMarks: '91',
    intermediateMarks: '87',
    entryTest: '78',
    program: 'BSCS',
    feePaid: 'true'
  },
  {
    id: 'A102',
    name: 'Ahmed Ali',
    age: 'twenty',
    matricMarks: '88',
    intermediateMarks: '', 
    entryTest: '72',
    program: 'BSSE',
    feePaid: 'false'
  },
  {
    id: 'A103',
    name: 'Hassan',
    age: '18',
    matricMarks: '76',
    intermediateMarks: '83',
    entryTest: '91',
    program: 'BSAI',
    feePaid: 'true'
  },
  {
    id: 'A104',
    name: 'Ayesha Malik',
    age: '17', 
    matricMarks: '60',
    intermediateMarks: '60',
    entryTest: '60',
    program: 'BSCS',
    feePaid: 'true'
  },
  {
    id: 'A105',
    name: 'Zainab Khalid',
    age: '31', 
    matricMarks: '85',
    intermediateMarks: '80',
    entryTest: '75',
    program: 'BSSE',
    feePaid: 'true'
  }
];

const SUPPORTED_PROGRAMS = ['BSCS', 'BSSE', 'BSAI'];
function processApplicant(applicant) {
  if (
    !applicant.id ||
    !applicant.name ||
    applicant.age === '' ||
    applicant.matricMarks === '' ||
    applicant.intermediateMarks === '' ||
    applicant.entryTest === '' ||
    !applicant.program ||
    applicant.feePaid === ''
  ) {
    return { ...applicant, status: 'INVALID DATA', reason: 'Missing required fields' };
  }

  const age = Number(applicant.age);
  const matricMarks = Number(applicant.matricMarks);
  const intermediateMarks = Number(applicant.intermediateMarks);
  const entryTest = Number(applicant.entryTest);
  const feePaid = applicant.feePaid === 'true';

  if (
    Number.isNaN(age) ||
    Number.isNaN(matricMarks) ||
    Number.isNaN(intermediateMarks) ||
    Number.isNaN(entryTest)
  ) {
    return { ...applicant, status: 'INVALID DATA', reason: 'Invalid numeric conversion' };
  }

  if (age < 17 || age > 30) {
    return { ...applicant, status: 'INVALID DATA', reason: 'Age out of valid range (17-30)' };
  }

  // Validate marks range [0, 100]
  if (
    matricMarks < 0 || matricMarks > 100 ||
    intermediateMarks < 0 || intermediateMarks > 100 ||
    entryTest < 0 || entryTest > 100
  ) {
    return { ...applicant, status: 'INVALID DATA', reason: 'Marks out of range (0-100)' };
  }

  if (!SUPPORTED_PROGRAMS.includes(applicant.program)) {
    return { ...applicant, status: 'INVALID DATA', reason: 'Unsupported program' };
  }

  const merit = Number(((matricMarks * 0.20) + (intermediateMarks * 0.30) + (entryTest * 0.50)).toFixed(2));

  let status = 'REJECTED';
  const isEligible = merit >= 70 && entryTest >= 60 && intermediateMarks >= 60;

  if (isEligible) {
    if (merit >= 75 && feePaid) {
      status = 'SELECTED';
    } else {
      status = 'WAITING';
    }
  }

  return {
    ...applicant,
    sanitized: { age, matricMarks, intermediateMarks, entryTest, feePaid, merit },
    status
  };
}
function processAdmissions(applicantList) {
  return applicantList.map(app => processApplicant(app));
}

function generateSummary(processedResults) {
  const validApplicants = processedResults.filter(app => app.status !== 'INVALID DATA');
  const invalidCount = processedResults.length - validApplicants.length;
  const validCount = validApplicants.length;

  let highestMeritApp = null;
  let lowestMeritApp = null;
  let totalMerit = 0;

  const programCounts = {};
  SUPPORTED_PROGRAMS.forEach(prog => {
    programCounts[prog] = 0;
  });

  validApplicants.forEach(app => {
    if (programCounts[app.program] !== undefined) {
      programCounts[app.program]++;
    }

    const currentMerit = app.sanitized.merit;
    totalMerit += currentMerit;

    if (!highestMeritApp || currentMerit > highestMeritApp.sanitized.merit) {
      highestMeritApp = app;
    }

    if (!lowestMeritApp || currentMerit < lowestMeritApp.sanitized.merit) {
      lowestMeritApp = app;
    }
  });

  const averageMerit = validCount > 0 ? Number((totalMerit / validCount).toFixed(2)) : 0;

  return {
    totalApplicants: processedResults.length,
    validApplicants: validCount,
    invalidApplicants: invalidCount,
    highestMeritApplicant: highestMeritApp ? { name: highestMeritApp.name, merit: highestMeritApp.sanitized.merit } : null,
    lowestMeritValidApplicant: lowestMeritApp ? { name: lowestMeritApp.name, merit: lowestMeritApp.sanitized.merit } : null,
    averageMerit,
    programCounts
  };
}

const results = processAdmissions(applicants);
const summary = generateSummary(results);

console.log('=== ADMISSION PROCESSING RESULTS ===');
console.log(JSON.stringify(results, null, 2));

console.log('\n=== FINAL SUMMARY ===');
console.log(JSON.stringify(summary, null, 2));