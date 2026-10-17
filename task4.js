class Person {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
  introduce() {
    return `Hi, I am ${this.name}, and my email is ${this.email}.`;
  }
}

class Student extends Person {
  constructor(name, email, rollNo, marks) {
    super(name, email); 
    this.rollNo = rollNo;
    this.marks = marks;
  }
  introduce() {
    return `${super.introduce()} I am a Student with Roll No: ${this.rollNo}.`;
  }

  getResult() {
    return this.marks >= 50 ? 'PASS' : 'FAIL';
  }
}

class FacultyMember extends Person {
  constructor(name, email, employeeId, department) {
    super(name, email); // Reuse parent constructor
    this.employeeId = employeeId;
    this.department = department;
  }
  introduce() {
    return `${super.introduce()} I am a Faculty Member in the ${this.department} department (ID: ${this.employeeId}).`;
  }
}

console.log('=== A. RUNTIME POLYMORPHISM DEMONSTRATION ===');
const users = [
  new Student('Ali', 'ali@university.edu', 'BSCS-101', 82),
  new FacultyMember('Dr. Zafar', 'zafar@university.edu', 'EMP-402', 'Computer Science'),
  new Student('Sara', 'sara@university.edu', 'BSSE-204', 45)
];
users.forEach(user => {
  console.log(user.introduce());
});

console.log('\n--- Instanceof Verification ---');
console.log(`Is users[0] an instance of Student? ${users[0] instanceof Student}`);
console.log(`Is users[0] an instance of Person? ${users[0] instanceof Person}`);
console.log(`Is users[1] an instance of FacultyMember? ${users[1] instanceof FacultyMember}`);

console.log('\n=== B. THIS, CALL(), AND BIND() CHALLENGE ===');

const guest = {
  name: 'Dr. Ahmed',
  email: 'ahmed@example.com'
};
const guestIntroduction = Person.prototype.introduce.call(guest);
console.log('1. Using call() with guest object:');
console.log(guestIntroduction);

const sampleStudent = new Student('Hassan', 'hassan@university.edu', 'BSAI-303', 75);
const detachedIntroduce = sampleStudent.introduce;

console.log('\n2. Detached Method Investigation:');
console.log('Explanation: When a method is detached into a standalone variable (const fn = student.introduce), it loses its implicit object context. When invoked independently as fn(), `this` becomes `undefined` (in strict mode), causing an error when trying to access `this.name` or `super` references.');

try {
  detachedIntroduce();
} catch (error) {
  console.log('Captured error upon invoking detached method:', error.message);
}

const safelyBoundIntroduce = sampleStudent.introduce.bind(sampleStudent);
console.log('\n3. Using bind() for safe execution:');
console.log(safelyBoundIntroduce());