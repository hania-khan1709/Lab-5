import { processTranscriptJSON } from './transcriptService.mjs';

const validTranscriptJSON = JSON.stringify({
  id: 101,
  name: "Ali",
  courses: [
    { code: "CS301", marks: 81 },
    { code: "CS302", marks: 74 }
  ]
});

const invalidJSONString = '{"id": 102, "name": "Sara", courses: [invalid json]}';

console.log('=== RUNNING TRANSCRIPT PROCESSING TESTS ===\n');

try {
  console.log('--- Test 1: Valid Transcript Processing ---');
  const result = processTranscriptJSON(validTranscriptJSON);
  console.log(result.reportJSON);
} catch (error) {
  console.error('Error:', error.message);
} finally {
  console.log('[Test 1 Finished]\n');
}

try {
  console.log('--- Test 2: Fault Tolerance (Malformed JSON) ---');
  processTranscriptJSON(invalidJSONString);
} catch (error) {
  if (error instanceof SyntaxError) {
    console.error('Caught expected SyntaxError:', error.message);
  }
} finally {
  console.log('[Test 2 Finished]');
}