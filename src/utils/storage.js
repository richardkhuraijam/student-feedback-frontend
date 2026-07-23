const KEYS = {
  users: 'feedback_users',
  courses: 'feedback_courses',
  enrollments: 'feedback_enrollments',
  feedback: 'feedback_feedback',
  currentUser: 'feedback_currentUser',
};

const memoryStore = {};

function canUseLocalStorage() {
  try {
    const testKey = '__feedback_test__';
    localStorage.setItem(testKey, '1');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

const useMemory = !canUseLocalStorage();

export function getItem(key) {
  const storageKey = KEYS[key] ?? key;
  try {
    if (useMemory) {
      const data = memoryStore[storageKey];
      return data ? JSON.parse(data) : null;
    }
    const data = localStorage.getItem(storageKey);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function setItem(key, value) {
  const storageKey = KEYS[key] ?? key;
  try {
    const serialized = JSON.stringify(value);
    if (useMemory) {
      memoryStore[storageKey] = serialized;
      return;
    }
    localStorage.setItem(storageKey, serialized);
  } catch {
    // ignore write failures
  }
}

export function removeItem(key) {
  const storageKey = KEYS[key] ?? key;
  try {
    if (useMemory) {
      delete memoryStore[storageKey];
      return;
    }
    localStorage.removeItem(storageKey);
  } catch {
    // ignore remove failures
  }
}

export function getRawItem(key) {
  const storageKey = KEYS[key] ?? key;
  try {
    if (useMemory) return memoryStore[storageKey] ?? null;
    return localStorage.getItem(storageKey);
  } catch {
    return null;
  }
}

export function setRawItem(key, value) {
  const storageKey = KEYS[key] ?? key;
  try {
    if (useMemory) {
      memoryStore[storageKey] = value;
      return;
    }
    localStorage.setItem(storageKey, value);
  } catch {
    // ignore write failures
  }
}

export function getUsers() {
  return getItem('users') ?? [];
}

export function setUsers(users) {
  setItem('users', users);
}

export function getCourses() {
  return getItem('courses') ?? [];
}

export function setCourses(courses) {
  setItem('courses', courses);
}

export function getEnrollments() {
  return getItem('enrollments') ?? [];
}

export function setEnrollments(enrollments) {
  setItem('enrollments', enrollments);
}

export function getFeedback() {
  return getItem('feedback') ?? [];
}

export function setFeedback(feedback) {
  setItem('feedback', feedback);
}

export function getCurrentUser() {
  return getItem('currentUser');
}

export function setCurrentUser(user) {
  if (user) {
    setItem('currentUser', user);
  } else {
    removeItem('currentUser');
  }
}

export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
