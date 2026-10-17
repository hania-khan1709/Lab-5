const student = {
  id: 101,
  name: 'Ali',
  marks: 0,
  scholarship: false,
  address: {
    city: 'Islamabad',
    sector: 'F-10'
  },
  contact: {
    email: 'ali@university.edu'
  }
};

const update = {
  name: 'Ali Khan',
  address: {
    city: 'Rawalpindi'
  },
  contact: {
    phone: '03001234567'
  }
};

function updateStudentProfile(originalStudent, updateData) {
  const {
    id = 101,
    name: originalName = '',
    marks: originalMarks = 0,
    scholarship: originalScholarship = false,
    address: originalAddress = {},
    contact: originalContact = {}
  } = originalStudent;

  const {
    name: updatedName,
    marks: updatedMarks,
    scholarship: updatedScholarship,
    address: updatedAddress = {},
    contact: updatedContact = {}
  } = updateData;

  const {
    city: originalCity = '',
    sector: originalSector = '',
    ...restOriginalAddress
  } = originalAddress;

  const {
    city: newCity,
    sector: newSector,
    ...restNewAddress
  } = updatedAddress;

  const {
    email: originalEmail = '',
    ...restOriginalContact
  } = originalContact;

  const {
    email: newEmail,
    phone: newPhone,
    ...restNewContact
  } = updatedContact;

  return {
    id,
    name: updatedName ?? originalName,
    marks: updatedMarks ?? originalMarks,
    scholarship: updatedScholarship ?? originalScholarship,
    address: {
      ...restOriginalAddress,
      city: newCity ?? originalCity,
      sector: newSector ?? originalSector
    },
    contact: {
      ...restOriginalContact,
      email: newEmail ?? originalEmail,
      phone: newPhone ?? originalContact?.phone
    }
  };
}

const updatedStudent = updateStudentProfile(student, update);

console.log('=== 1. PROFILE UPDATE RESULTS ===');
console.log('Original Student:', JSON.stringify(student, null, 2));
console.log('Updated Student:', JSON.stringify(updatedStudent, null, 2));

console.log('\n=== 2. REFERENCE EQUALITY PROOF ===');

const isStudentEqual = student === updatedStudent;
console.log(`* Original object vs Updated object are equal? ${isStudentEqual}`);
console.log('  Explanation: They are different because the spread operator and object literals create a new root object reference in memory to preserve immutability.');

const isAddressEqual = student.address === updatedStudent.address;
console.log(`* Original address vs Updated address are equal? ${isAddressEqual}`);
console.log('  Explanation: They are different references because a new address object was constructed with updated properties while preserving untouched nested fields.');

const isContactEqual = student.contact === updatedStudent.contact;
console.log(`* Original contact vs Updated contact are equal? ${isContactEqual}`);
console.log('  Explanation: They are different references because the contact object was spread into a new object structure to safely merge the new phone number without mutating the original.');