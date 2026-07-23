const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function getToken() {
  return localStorage.getItem('feedback_token');
}

export function setToken(token) {
  if (token) localStorage.setItem('feedback_token', token);
  else localStorage.removeItem('feedback_token');
}

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  let data = null;
  const text = await response.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { error: text };
    }
  }

  if (!response.ok) {
    const error = new Error(data?.error || 'Request failed');
    error.status = response.status;
    error.details = data?.details;
    throw error;
  }

  return data;
}

export const api = {
  signup: (body) =>
    request('/auth/signup', { method: 'POST', body: JSON.stringify(body) }),

  login: (body) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),

  me: () => request('/auth/me'),

  getEnrolledCourses: () => request('/courses/student/enrolled'),

  getCourse: (courseId) => request(`/courses/${courseId}`),

  getCourses: () => request('/courses'),

  createCourse: (body) =>
    request('/courses', { method: 'POST', body: JSON.stringify(body) }),

  updateCourse: (courseId, body) =>
    request(`/courses/${courseId}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  deleteCourse: (courseId) =>
    request(`/courses/${courseId}`, { method: 'DELETE' }),

  submitFeedback: (body) =>
    request('/feedback', { method: 'POST', body: JSON.stringify(body) }),

  getMyFeedback: () => request('/feedback/mine'),

  getMyFeedbackForCourse: (courseId) =>
    request(`/feedback/course/${courseId}`),

  getAllFeedback: (courseId) =>
    request(
      courseId && courseId !== 'all'
        ? `/feedback?courseId=${courseId}`
        : '/feedback'
    ),

  getFeedbackByCourse: () => request('/feedback/by-course'),

  getAdminStats: () => request('/admin/stats'),

  getStudents: () => request('/admin/students'),

  enrollStudent: (body) =>
    request('/admin/enrollments', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  unenrollStudent: (body) =>
    request('/admin/enrollments', {
      method: 'DELETE',
      body: JSON.stringify(body),
    }),
};
