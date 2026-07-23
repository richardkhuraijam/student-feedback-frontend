export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateLogin({ email, password }) {
  const errors = {};
  if (!email.trim()) errors.email = 'Email is required';
  else if (!isValidEmail(email)) errors.email = 'Invalid email format';
  if (!password) errors.password = 'Password is required';
  return errors;
}

export function validateSignUp({ name, email, password, role }) {
  const errors = {};
  if (!name.trim()) errors.name = 'Name is required';
  if (!email.trim()) errors.email = 'Email is required';
  else if (!isValidEmail(email)) errors.email = 'Invalid email format';
  if (!password) errors.password = 'Password is required';
  else if (password.length < 6) errors.password = 'Password must be at least 6 characters';
  if (!role) errors.role = 'Role is required';
  return errors;
}

export function validateCourse({ name, code, instructor, semester }) {
  const errors = {};
  if (!name.trim()) errors.name = 'Course name is required';
  if (!code.trim()) errors.code = 'Course code is required';
  if (!instructor.trim()) errors.instructor = 'Instructor is required';
  if (!semester.trim()) errors.semester = 'Semester is required';
  return errors;
}

export function validateFeedback(ratings) {
  const errors = {};
  const keys = [
    'contentQuality',
    'teachingEffectiveness',
    'paceDifficulty',
    'learningMaterials',
    'overallSatisfaction',
  ];
  keys.forEach((key) => {
    if (!ratings[key]) errors[key] = 'Please select a rating';
  });
  return errors;
}
