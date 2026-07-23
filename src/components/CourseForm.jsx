import { useState, useEffect } from 'react';
import { validateCourse } from '../utils/validation';

export default function CourseForm({ course, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: '',
    code: '',
    instructor: '',
    semester: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (course) {
      setForm({
        name: course.name,
        code: course.code,
        instructor: course.instructor,
        semester: course.semester,
      });
    }
  }, [course]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateCourse(form);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    onSave(form);
  };

  return (
    <form className="form course-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Course Name</label>
        <input
          id="name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          placeholder="e.g. Introduction to Computer Science"
        />
        {errors.name && <span className="error-text">{errors.name}</span>}
      </div>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="code">Course Code</label>
          <input
            id="code"
            name="code"
            type="text"
            value={form.code}
            onChange={handleChange}
            placeholder="e.g. CS101"
          />
          {errors.code && <span className="error-text">{errors.code}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="semester">Semester</label>
          <input
            id="semester"
            name="semester"
            type="text"
            value={form.semester}
            onChange={handleChange}
            placeholder="e.g. Fall 2026"
          />
          {errors.semester && <span className="error-text">{errors.semester}</span>}
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="instructor">Instructor</label>
        <input
          id="instructor"
          name="instructor"
          type="text"
          value={form.instructor}
          onChange={handleChange}
          placeholder="e.g. Dr. Sarah Chen"
        />
        {errors.instructor && <span className="error-text">{errors.instructor}</span>}
      </div>
      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {course ? 'Update Course' : 'Add Course'}
        </button>
      </div>
    </form>
  );
}
