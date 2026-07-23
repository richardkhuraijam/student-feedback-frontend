import {
  getUsers,
  setUsers,
  getCourses,
  setCourses,
  getEnrollments,
  setEnrollments,
  getFeedback,
  setFeedback,
  getRawItem,
  setRawItem,
} from './storage';

const SEED_FLAG = 'feedback_seeded';

export function initializeMockData() {
  if (getRawItem(SEED_FLAG)) return;

  const users = [
    {
      id: 'admin-1',
      name: 'Admin User',
      email: 'admin@university.edu',
      password: 'admin123',
      role: 'admin',
    },
    {
      id: 'student-1',
      name: 'Alice Johnson',
      email: 'alice@student.edu',
      password: 'student123',
      role: 'student',
    },
    {
      id: 'student-2',
      name: 'Bob Smith',
      email: 'bob@student.edu',
      password: 'student123',
      role: 'student',
    },
    {
      id: 'student-3',
      name: 'Carol Williams',
      email: 'carol@student.edu',
      password: 'student123',
      role: 'student',
    },
  ];

  const courses = [
    {
      id: 'course-1',
      name: 'Introduction to Computer Science',
      code: 'CS101',
      instructor: 'Dr. Sarah Chen',
      semester: 'Fall 2026',
    },
    {
      id: 'course-2',
      name: 'Data Structures & Algorithms',
      code: 'CS201',
      instructor: 'Prof. Michael Torres',
      semester: 'Fall 2026',
    },
    {
      id: 'course-3',
      name: 'Web Development',
      code: 'CS301',
      instructor: 'Dr. Emily Park',
      semester: 'Fall 2026',
    },
    {
      id: 'course-4',
      name: 'Database Systems',
      code: 'CS401',
      instructor: 'Prof. James Wilson',
      semester: 'Fall 2026',
    },
  ];

  const enrollments = [
    { studentId: 'student-1', courseId: 'course-1' },
    { studentId: 'student-1', courseId: 'course-2' },
    { studentId: 'student-1', courseId: 'course-3' },
    { studentId: 'student-2', courseId: 'course-1' },
    { studentId: 'student-2', courseId: 'course-3' },
    { studentId: 'student-2', courseId: 'course-4' },
    { studentId: 'student-3', courseId: 'course-2' },
    { studentId: 'student-3', courseId: 'course-4' },
  ];

  const feedback = [
    {
      id: 'fb-1',
      studentId: 'student-1',
      courseId: 'course-1',
      ratings: {
        contentQuality: 5,
        teachingEffectiveness: 4,
        paceDifficulty: 4,
        learningMaterials: 5,
        overallSatisfaction: 5,
      },
      comments: 'Excellent introductory course. Dr. Chen explains concepts clearly.',
      submittedAt: '2026-07-15T10:30:00.000Z',
    },
    {
      id: 'fb-2',
      studentId: 'student-2',
      courseId: 'course-1',
      ratings: {
        contentQuality: 4,
        teachingEffectiveness: 4,
        paceDifficulty: 3,
        learningMaterials: 4,
        overallSatisfaction: 4,
      },
      comments: 'Good course overall, but the pace could be slightly slower.',
      submittedAt: '2026-07-16T14:20:00.000Z',
    },
    {
      id: 'fb-3',
      studentId: 'student-2',
      courseId: 'course-3',
      ratings: {
        contentQuality: 5,
        teachingEffectiveness: 5,
        paceDifficulty: 4,
        learningMaterials: 5,
        overallSatisfaction: 5,
      },
      comments: 'Best web dev course I have taken. Very hands-on projects.',
      submittedAt: '2026-07-17T09:15:00.000Z',
    },
  ];

  setUsers(users);
  setCourses(courses);
  setEnrollments(enrollments);
  setFeedback(feedback);
  setRawItem(SEED_FLAG, 'true');
}

export function getStudentCount() {
  return getUsers().filter((u) => u.role === 'student').length;
}

export function getEnrolledCourses(studentId) {
  const enrollments = getEnrollments().filter((e) => e.studentId === studentId);
  const courses = getCourses();
  return enrollments
    .map((e) => courses.find((c) => c.id === e.courseId))
    .filter(Boolean);
}

export function hasSubmittedFeedback(studentId, courseId) {
  return getFeedback().some(
    (f) => f.studentId === studentId && f.courseId === courseId
  );
}

export function getStudentFeedback(studentId) {
  const feedback = getFeedback().filter((f) => f.studentId === studentId);
  const courses = getCourses();
  return feedback.map((f) => ({
    ...f,
    course: courses.find((c) => c.id === f.courseId),
  }));
}

export function getAverageRating(feedbackList) {
  if (!feedbackList.length) return 0;
  const ratingKeys = [
    'contentQuality',
    'teachingEffectiveness',
    'paceDifficulty',
    'learningMaterials',
    'overallSatisfaction',
  ];
  let total = 0;
  let count = 0;
  feedbackList.forEach((f) => {
    ratingKeys.forEach((key) => {
      if (f.ratings[key]) {
        total += f.ratings[key];
        count++;
      }
    });
  });
  return count ? (total / count).toFixed(1) : 0;
}

export function getFeedbackByCourse(courseId) {
  const feedback = getFeedback().filter((f) => f.courseId === courseId);
  const users = getUsers();
  return feedback.map((f) => ({
    ...f,
    student: users.find((u) => u.id === f.studentId),
  }));
}

export const RATING_QUESTIONS = [
  { key: 'contentQuality', label: 'Course content quality' },
  { key: 'teachingEffectiveness', label: "Instructor's teaching effectiveness" },
  { key: 'paceDifficulty', label: 'Course pace/difficulty' },
  { key: 'learningMaterials', label: 'Learning materials/resources' },
  { key: 'overallSatisfaction', label: 'Overall satisfaction' },
];
